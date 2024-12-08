// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskManager {
    address payable private owner;

    struct Task {
        string name;
        string description;
        uint256 bounty;
        uint256 dueDate;
    }

    Task[] private taskList;

    constructor(address owner_address) {
        owner = payable(owner_address);
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addTask(string memory _name, string memory _description, uint256 _dueDate) public payable onlyOwner{
        taskList.push(Task(_name, _description, msg.value, _dueDate));
    }

    function completeTask(uint _index) public onlyOwner{
        require(_index < taskList.length, "Index out of bounds.");

        require(msg.sender == owner, "caller is not the owner");
        payable(msg.sender).transfer(taskList[_index].bounty);

        for(uint i = _index; i < taskList.length -1; i++){
            taskList[i] = taskList[i + 1];
        }
        taskList.pop();
    }

    function donateTask(uint _index, address charity) public onlyOwner{ //TODO Complete
        require(_index < taskList.length, "Index out of bounds.");
        payable(charity).transfer(taskList[_index].bounty);

        for(uint i = _index; i < taskList.length -1; i++){
            taskList[i] = taskList[i + 1];
        }
        taskList.pop();
    }

    function getList() public view returns(Task[] memory){
        return taskList;
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

    function getOwner() public view returns(address){
        return owner;
    }

}