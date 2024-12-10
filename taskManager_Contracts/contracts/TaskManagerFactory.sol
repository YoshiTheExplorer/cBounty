// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {TaskManager} from "./TaskManager.sol";

contract TaskManagerFactory {
    struct TaskManagerInfo {
        string name;
        address owner;
        bytes32 password;
        address taskManagerAddress;
        mapping(address => bool) members;
    }

    mapping(address => address[]) private userTaskManagers; //Users List of TaskManagers
    mapping(address => TaskManagerInfo) private taskManagers; //List of All TaskManagers
    mapping(address => string) private usernames; //List of All TaskManagers

    function changeUserName(string calldata newUsername) external {
        require(bytes(newUsername).length > 0, "Username cannot be empty");
        require(bytes(newUsername).length <= 20, "Username too long (max 20 characters)");

        usernames[msg.sender] = newUsername;
    }

    function createTaskManager(string memory name, string memory password) public {
        TaskManager taskManager = new TaskManager(msg.sender); //Link to Owner

        TaskManagerInfo storage taskManagerInfo = taskManagers[address(taskManager)];

        taskManagerInfo.name = name;
        taskManagerInfo.owner = msg.sender;
        taskManagerInfo.password = keccak256(abi.encodePacked(password));
        taskManagerInfo.taskManagerAddress = address(taskManager);
        taskManagerInfo.members[msg.sender] = true;

        userTaskManagers[msg.sender].push(address(taskManager));
    }

    function updatePassword(address taskManagerAddress, string memory newPassword) public {
        TaskManagerInfo storage taskManagerInfo = taskManagers[taskManagerAddress];

        require(taskManagerInfo.taskManagerAddress != address(0), "TaskManager does not exist");
        require(msg.sender == taskManagerInfo.owner, "Only the owner can update the password");

        taskManagerInfo.password = keccak256(abi.encodePacked(newPassword));
    }

    function joinTaskManager(address taskManagerAddress, string memory password) public {
        TaskManagerInfo storage taskManagerInfo = taskManagers[taskManagerAddress];

        require(taskManagerInfo.taskManagerAddress != address(0), "TaskManager does not exist");
        require(
            taskManagerInfo.password == keccak256(abi.encodePacked(password)),
            "Incorrect password"
        );

        taskManagerInfo.members[msg.sender] = true;
        userTaskManagers[msg.sender].push(taskManagerAddress);
    }

    function leaveTaskManager(address taskManagerAddress) public {
        TaskManagerInfo storage taskManagerInfo = taskManagers[taskManagerAddress];

        require(taskManagerInfo.members[msg.sender], "You are not a member of this TaskManager");

        taskManagerInfo.members[msg.sender] = false;
        address[] storage userTaskManagerList = userTaskManagers[msg.sender];
        for (uint256 i = 0; i < userTaskManagerList.length; i++) {
            if (userTaskManagerList[i] == taskManagerAddress) {
                userTaskManagerList[i] = userTaskManagerList[userTaskManagerList.length - 1];
                userTaskManagerList.pop();
                break;
            }
        }
    }

    function getUserName(address user) external view returns (string memory) {
        return usernames[user];
    }

    function getUserTaskManagers(address user) public view returns (address[] memory) {
        return userTaskManagers[user];
    }

    function getTaskManagerDetails(address taskManagerAddress) public view returns (string memory name, address owner, bool isMember) {
        TaskManagerInfo storage taskManagerInfo = taskManagers[taskManagerAddress];
        require(taskManagerInfo.taskManagerAddress != address(0), "TaskManager does not exist");

        return (
            taskManagerInfo.name,
            taskManagerInfo.owner,
            taskManagerInfo.members[msg.sender]
        );
    }

}
