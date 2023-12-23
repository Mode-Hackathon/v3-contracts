import type { HardhatUserConfig, NetworkUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-web3'
import '@nomiclabs/hardhat-truffle5'
import 'hardhat-abi-exporter'
import 'hardhat-contract-sizer'
import 'dotenv/config'
import 'hardhat-tracer'
import '@nomiclabs/hardhat-etherscan'
import 'solidity-docgen'
require('dotenv').config({ path: require('find-config')('.env') })
const evmVersion = 'berlin'

// const bscTestnet: NetworkUserConfig = {
//   url: 'https://rpc.ankr.com/bsc_testnet_chapel',
//   chainId: 97,
//   accounts: [process.env.KEY_TESTNET!],
// }

// const goerli: NetworkUserConfig = {
//   url: `https://eth-goerli.g.alchemy.com/v2/${process.env.GOERLI_API_KEY}`,
//   chainId: 5,
//   // accounts: [process.env.KEY_GOERLI!],
// }

// const bscMainnet: NetworkUserConfig = {
//   url: 'https://bsc-dataseed.binance.org/',
//   chainId: 56,
//   // accounts: [process.env.KEY_MAINNET!],
// }
const modeTestnet: NetworkUserConfig = {
  url: "https://sepolia.mode.network/",
  chainId: 919,
  accounts: [process.env.KEY_MODE!],
  gasPrice: 5000000000,
};
const bscTestnet: NetworkUserConfig = {
  url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  chainId: 97,
  accounts: [process.env.KEY_TESTNET!],
}

const bscMainnet: NetworkUserConfig = {
  url: 'https://bsc-dataseed.binance.org/',
  chainId: 56,
  accounts: [process.env.KEY_MAINNET!],
}

const goerli: NetworkUserConfig = {
  url: 'https://rpc.ankr.com/eth_goerli',
  chainId: 5,
  accounts: [process.env.KEY_GOERLI!],
}

const eth: NetworkUserConfig = {
  url: 'https://eth.llamarpc.com',
  chainId: 1,
  accounts: [process.env.KEY_ETH!],
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      forking: {
        url: bscTestnet.url || '',
      },
    },
    ...(process.env.KEY_TESTNET && { bscTestnet }),
    ...(process.env.KEY_MAINNET && { bscMainnet }),
    ...(process.env.KEY_GOERLI && { goerli }),
    ...(process.env.KEY_ETH && { eth }),
    ...(process.env.KEY_MODE && { modeTestnet }),
    // goerli: goerli,
    // mainnet: bscMainnet,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || '',
  },
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          evmVersion: 'berlin',
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.20',
        settings: {
          evmVersion,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.6',
        settings: {
          evmVersion,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.5.16',
        settings: {
          evmVersion,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.4.18',
        settings: {
          evmVersion,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
    overrides: {
      '@pancakeswap/v3-core/contracts/libraries/FullMath.sol': {
        version: '0.7.6',
        settings: {
          evmVersion,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      '@pancakeswap/v3-core/contracts/libraries/TickBitmap.sol': {
        version: '0.7.6',
        settings: {
          evmVersion,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      '@pancakeswap/v3-core/contracts/libraries/TickMath.sol': {
        version: '0.7.6',
        settings: {
          evmVersion,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      '@pancakeswap/v3-periphery/contracts/libraries/PoolAddress.sol': {
        version: '0.7.6',
        settings: {
          evmVersion,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      'contracts/libraries/PoolTicksCounter.sol': {
        version: '0.7.6',
        settings: {
          evmVersion,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      'contracts/libraries/OracleLibrary.sol': {
        version: '0.7.6',
        settings: {
          evmVersion,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  // abiExporter: {
  //   path: "./data/abi",
  //   clear: true,
  //   flat: false,
  // },
  docgen: {
    pages: 'files',
  },
}

export default config
