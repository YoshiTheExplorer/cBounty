# TaskChain
**Colin Yamada**  
Email: [cyamada@wisc.edu](mailto:cyamada@wisc.edu)

---

## Introduction

**TaskChain** is a platform where users are able to stake their ETH onto personal tasks that needs to be completed. 

- If the task is completed on time, the user gets their ETH back.  

However, the twist is...

- If the deadline is missed, the ETH is donated to a charity of the user’s choice.  

This platform's goal is to provide a win-win scenario for users to stay motivated to complete their goals while also supporting meaningful causes.

---

## Demo

Link Here

---

## How It Was Built 

1. **Smart Contracts (Solidity)**  
   - **TaskManagerFactory**: Acts as a user database, storing addresses of all users and their respective `TaskManager` smart contracts. For new users, it creates a `TaskManager` contract.
   - **TaskManager**: Manages each user's tasks,  such as the task name, description, due date, and the chosen charity's address. It handles the ETH staked for each task, its allocation, and overall management.

2. **Frontend (React.js / TypeScript / ThirdWeb)**  
   - Used a development platform called ThirdWeb to deploy the smart contracts and access the functions within it. This made the bridge between the backend and the frontend smooth and possible. 
---

## Challenges

1. **Smart Contract Efficiency**  
   - Reducing gas fees by optimizing the Smart Contract.

2. **Secure Data Handling**  
   - Safely storing user data and their associated `TaskManager` contracts.

3. **Frontend Integration**  
   - Since this was my first time attempting to connect the smart contract to the Frontend, there was trouble finding solutions online and molding it and integrating it to the platform.

---

## What’s Next for TaskChain

I plan to continue developing TaskChain by focusing on...
- **UIUX**: Polishing the frontend to improve user experience.
- **Connecting with Other Crypto Currencies**: I plan to explore additional blockchains to lower transaction costs, speed up processing times, and give users the flexibility to choose their preferred currency.
- **New Features**: 
  - Adding features such as the ability to connect with educational platforms such as canvas to reduce dependency on the "honor system" with the users.
  - Enable group tasks where members collaboratively work towards completion, with compensation awarded to those who successfully complete the task.

---

## Future Project Ideas

- **Exploring the Bridge Between Blockchain and VR/AR**
- **Exploring the Transition to Digital ID on the Blockchain**
- **Exploring the Intersection of Copyright/Patents and Blockchain Technology**

---

"use client";

import { client } from "./client";

import { ConnectButton, useActiveAccount, useReadContract, TransactionButton } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";
import { getContract, prepareContractCall } from "thirdweb";

import { TaskCards } from "./components/TaskCards";
import { AddTaskButton } from "./components/AddCard";
import { TASKMANAGER_FACTORY } from "./constants/contracts";

export default function Home() {
  // Get User Address
  const userAddress = useActiveAccount()?.address;
  const userAddressString = userAddress || "0";

  // Initialize the TASKMANAGER_FACTORY contract
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: TASKMANAGER_FACTORY,
  });

  // Fetch the user's personal task manager address
  const { data: contractAddress, isPending: isLoadingContract } = useReadContract({
    contract,
    method: "function getContract(address user) view returns (address)",
    params: [userAddressString],
  });

  // Check if User is in System
  const { data: hasAccount } = useReadContract({
    contract,
    method:
      "function checkAccount(address user) view returns (bool)",
    params: [userAddressString],
  });


  const taskManagerAddress = contractAddress || "0"

  //Login In Page
  if (!userAddress) {
    return (<StartScreen />)
  }

  //Loading Screen
  if (isLoadingContract) {
    return (<LoadingScreen />)
  }

  //Sign In Page
  if (!hasAccount) {
    return (<CreateAccount
      contract={contract}
    />)
  }

  //Main Page
  return (
    <MainPage
      contractAddress={taskManagerAddress}
    />
  );
}

function MainPage({ contractAddress }: { contractAddress: string; }) {
  // Fetch Task
  const { data: tasks, isPending: isLoadingTasks } = useReadContract({
    contract: getContract({
      client: client,
      chain: baseSepolia,
      address: contractAddress,
    }),
    method: "function getList() view returns ((string name, string description, uint256 bounty, uint256 dueDate)[])",
    params: [],
  });

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4">Tasks:</h1>
        <div className="grid grid-cols-3 gap-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <TaskCards
                key={task.name}
                contractAddress={contractAddress}
                index={index}
              />
            ))
          ) : (null)}
          <AddTaskButton contractAddress={contractAddress} />
          {/*FIXME Sort By Time*/}
        </div>
      </div>
    </main>
  );
}

function CreateAccount({ contract }: { contract: any }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center min-h-screen">
      <p className="text-4xl font-bold mb-10 text-center">Please Create An Account</p>
      <TransactionButton
        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
        transaction={() =>
          prepareContractCall({
            contract,
            method: "function createTaskManager()",
            params: [],
          })
        }
        onTransactionConfirmed={async () => {
          alert("Account Created Successfully!");
        }}
        onError={(error) => alert(`Error: ${error.message}`)}
      >
        Create Account
      </TransactionButton>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="py-20 flex flex-col items-center justify-center min-h-screen">
      <p className="text-1xl font-bold mb-4 text-center">Loading Task Manager...</p>
    </div>
  );
}

function StartScreen() {
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-10 text-center">Welcome to TaskChain</h1>
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
