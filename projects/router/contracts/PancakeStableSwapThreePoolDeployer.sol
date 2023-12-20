// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import '@openzeppelin/contracts/access/Ownable.sol';
import './PancakeStableSwapThreePool.sol';

contract PancakeStableSwapThreePoolDeployer is Ownable {
    uint256 public constant N_COINS = 3;

    /**
     * @notice constructor
     */
    constructor() {}

    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(
        address tokenA,
        address tokenB,
        address tokenC
    ) internal pure returns (address, address, address) {
        require(tokenA != tokenB && tokenA != tokenC && tokenB != tokenC, 'IDENTICAL_ADDRESSES');
        address tmp;
        if (tokenA > tokenB) {
            tmp = tokenA;
            tokenA = tokenB;
            tokenB = tmp;
        }
        if (tokenB > tokenC) {
            tmp = tokenB;
            tokenB = tokenC;
            tokenC = tmp;
            if (tokenA > tokenB) {
                tmp = tokenA;
                tokenA = tokenB;
                tokenB = tmp;
            }
        }
        return (tokenA, tokenB, tokenC);
    }

    /**
     * @notice createSwapPair
     * @param _tokenA: Addresses of ERC20 conracts .
     * @param _tokenB: Addresses of ERC20 conracts .
     * @param _tokenC: Addresses of ERC20 conracts .
     * @param _A: Amplification coefficient multiplied by n * (n - 1)
     * @param _fee: Fee to charge for exchanges
     * @param _admin_fee: Admin fee
     * @param _admin: Admin
     * @param _LP: LP
     */
    // function createSwapPair(
    //     address _tokenA,
    //     address _tokenB,
    //     address _tokenC,
    //     uint256 _A,
    //     uint256 _fee,
    //     uint256 _admin_fee,
    //     address _admin,
    //     address _LP
    // ) external onlyOwner returns (address) {
    //     require(_tokenA != address(0) && _tokenB != address(0) && _tokenA != _tokenB, 'Illegal token');
    //     (address t0, address t1, address t2) = sortTokens(_tokenA, _tokenB, _tokenC);
    //     address[N_COINS] memory coins = [t0, t1, t2];
    //     // create swap contract
    //     bytes memory bytecode = type(PancakeStableSwapThreePool).creationCode;
    //     uint256 chainId;
    //     assembly {
    //         chainId := chainid()
    //     }
    //     bytes32 salt = keccak256(abi.encodePacked(t0, t1, t2, msg.sender, block.timestamp, chainId));
    //     address swapContract;
    //     assembly {
    //         swapContract := create2(0, add(bytecode, 32), mload(bytecode), salt)
    //     }

    //     PancakeStableSwapThreePool(swapContract).initialize(coins, _A, _fee, _admin_fee, _admin, _LP);

    //     return swapContract;
    // }
    // Define a struct to hold deployment parameters
    struct SwapDeploymentParams {
        address tokenA;
        address tokenB;
        address tokenC;
        address admin;
        address LP;
        uint256 A;
        uint256 fee;
        uint256 admin_fee;
    }

    function createSwapPair(
        address _tokenA,
        address _tokenB,
        address _tokenC,
        uint256 _A,
        uint256 _fee,
        uint256 _admin_fee,
        address _admin,
        address _LP
    ) external onlyOwner returns (address) {
        require(_tokenA != address(0) && _tokenB != address(0) && _tokenA != _tokenB, 'Illegal token');

        SwapDeploymentParams memory deploymentParams = SwapDeploymentParams({
            tokenA: _tokenA,
            tokenB: _tokenB,
            tokenC: _tokenC,
            admin: _admin,
            LP: _LP,
            A: _A,
            fee: _fee,
            admin_fee: _admin_fee
        });

        // Deploy the swap contract
        address swapContract = deploySwapContract(deploymentParams);

        // Initialize the swap contract
        initializeSwapContract(swapContract, deploymentParams);

        // ... (remaining code)

        return swapContract;
    }

    function getChainId() internal pure returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    function deploySwapContract(SwapDeploymentParams memory params) internal returns (address) {
        uint256 chainId = getChainId();
        bytes32 salt = keccak256(
            abi.encodePacked(params.tokenA, params.tokenB, params.tokenC, msg.sender, block.timestamp, chainId)
        );
        address swapContract;
        bytes memory bytecode = type(PancakeStableSwapThreePool).creationCode;
        assembly {
            swapContract := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        return swapContract;
    }

    function initializeSwapContract(address _swapContract, SwapDeploymentParams memory params) internal {
        // Initialize the swap contract using params
        PancakeStableSwapThreePool(_swapContract).initialize(
            [params.tokenA, params.tokenB, params.tokenC],
            params.A,
            params.fee,
            params.admin_fee,
            params.admin,
            params.LP
        );
        // ... (any additional initialization logic)
    }
}
