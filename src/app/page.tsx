"use client";

import { client } from "./client";

import { ConnectButton, useActiveAccount, useReadContract, TransactionButton } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";
import { getContract, prepareContractCall } from "thirdweb";
import { TaskCards } from "./components/TaskCards";
import { AddTaskButton } from "./components/AddCard";
import { AddTaskManager } from "./components/AddTaskManager";
import { TASKMANAGER_FACTORY } from "./constants/contracts";
import { useTaskManagerStore } from "./states";
import React, { useState } from "react";

export default function Home() {
  // Get User Address
  const userAddress = useActiveAccount()?.address;
  const userAddressString = userAddress || "0";

  // State Machine
  const { viewMainPage, currentTaskManagerAddress } = useTaskManagerStore();

  // Initialize the TASKMANAGER_FACTORY contract
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: TASKMANAGER_FACTORY,
  });

  // Fetch user's list of task managers
  const { data: taskManagers } = useReadContract({
    contract,
    method: "function getUserTaskManagers(address user) view returns (address[])",
    params: [userAddressString],
  });

  // Fetch username
  const { data: user } = useReadContract({
    contract,
    method:
      "function getUserName(address user) view returns (string)",
    params: [userAddressString],
  });

  const taskManagerList = taskManagers ? [...taskManagers] : [];
  const username = user || userAddressString;

  //Welcome Page
  if (!userAddress) {
    return (<WelcomePage />)
  }

  //Task Page
  if (viewMainPage && currentTaskManagerAddress) {
    return <MainPage contractAddress={currentTaskManagerAddress} />;
  }

  //Task Library Page
  return (<TaskLibrary
    taskManagers={taskManagerList}
    username={username}
  />)
}

function WelcomePage() {
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-10 text-center">Welcome to cBounty</h1>
        <h2 className="text-1xl font-bold mb-4 text-center">Please Connect Your Wallet</h2>
        <div className="flex items-center justify-center w-full">
          <ConnectButton
            client={client}
            appMetadata={{ name: "TaskChain" }}
          />
        </div>
      </div>
    </main>
  );
}

function TaskLibrary({ taskManagers, username }: { taskManagers: string[]; username: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold mb-4">Projects:</h1>
          <button
            className="px-1 py-0.5 bg-blue-700 text-white text-xs rounded-md hover:bg-blue-800"
            onClick={() => setIsModalOpen(true)}
          >
            Change Username ({username})
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {taskManagers.length > 0 ? (
            taskManagers.map((taskManagerAddress, index) => (
              <TaskManagerCards
                key={taskManagerAddress}
                contractAddress={taskManagerAddress}
                index={index}
              />
            ))
          ) : (null)}
          <AddTaskManager contractAddress={TASKMANAGER_FACTORY} />
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="p-6 bg-gray-800 rounded-lg shadow-md max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Change Username</h2>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
              <TransactionButton
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                transaction={() =>
                  prepareContractCall({
                    contract: getContract({
                      client: client,
                      chain: baseSepolia,
                      address: TASKMANAGER_FACTORY,
                    }),
                    method: "function changeUserName(string newUsername)",
                    params: [newUsername],
                  })
                }
                onTransactionConfirmed={() => {
                  alert("Username changed successfully!");
                  setIsModalOpen(false);
                  setNewUsername("");
                }}
                onError={(error) => {
                  console.error("Error changing username:", error);
                  alert("Failed to change username. Please try again.");
                }}
              >
                Change Username
              </TransactionButton>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function MainPage({ contractAddress }: { contractAddress: string }) {
  const { setViewMainPage } = useTaskManagerStore();

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: TASKMANAGER_FACTORY,
  });

  const { data: tasks } = useReadContract({
    contract: getContract({
      client: client,
      chain: baseSepolia,
      address: contractAddress,
    }),
    method:
      "function getList() view returns ((string name, string description, uint256 bounty, uint256 dueDate, address completedBy, bool isComplete)[])",
    params: [],
  });

  const { data: isAdmin } = useReadContract({
    contract: getContract({
      client: client,
      chain: baseSepolia,
      address: contractAddress,
    }),
    method:
      "function getAdmin() view returns (address)",
    params: [],
  });

  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getTaskManagerDetails(address taskManagerAddress) view returns (string name, address owner, bool isMember)",
    params: [contractAddress],
  });

  if (isPending || !data) return <p>Loading Tasks...</p>;

  const [projectName, owner, isMember] = data;

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4">Tasks for {projectName}:</h1>
        <div className="grid grid-cols-3 gap-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <TaskCards
                key={task.name}
                contractAddress={contractAddress}
                index={index}
              />
            ))
          ) : null}
          {isAdmin && <AddTaskButton contractAddress={contractAddress} />}
          {/* FIXME Sort By Time */}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white px-4 py-2 shadow-lg flex justify-between items-center">
        <div className="text-sm">
          Project Address: <span className="font-mono">{contractAddress}</span>
        </div>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
          onClick={() => setViewMainPage(false)}
        >
          Back to Project Gallery
        </button>
      </div>
    </main>
  );
}

const TaskManagerCards: React.FC<{ contractAddress: string; index: number }> = ({ contractAddress, index }) => {

  const { setViewMainPage, setCurrentTaskManagerAddress } = useTaskManagerStore();

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: TASKMANAGER_FACTORY,
  });

  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getTaskManagerDetails(address taskManagerAddress) view returns (string name, address owner, bool isMember)",
    params: [contractAddress],
  });

  if (isPending) return <p>Loading Projects...</p>;
  if (!data) return <p>No Projects found.</p>;

  const [projectName, owner, isMember] = data;

  return (
    <>
      <div className="flex flex-col justify-between max-w-sm p-6 bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-lg shadow-lg space-y-4">
        <h5 className="text-2xl font-bold text-white">{projectName}</h5>

        <div className="flex justify-between space-x-4">

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => {
              setViewMainPage(true);
              setCurrentTaskManagerAddress(contractAddress);
            }}
          >
            Enter Project
          </button>

          <TransactionButton
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-400 rounded-lg hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-400"
            transaction={() =>
              prepareContractCall({
                contract,
                method:
                  "function leaveTaskManager(address taskManagerAddress)",
                params: [contractAddress],
              })
            }
            onError={(error) => alert(`Error: ${error.message}`)}
          >
            Leave Project
          </TransactionButton>

        </div>
      </div>

    </>
  );
};

