//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Staking is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    IERC20 public rewardsToken;
    IERC20 public stakingToken;

    uint256 public rewardRate = 10; // 10 minutes

    uint256 private _totalSupply;

    mapping(address => uint256) public rewards;
    mapping(address => uint256) private _balances;

    constructor(address _stakingToken, address _rewardsToken) {
        // _mint(msg.sender, initialSupply); не забудь передать initialSupply в конструкторе
        _setupRole(ADMIN_ROLE, msg.sender);
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
    }

     function stake(uint256 _amount) external {
        _totalSupply += _amount;
        _balances[msg.sender] += _amount;
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        // emit event maybe?
     }

     function unstake(uint256 _amount) external {
        _totalSupply -= _amount;
        _balances[msg.sender] -= _amount;
        stakingToken.transfer(msg.sender, _amount);
        // emit event maybe?
     }

     function claim() external {
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        rewardsToken.transfer(msg.sender, reward);
        // emit event maybe?
    }
}
