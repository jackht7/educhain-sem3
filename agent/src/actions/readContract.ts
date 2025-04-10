import {
  composeContext,
  elizaLogger,
  generateObjectDeprecated,
  generateText,
  HandlerCallback,
  ModelClass,
  type IAgentRuntime,
  type Memory,
  type State,
} from '@elizaos/core';
import type { ContractReadParams } from '../types';
import { codeAnalyzeTemplate, contractReadTemplate, nftMetadataTemplate } from '../templates/index.ts';
import { isValidField } from '../utils.ts';

export { contractReadTemplate, nftMetadataTemplate };

export class ContractReader {
  private readonly etherScanApiKey: string;
  private readonly scrollScanApiKey: string;
  private readonly educhainScanApiKey: string;

  constructor(private runtime: IAgentRuntime) {
    this.etherScanApiKey = this.runtime.getSetting('ETHERSCAN_API_KEY');
    this.scrollScanApiKey = this.runtime.getSetting('SCROLLSCAN_API_KEY');
    this.educhainScanApiKey = this.runtime.getSetting('EDUCHAINSCAN_API_KEY') ?? 'empty';
    if (!this.etherScanApiKey || !this.scrollScanApiKey) {
      elizaLogger.warn('Etherscan API key or Scrollscan API key not found in settings');
    }
  }

  async getContractABI(params: ContractReadParams) {
    elizaLogger.info(`Reading contract: ${params.contractAddress} on ${params.chain}`);
    const baseUrl = this.getExplorerEndpoint(params.chain);
    const chain = params.chain.toLowerCase();

    let apiKey: string;
    if (chain === 'ethereum' || chain === 'sepolia') {
      apiKey = this.etherScanApiKey;
    } else if (chain === 'scroll' || chain === 'scroll-sepolia') {
      apiKey = this.scrollScanApiKey;
    } else {
      apiKey = this.educhainScanApiKey;
    }

    try {
      // Get contract ABI
      const queryParams = new URLSearchParams({
        module: 'contract',
        action: 'getabi',
        address: params.contractAddress,
        apikey: apiKey,
      });

      const response = await fetch(`${baseUrl}/api?${queryParams}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === '1') {
        const abi = JSON.parse(data.result);
        const contractInfo = await this.getContractInfo(params.contractAddress, params.chain);
        const functions = abi
          .filter((item) => item.type === 'function')
          .map((func) => ({
            name: func.name,
            inputs: func.inputs,
            outputs: func.outputs,
            stateMutability: func.stateMutability,
          }));

        const events = abi
          .filter((item) => item.type === 'event')
          .map((event) => ({
            name: event.name,
            inputs: event.inputs,
          }));

        return {
          name: contractInfo.name,
          address: params.contractAddress,
          chain: params.chain,
          abi: abi,
          functions: functions,
          events: events,
          verified: true,
          contractCreator: contractInfo.creator,
          implementation: contractInfo.implementation,
          sourceCode: contractInfo.sourceCode,
        };
      } else {
        throw new Error(`Contract ABI not found: ${data.message}`);
      }
    } catch (error) {
      throw new Error(`Contract reading failed: ${error.message}`);
    }
  }

  async getContractInfo(address: string, chain: string) {
    const baseUrl = this.getExplorerEndpoint(chain);
    const apiKey = chain === 'scroll' || chain === 'scroll-sepolia' ? this.scrollScanApiKey : this.etherScanApiKey;

    try {
      const queryParams = new URLSearchParams({
        module: 'contract',
        action: 'getsourcecode',
        address: address,
        apikey: apiKey,
      });

      const response = await fetch(`${baseUrl}/api?${queryParams}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === '1' && data.result.length > 0) {
        const contractData = data.result[0];
        return {
          name: contractData.ContractName || 'Unknown',
          creator: contractData.ContractCreator || 'Unknown',
          sourceCode: contractData.SourceCode || null,
          implementation: contractData.Implementation || null,
        };
      }

      return {
        name: 'Unknown Contract',
        creator: 'Unknown',
        implementation: null,
      };
    } catch (error) {
      elizaLogger.error('Error fetching contract info:', error);
      return {
        name: 'Unknown Contract',
        creator: 'Unknown',
        implementation: null,
      };
    }
  }

