import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/.env' });
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '';

const config: HardhatUserConfig = {
  solidity: '0.8.27',
  networks: {
    'edu-chain-testnet': {
      url: `https://rpc.open-campus-codex.gelato.digital`,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    'edu-chain': {
      url: `https://rpc.edu-chain.raas.gelato.cloud`,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      'edu-chain-testnet': 'empty',
      'edu-chain': 'empty',
    },
    customChains: [
      {
        network: 'edu-chain-testnet',
        chainId: 656476,
        urls: {
          apiURL: 'https://edu-chain-testnet.blockscout.com/api',
          browserURL: 'https://edu-chain-testnet.blockscout.com',
        },
      },
      {
        network: 'edu-chain',
        chainId: 41923,
        urls: {
          apiURL: 'https://educhain.blockscout.com/api',
          browserURL: 'https://educhain.blockscout.com',
        },
      },
    ],
  },
};

export default config;
