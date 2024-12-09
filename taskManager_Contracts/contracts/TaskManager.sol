// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskManager {
    address payable private admin;

    struct Task {
        string name;
        string description;
        uint256 bounty;
        uint256 dueDate;
        address completedBy;
        bool isCompleted;
    }

    Task[] private taskList;

    constructor(address admin_address) {
        admin = payable(admin_address);
    }

    function addTask(string memory name, string memory description, uint256 dueDate) public payable {
        require(msg.sender == admin, "Only admin can call this function");
        taskList.push(Task(name, description, msg.value, dueDate, address(0), false));
    }

    function markTaskCompleted(uint256 _index) public {
        require(_index < taskList.length, "Task does not exist");
        Task storage task = taskList[_index];

        require(!task.isCompleted, "Task already marked as completed");
        task.completedBy = msg.sender;
        task.isCompleted = true;
    }

    function approveTaskCompletion(uint256 _index) public {
        require(msg.sender == admin, "Only admin can call this function");
        require(_index < taskList.length, "Task does not exist");

        Task storage task = taskList[_index];

        if (!task.isCompleted) {
            task.completedBy = admin;
            task.isCompleted = true;
        }

        require(task.completedBy != address(0), "No valid completer for this task");
        payable(task.completedBy).transfer(task.bounty);

        for (uint256 i = _index; i < taskList.length - 1; i++) {
            taskList[i] = taskList[i + 1];
        }
        taskList.pop();
    }

    function rejectTaskCompletion(uint256 _index) public {
        require(msg.sender == admin, "Only admin can call this function");
        require(_index < taskList.length, "Task does not exist");

        Task storage task = taskList[_index];

        require(task.isCompleted, "Task not marked as completed");

        task.completedBy = address(0);
        task.isCompleted = false;
    }

    function getList() public view returns(Task[] memory){
        return taskList;
    }

    function getAdmin() public view returns(address){
        return admin;
    }

}