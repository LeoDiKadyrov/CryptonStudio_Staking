//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Staking is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    IERC20 public rewardsToken;
    IERC20 public stakingToken;
    uint private lastUpdateTime;

    uint private rewardRate = 10; 
    uint private rewardTime = 600;
    uint private claimTime = 1200;

    uint private _totalSupply;

    mapping(address => uint) private _rewards;
    mapping(address => uint) private _balances;
    mapping(address => uint) private _stakingTime;

    event Staked(address indexed user, uint amount);

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

    function getClaimTime() external view returns(uint) {
        return claimTime;
    }

    function getStakingTime(address _account) external view returns(uint) {
        return _stakingTime[_account];
    }

    function balanceOf(address _account) external view returns(uint){
        return _balances[_account];
    }

    function getLastUpdateTime() external view returns(uint){
        return lastUpdateTime;
    }

    function setLastUpdateTime() public {
        lastUpdateTime = block.timestamp;
    }

    constructor(address _stakingToken, address _rewardsToken) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
        _setupRole(ADMIN_ROLE, msg.sender);
    }
    
    modifier updateReward(address _account) {
        _rewards[_account] += earned(_account);
        _;
    }

    modifier checkStakingTime(address _account) {
        setLastUpdateTime();
        require(_stakingTime[_account] < lastUpdateTime, "Staking time is still not ended");
        _;
    }

    function earned(address _account) public view returns (uint) {
        uint rewardForAccount = _balances[_account] / 100 * rewardRate;
        return ((lastUpdateTime - _stakingTime[_account]) / rewardTime * rewardForAccount);
    }

     function stake(uint _amount) external updateReward(msg.sender) {
        require(_amount > 0, "Cannot stake nothing");
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        _totalSupply += _amount;
        _balances[msg.sender] += _amount;
        _stakingTime[msg.sender] = claimTime + block.timestamp;
        emit Staked(msg.sender, _amount);
     }

     function unstake(uint _amount) external checkStakingTime(msg.sender) {
        require(_amount > 0, "Cannot unstake nothing");
        stakingToken.transfer(msg.sender, _amount);
        _totalSupply -= _amount;
        _balances[msg.sender] -= _amount;
     }

     function claim() external updateReward(msg.sender) checkStakingTime(msg.sender) {
        uint reward = _rewards[msg.sender];
        _rewards[msg.sender] = 0;
        rewardsToken.transfer(msg.sender, reward);
    }
}
