// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0;

interface Register {
    function register(address _recipient) external returns (uint256 tokenId);
}
