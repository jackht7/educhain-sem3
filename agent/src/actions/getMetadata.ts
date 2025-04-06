import { ethers } from 'ethers';
import { IAgentRuntime, State, composeContext, generateObjectDeprecated, ModelClass, Memory, HandlerCallback, elizaLogger } from '@elizaos/core';
import { nftMetadataTemplate } from '../templates/index.ts';
import { NFTMetadataParams } from '../types';
import { isValidField } from '../utils.ts';

export class ContractReader {
  private readonly infuraApiKey: string;
  private readonly etherScanApiKey: string;
  private readonly scrollScanApiKey: string;

  constructor(private runtime: IAgentRuntime) {
    this.infuraApiKey = this.runtime.getSetting('INFURA_API_KEY');
    this.etherScanApiKey = this.runtime.getSetting('ETHERSCAN_API_KEY');
    this.scrollScanApiKey = this.runtime.getSetting('SCROLLSCAN_API_KEY');
    if (!this.infuraApiKey || !this.etherScanApiKey || !this.scrollScanApiKey) {
      elizaLogger.warn('Infura API key/ Etherscan API key/ Scrollscan API key not found in settings');
    }
  }

  async getNFTMetadata(params: NFTMetadataParams) {
    elizaLogger.info(`Getting NFT metadata for token ${params.tokenId} at contract ${params.contractAddress} on ${params.chain}`);

    const infuraBaseUrl = this.getInfuraEndpoint(params.chain);
    const explorerBaseUrl = this.getExplorerEndpoint(params.chain);
    const provider = new ethers.JsonRpcProvider(`${infuraBaseUrl}/${this.infuraApiKey}`);
    const contractAddress = params.contractAddress;
    const tokenId = params.tokenId;
    const chain = params.chain.toLowerCase();
    const apiKey = chain === 'scroll' || chain === 'scroll-sepolia' ? this.scrollScanApiKey : this.etherScanApiKey;

    try {
      // Check if it's ERC721 or ERC1155
      const queryParams = new URLSearchParams({
        module: 'contract',
        action: 'getabi',
        address: params.contractAddress,
        apikey: apiKey,
      });

      const response = await fetch(`${explorerBaseUrl}/api?${queryParams}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== '1') {
        throw new Error(`Contract not found or not verified: ${data.message}`);
      }

      const abi = JSON.parse(data.result);

      const tokenURIFunction = abi.find((item) => item.type === 'function' && (item.name === 'tokenURI' || item.name === 'uri'));

      if (!tokenURIFunction) {
        throw new Error('Contract does not appear to be an NFT contract (ERC721/ERC1155)');
      }

      const contract = new ethers.Contract(contractAddress, abi, provider);
      const tokenURI = await contract.tokenURI(tokenId);
      elizaLogger.info(`Token URI: ${tokenURI}`);

      let metadata;
      let metadataUrl = tokenURI;
      if (tokenURI.startsWith('ipfs://')) {
        metadataUrl = `https://ipfs.io/ipfs/${tokenURI.replace('ipfs://', '')}`;
      }

      const metadataResponse = await fetch(metadataUrl);
      if (!metadataResponse.ok) {
        throw new Error(`Failed to fetch metadata from URI: ${tokenURI}`);
      }

      metadata = await metadataResponse.json();

      return {
        contractAddress: params.contractAddress,
        tokenId: params.tokenId,
        chain: params.chain,
        name: metadata.name || `NFT #${tokenId}`,
        description: metadata.description || 'No description available',
        image: metadata.image || null,
        attributes: metadata.attributes || [{ trait_type: 'Unknown', value: 'Unknown' }],
        standard: tokenURIFunction.name === 'tokenURI' ? 'ERC721' : 'ERC1155',
      };
    } catch (error) {
      throw new Error(`NFT metadata retrieval failed: ${error.message}`);
    }
  }

  private getInfuraEndpoint(chain: string): string {
    const endpoints = {
      ethereum: 'https://mainnet.infura.io/v3',
      sepolia: 'https://sepolia.infura.io/v3',
      scroll: 'https://scroll-mainnet.infura.io/v3',
      'scroll-sepolia': 'https://scroll-sepolia.infura.io/v3',
    };

    return endpoints[chain] || endpoints['ethereum'];
  }

  private getExplorerEndpoint(chain: string): string {
    const endpoints = {
      ethereum: 'https://api.etherscan.io',
      sepolia: 'https://api-sepolia.etherscan.io',
      scroll: 'https://api.scrollscan.com',
      'scroll-sepolia': 'https://api-sepolia.scrollscan.com',
    };

    return endpoints[chain] || endpoints['ethereum'];
  }
}

const buildNFTMetadataParams = async (state: State, runtime: IAgentRuntime): Promise<NFTMetadataParams> => {
  const context = composeContext({
    state,
    template: nftMetadataTemplate,
  });

  const nftMetadataDetails = (await generateObjectDeprecated({
    runtime,
    context,
    modelClass: ModelClass.SMALL,
  })) as NFTMetadataParams;

  return nftMetadataDetails;
};

export const getMetadata = {
  name: 'GET_METADATA',
  description: 'Get metadata of an NFT using Infura',
  handler: async (runtime: IAgentRuntime, _message: Memory, _state: State, _options: any, callback?: HandlerCallback) => {
    elizaLogger.info('Get NFT metadata action handler called');

    try {
      const nftParams = await buildNFTMetadataParams(_state, runtime);
      const contractReader = new ContractReader(runtime);
      const metadata = await contractReader.getNFTMetadata(nftParams);

      if (callback) {
        callback({
          text: `NFT Metadata for token #${metadata.tokenId} at ${metadata.contractAddress}
                  
Name: ${metadata.name}
Description: ${metadata.description}
Standard: ${metadata.standard}
Chain: ${metadata.chain}

Attributes:
${metadata.attributes.map((attr) => `- ${attr.trait_type}: ${attr.value}`).join('\n')}`,
          content: metadata,
        });
      }

      return true;
    } catch (error) {
      elizaLogger.error('Error getting NFT metadata:', error);
      if (callback) {
        callback({
          text: `Error retrieving NFT metadata: ${error.message}`,
          content: { error: error.message },
        });
      }
      return false;
    }
  },
  template: nftMetadataTemplate,
  validate: async (runtime: IAgentRuntime, _message: Memory, _state: State) => {
    const infuraKey = runtime.getSetting('INFURA_API_KEY');
    const hasApiKey = typeof infuraKey === 'string' && infuraKey.length > 0;

    // TODO: Pass the contractParams to handle
    const contractParams = await buildNFTMetadataParams(_state, runtime);
    const isGetMetadata: boolean = isValidField(contractParams.contractAddress) && isValidField(contractParams.chain) && isValidField(contractParams.tokenId);
    return hasApiKey && isGetMetadata;
  },
  examples: [
    [
      {
        user: '{{user1}}',
        content: {
          text: 'Show me the metadata for NFT #123 at 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          action: 'GET_METADATA',
        },
      },
      {
        user: 'Agent',
        content: {
          text: "I'll get the metadata for NFT #123 at contract 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 for you",
          action: 'GET_METADATA',
        },
      },
    ],
  ],
  similes: ['GET_NFT_METADATA', 'NFT_INFO', 'TOKEN_METADATA'],
};
