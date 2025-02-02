import { ethers, network } from 'hardhat'
import { configs } from '@pancakeswap/common/config'
// import { tryVerify } from '@pancakeswap/common/verify'
import { writeFileSync } from 'fs'

async function main() {
  // Remember to update the init code hash in SC for different chains before deploying
  const networkName = network.name
  const config = configs[networkName as keyof typeof configs]
  if (!config) {
    throw new Error(`No config found for network ${networkName}`)
  }

  console.log('deploying stable swap contracts')

  // const PancakeStableSwapLPFactory = await ethers.getContractFactory("PancakeStableSwapLPFactory")
  // const pancakeStableSwapLPFactory = await PancakeStableSwapLPFactory.deploy()
  // await pancakeStableSwapLPFactory.deployed()
  // console.log(pancakeStableSwapLPFactory.address)

  // const PancakeStableSwapTwoPoolDeployer = await ethers.getContractFactory('PancakeStableSwapTwoPoolDeployer')
  // const pancakeStableSwapTwoPoolDeployer = await PancakeStableSwapTwoPoolDeployer.deploy()
  // await pancakeStableSwapTwoPoolDeployer.deployed()

  const PancakeStableSwapThreePoolDeployer = await ethers.getContractFactory('PancakeStableSwapThreePoolDeployer')
  const pancakeStableSwapThreePoolDeployer = await PancakeStableSwapThreePoolDeployer.deploy()
  await pancakeStableSwapThreePoolDeployer.deployed()

  const StableFactory = await ethers.getContractFactory('PancakeStableSwapFactory')
  const stableFactory = await StableFactory.deploy('0xF84b1bdC7A44e9Bd9A74BE347FfC77410c982F01', '0x379b9386EE3039E5Ea2f97934F60C2Ed7Ae97E32', pancakeStableSwapThreePoolDeployer.address)
  await stableFactory.deployed()

  const PancakeStableSwapTwoPoolInfo = await ethers.getContractFactory('PancakeStableSwapTwoPoolInfo')
  const pancakeStableSwapTwoPoolInfo = await PancakeStableSwapTwoPoolInfo.deploy()
  await pancakeStableSwapTwoPoolInfo.deployed()

  const v3DeployedContracts = await import(`@pancakeswap/v3-core/deployments/${networkName}.json`)
  const v3PeripheryDeployedContracts = await import(`@pancakeswap/v3-periphery/deployments/${networkName}.json`)

  const pancakeV3PoolDeployer_address = v3DeployedContracts.PancakeV3PoolDeployer
  const pancakeV3Factory_address = v3DeployedContracts.PancakeV3Factory
  const positionManager_address = v3PeripheryDeployedContracts.NonfungiblePositionManager

  /** SmartRouterHelper */
  console.log('Deploying SmartRouterHelper...')
  const SmartRouterHelper = await ethers.getContractFactory('SmartRouterHelper')
  const smartRouterHelper = await SmartRouterHelper.deploy()
  console.log('SmartRouterHelper deployed to:', smartRouterHelper.address)
  // await tryVerify(smartRouterHelper)

  /** SmartRouter */
  console.log('Deploying SmartRouter...')
  const SmartRouter = await ethers.getContractFactory('SmartRouter', {
    libraries: {
      SmartRouterHelper: smartRouterHelper.address,
    },
  })
  const smartRouter = await SmartRouter.deploy(
    config.v2Factory,
    pancakeV3PoolDeployer_address,
    pancakeV3Factory_address,
    positionManager_address,
    stableFactory.address,
    pancakeStableSwapTwoPoolInfo.address,
    config.WNATIVE
  )
  console.log('SmartRouter deployed to:', smartRouter.address)

  // await tryVerify(smartRouter, [
  //   config.v2Factory,
  //   pancakeV3PoolDeployer_address,
  //   pancakeV3Factory_address,
  //   positionManager_address,
  //   stableFactory.address,
  //   pancakeStableSwapTwoPoolInfo.address,
  //   config.WNATIVE,
  // ])

  /** MixedRouteQuoterV1 */
  const MixedRouteQuoterV1 = await ethers.getContractFactory('MixedRouteQuoterV1', {
    libraries: {
      SmartRouterHelper: smartRouterHelper.address,
    },
  })
  const mixedRouteQuoterV1 = await MixedRouteQuoterV1.deploy(
    pancakeV3PoolDeployer_address,
    pancakeV3Factory_address,
    config.v2Factory,
    stableFactory.address,
    config.WNATIVE
  )
  console.log('MixedRouteQuoterV1 deployed to:', mixedRouteQuoterV1.address)

  // await tryVerify(mixedRouteQuoterV1, [
  //   pancakeV3PoolDeployer_address,
  //   pancakeV3Factory_address,
  //   config.v2Factory,
  //   stableFactory.address,
  //   config.WNATIVE,
  // ])

  /** QuoterV2 */
  const QuoterV2 = await ethers.getContractFactory('QuoterV2', {
    libraries: {
      SmartRouterHelper: smartRouterHelper.address,
    },
  })
  const quoterV2 = await QuoterV2.deploy(pancakeV3PoolDeployer_address, pancakeV3Factory_address, config.WNATIVE)
  console.log('QuoterV2 deployed to:', quoterV2.address)

  // await tryVerify(quoterV2, [pancakeV3PoolDeployer_address, pancakeV3Factory_address, config.WNATIVE])

  /** TokenValidator */
  const TokenValidator = await ethers.getContractFactory('TokenValidator', {
    libraries: {
      SmartRouterHelper: smartRouterHelper.address,
    },
  })
  const tokenValidator = await TokenValidator.deploy(config.v2Factory, positionManager_address)
  console.log('TokenValidator deployed to:', tokenValidator.address)

  // await tryVerify(tokenValidator, [config.v2Factory, positionManager_address])

  const contracts = {
    SmartRouter: smartRouter.address,
    SmartRouterHelper: smartRouterHelper.address,
    MixedRouteQuoterV1: mixedRouteQuoterV1.address,
    QuoterV2: quoterV2.address,
    TokenValidator: tokenValidator.address,
    stableFactory: stableFactory.address,
    swapInfo: pancakeStableSwapTwoPoolInfo.address
  }

  writeFileSync(`./deployments/${network.name}.json`, JSON.stringify(contracts, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
