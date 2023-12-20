// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import '@openzeppelin/contracts/access/Ownable.sol';
import './PancakeStableSwapLP.sol';

contract PancakeStableSwapLPFactory is Ownable {
    event NewStableSwapLP(address indexed swapLPContract, address tokenA, address tokenB, address tokenC);

    constructor() {}

    /**
     * @notice createSwapLP
     * @param _tokenA: Addresses of ERC20 conracts .
     * @param _tokenB: Addresses of ERC20 conracts .
     * @param _tokenC: Addresses of ERC20 conracts .
     * @param _minter: Minter address
     */
    function createSwapLP(
        address _tokenA,
        address _tokenB,
        address _tokenC,
        address _minter
    ) external onlyOwner returns (address) {
        // create LP token
        bytes memory bytecode = type(PancakeStableSwapLP).creationCode;
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        bytes32 salt = keccak256(abi.encodePacked(_tokenA, _tokenB, _tokenC, msg.sender, block.timestamp, chainId));
        address lpToken;
        assembly {
            lpToken := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        PancakeStableSwapLP(lpToken).setMinter(_minter);
        emit NewStableSwapLP(lpToken, _tokenA, _tokenB, _tokenC);
        return lpToken;
    }
}
