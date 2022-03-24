//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Staking is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    IERC20 public rewardsToken;
    IERC20 public stakingToken;

    uint256 private rewardRate = 10; 
    uint256 private rewardTime = 600;
    uint256 private claimTime = 1200;

    uint256 private _totalSupply;

    mapping(address => uint256) public rewards;
    mapping(address => uint256) private _balances;

    function getRewardsToken() external view returns(IERC20) {
        return rewardsToken;
    }

    function getStakingToken() external view returns(IERC20) {
        return stakingToken;
    }

    function getTotalSupply() external view returns(uint) {
        return _totalSupply;
    }

    function getRewardRate() external view returns(uint) {
        return rewardRate;
    }

    function setRewardRate(uint _newRate) external onlyRole(ADMIN_ROLE) {
        rewardRate = _newRate;
    }

    function getRewardTime() external view returns(uint) {
        return rewardTime;
    }

    function setRewardTime(uint _newTime) external onlyRole(ADMIN_ROLE) {
        rewardTime = _newTime;
    }

     function balanceOf(address _account) external view returns(uint){
        return _balances[_account];
    }

    constructor(address _stakingToken, address _rewardsToken) {
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
