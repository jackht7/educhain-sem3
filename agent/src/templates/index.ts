export const contractReadTemplate = `Given the recent messages below:

{{recentMessages}}

Extract information about the smart contract that the user wants to analyze:
- Contract address: Must be a valid Ethereum address starting with "0x"
- Chain: The blockchain network where the contract is deployed

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    {{#if contractAddress}}
    "contractAddress": "{{contractAddress}}",
    {{/if}}
    {{#if chain}}
    "chain": "ethereum" | "sepolia" | "scroll" | "scroll-sepolia" | "educhain" | "educhain-testnet",
    {{/if}}
}
\`\`\`
`;

export const nftMetadataTemplate = `Given the recent messages below:

{{recentMessages}}

Extract information about the NFT that the user wants metadata for:
- Contract address: The NFT contract address (must start with "0x")
- Token ID: The specific NFT token ID
- Chain: The blockchain network where the NFT exists

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    {{#if contractAddress}}
    "contractAddress": "{{contractAddress}}",
    {{/if}}
    {{#if chain}}
    "chain": "ethereum" | "sepolia" | "scroll" | "scroll-sepolia" | "educhain" | "educhain-testnet",
    {{/if}}
    {{/if}}
    {{#if tokenId}}
    "tokenId": "{{tokenId}}",
    {{/if}}
}
\`\`\`
`;

export const codeAnalyzeTemplate = `# Task:
{{recentMessages}}
{{sourceCode}}

Analyse the source code retrieved from action READ_CONTRACT, explain the logic in smart contract
`;
