// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {TaskManager} from "./TaskManager.sol";

contract TaskManagerFactory {
    mapping(address/*user*/ => address/*contract*/) private taskManagers;

    event TaskManagerCreated(address indexed user, address taskManagerAddress);

    function createTaskManager() public {
        require(!checkAccount(msg.sender), "TaskManager already exists for this address");
        
        TaskManager taskManager = new TaskManager(msg.sender);
        taskManagers[msg.sender] = address(taskManager);

        emit TaskManagerCreated(msg.sender, address(taskManager));
    }

    function checkAccount(address user) public view returns (bool) {
        return taskManagers[user] != address(0);
    }

    function getContract(address user) public view returns (address) {
        return taskManagers[user];
    }

}
