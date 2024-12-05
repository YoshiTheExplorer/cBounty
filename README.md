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
- **New Features**: Adding features such as the ability to connect with educational platforms such as canvas to reduce dependency on the "honor system" with the users. 
- **Connecting with Other Crypto Currencies**: I plan to explore additional blockchains, such as BSV, to lower transaction costs, speed up processing times, and give users the flexibility to choose their preferred currency.

---

## Future Project Ideas

- **Exploring The Bridge Between Blockchain and VR/AR**
- **HERE**

---