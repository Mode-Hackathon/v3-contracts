// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.5;

interface IPancakeStableSwapLP {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    function mint(address _to, uint256 _amount) external;

    function burnFrom(address _to, uint256 _amount) external;

    function setMinter(address _newMinter) external;
}
