// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.5;

interface IPancakeStableSwapLPFactory {
    function createSwapLP(
        address _tokenA,
        address _tokenB,
        address _tokenC,
        address _minter
    ) external returns (address);
}