  private getExplorerEndpoint(chain: string): string {
    const endpoints = {
      ethereum: 'https://api.etherscan.io',
      sepolia: 'https://api-sepolia.etherscan.io',
      scroll: 'https://api.scrollscan.com',
      'scroll-sepolia': 'https://api-sepolia.scrollscan.com',
      educhain: 'https://educhain.blockscout.com',
      'educhain-testnet': 'https://edu-chain-testnet.blockscout.com',
    };

    return endpoints[chain] || endpoints['ethereum'];
  }
}

const buildContractReadParams = async (state: State, runtime: IAgentRuntime): Promise<ContractReadParams> => {
  const context = composeContext({
    state,
    template: contractReadTemplate,
  });

  const contractReadDetails = (await generateObjectDeprecated({
    runtime,
    context,
    modelClass: ModelClass.SMALL,
  })) as ContractReadParams;

  return contractReadDetails;
};

export const readContract = {
  name: 'READ_CONTRACT',
  description: 'Read and analyze a smart contract using Etherscan or Scrollscan',
  handler: async (runtime: IAgentRuntime, _message: Memory, _state: State, _options: any, callback?: HandlerCallback) => {
    elizaLogger.info('Read contract action handler called');

    try {
      const contractParams = await buildContractReadParams(_state, runtime);
      const contractReader = new ContractReader(runtime);
      const contractData = await contractReader.getContractABI(contractParams);

      const sourceCodeState = await runtime.composeState(_message, {
        sourceCode: contractData.sourceCode,
      });
      const updatedState = await runtime.updateRecentMessageState(sourceCodeState);
      const context = composeContext({
        state: updatedState,
        template: codeAnalyzeTemplate,
      });
      const codeLogic = await generateText({ runtime, context, modelClass: ModelClass.SMALL });

      if (callback) {
        const functionsList = contractData.functions
          .map((f) => `- ${f.name}(${f.inputs.map((i) => `${i.type} ${i.name}`).join(', ')})${f.stateMutability === 'view' ? ' (read-only)' : ''}`)
          .join('\n');

        const eventsList = contractData.events.map((e) => `- ${e.name}(${e.inputs.map((i) => `${i.type} ${i.name}`).join(', ')})`).join('\n');

        callback({
          text: `Contract Analysis for ${contractData.name} (${contractData.address})
                  
Chain: ${contractData.chain}
Contract Creator: ${contractData.contractCreator}
${contractData.implementation ? `Implementation: ${contractData.implementation} (proxy contract)` : ''}

Main Functions:
${functionsList}

Events:
${eventsList}

Logic:
${codeLogic}

This contract ${contractData.verified ? 'is verified' : 'is not verified'}.`,
          content: contractData,
        });
      }

      return true;
    } catch (error) {
      elizaLogger.error('Error reading contract:', error);
      if (callback) {
        callback({
          text: `Error reading contract: ${error.message}`,
          content: { error: error.message },
        });
      }
      return false;
    }
  },
  template: contractReadTemplate,
  validate: async (runtime: IAgentRuntime, _message: Memory, _state: State) => {
    const etherScanApiKey = runtime.getSetting('ETHERSCAN_API_KEY');
    const scrollScanApiKey = runtime.getSetting('SCROLLSCAN_API_KEY');
    const hasApiKeys: boolean =
      typeof etherScanApiKey === 'string' && etherScanApiKey.length > 0 && typeof scrollScanApiKey === 'string' && scrollScanApiKey.length > 0;

    // TODO: Pass the contractParams to handle
    const contractParams = await buildContractReadParams(_state, runtime);
    const isReadContract: boolean = isValidField(contractParams.contractAddress) && isValidField(contractParams.chain);

    return hasApiKeys && isReadContract;
  },
  examples: [
    [
      {
        user: '{{user1}}',
        content: {
          text: 'Explain smart contract 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          action: 'READ_CONTRACT',
        },
      },
      {
        user: 'Agent',
        content: {
          text: "I'll analyze the smart contract at 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 for you",
          action: 'READ_CONTRACT',
        },
      },
    ],
  ],
  similes: ['EXPLAIN_CONTRACT', 'EXPLAIN_LOGIC', 'ANALYZE_CONTRACT'],
};
