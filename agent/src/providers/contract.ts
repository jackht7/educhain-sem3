import { formatMessages, IAgentRuntime, Memory, MemoryManager, Provider, State } from '@elizaos/core';

export const contractProvider: Provider = {
  async get(runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<string | null> {
    try {
      const recentMessageData = _state?.recentMessagesData?.slice(-1);
      let contractAddress = null;
      let isMetadataRequest = false;

      if (recentMessageData && recentMessageData.length > 0) {
        const recentMessage = formatMessages({
          messages: recentMessageData,
          actors: _state?.actorsData,
        });

        // Regex to find Ethereum contract addresses in messages
        const addressRegex = /0x[a-fA-F0-9]{40}/g;
        const matches = recentMessage.match(addressRegex);

        if (matches && matches.length > 0) {
          contractAddress = matches[0];
        }

        // Check if the user is asking for metadata or NFT-related details
        isMetadataRequest = /metadata|nft|token/i.test(recentMessage);
      }

      // const memoryManager = new MemoryManager({
      //   runtime,
      //   tableName: 'contracts',
      // });

      // Get details from memory
      // let contractDetails = null;
      // if (contractAddress) {
      //   const contractMemories = await memoryManager.getMemories({
      //     roomId: _message.roomId,
      //     count: 1,
      //   });

      //   if (contractMemories.length > 0) {
      //     contractDetails = contractMemories[0];
      //   }
      // }

      if (isMetadataRequest) return 'Call GET_METADATA action only.';
      if (contractAddress) return 'Call READ_CONTRACT action only.';
    } catch (error) {
      console.error('Error in contract provider:', error);
      return null;
    }
  },
};
