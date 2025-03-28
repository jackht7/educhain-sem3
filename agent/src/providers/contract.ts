import { formatMessages, IAgentRuntime, Memory, MemoryManager, Provider, State } from '@elizaos/core';

export const contractProvider: Provider = {
  async get(runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<string | null> {
    try {
      const recentMessagesData = _state?.recentMessagesData?.slice(-10);
      let contractAddress = null;
      let isMetadataRequest = false;

      if (recentMessagesData) {
        const recentMessages = formatMessages({
          messages: recentMessagesData,
          actors: _state?.actorsData,
        });

        // Regex to find Ethereum contract addresses in messages
        const addressRegex = /0x[a-fA-F0-9]{40}/g;
        const matches = recentMessages.match(addressRegex);

        if (matches && matches.length > 0) {
          contractAddress = matches[0];
        }

        // Check if the user is asking for metadata or NFT-related details
        isMetadataRequest = /metadata|nft|token/i.test(recentMessages);
      }

      const memoryManager = new MemoryManager({
        runtime,
        tableName: 'contracts',
      });

      // Get details from memory
      let contractDetails = null;
      if (contractAddress) {
        const contractMemories = await memoryManager.getMemories({
          roomId: _message.roomId,
          count: 1,
        });

        if (contractMemories.length > 0) {
          contractDetails = contractMemories[0];
        }
      }

      // TODO: Store memory in action
      if (isMetadataRequest) {
        return `Contract Address: ${contractAddress}\n\n${runtime.character.name} needs a token id to proceed. Please provide a valid token ID for the NFT (e.g., 123).`;
      }

      if (contractDetails) {
        return `Contract Information:\nAddress: ${contractAddress}\nName: ${contractDetails.metadata?.name || 'Unknown'}\nNetwork: ${
          contractDetails.metadata?.network || 'Unknown'
        }\nStandard: ${contractDetails.metadata?.standard || 'Unknown'}`;
      } else if (contractAddress) {
        return `Contract Address: ${contractAddress}\n\n${runtime.character.name} needs more information about this contract. Could you specify the contract's network? (e.g., Ethereum, Binance Smart Chain, etc.)`;
      } else {
        return `${runtime.character.name} needs a contract address to proceed. Please provide a valid Ethereum contract address starting with 0x.`;
      }
    } catch (error) {
      console.error('Error in contract provider:', error);
      return null;
    }
  },
};
