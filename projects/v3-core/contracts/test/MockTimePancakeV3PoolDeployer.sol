// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import '../interfaces/IPancakeV3PoolDeployer.sol';

import './MockTimePancakeV3Pool.sol';

contract MockTimePancakeV3PoolDeployer is IPancakeV3PoolDeployer {
    struct Parameters {
        address factory;
        address token0;
        address token1;
        uint24 fee;
        int24 tickSpacing;
    }

    address SFSAddress;

    Parameters public override parameters;

    event PoolDeployed(address pool);

    function deploy(
        address factory,
        address token0,
        address token1,
        uint24 fee,
        int24 tickSpacing
    ) external override returns (address pool) {
        parameters = Parameters({factory: factory, token0: token0, token1: token1, fee: fee, tickSpacing: tickSpacing});
        pool = address(
            new MockTimePancakeV3Pool{salt: keccak256(abi.encodePacked(token0, token1, fee, tickSpacing))}(SFSAddress)
        );
        emit PoolDeployed(pool);
        delete parameters;
    }
}
