# cBounty
**Colin Yamada**  
Email: [cyamada@wisc.edu](mailto:cyamada@wisc.edu)

---
## Introduction

**cBounty** is a platform that allows users to stake ETH onto tasks, either individually or collaboratively, in order to enhance accountability and motivation.

Users can create or join projects, where tasks are collaboratively completed, and project admins confirm task completion to ensure accountability.

By staking ETH onto tasks similar to posting a bounty, cBounty's goals is to incentivize engagement, improve teamwork, and hold accountability by creating a transparent environment on the blockchain.

---

## Demo

Link To Website To Be Added...

---

## How It Was Built 

1. **Smart Contracts (Solidity)**  
   - **cBountyFactory**: Acts as a user database, storing addresses/username of all users and their respective `cBounty` smart contracts, allowing users to join others `cBounty` smart contracts.
   - **cBounty**: Manages each `cBounty` tasks, such as the task name, description, due date, bounty price, and the address of whoever completes the task. It handles the ETH staked for each task, its allocation, and overall management.

2. **Frontend (React.js / TypeScript / ThirdWeb)**  
   - Used a development platform called ThirdWeb to deploy the smart contracts and access the functions within it. This made the bridge between the backend and the frontend smooth and possible. 
---

## Challenges

1. **Smart Contract Efficiency**  
   - Reducing gas fees by optimizing the Smart Contract.

2. **Secure Data Handling** 
   - Safely storing user data and their associated `cBounty` contracts.

3. **Frontend Integration**  
   - Since this was my first time attempting to connect the smart contract to the Frontend, there was trouble finding solutions online and molding it and integrating it to the platform.

---

## What’s Next for TaskChain

I plan to continue developing TaskChain by focusing on...
- **UIUX**: Polishing the frontend to improve user experience.
- **Connecting with Other Crypto Currencies**: I plan to explore additional blockchains to lower transaction costs, speed up processing times, and give users the flexibility to choose their preferred currency.
- **New Features**: 
  - Adding features such as the ability to connect with educational platforms such as canvas to reduce dependency on the "honor system" with the users.

---

## Future Project Ideas

- **Exploring the Bridge Between Blockchain and VR/AR**
- **Exploring the Transition to Digital ID on the Blockchain**
- **Exploring the Intersection of Copyright/Patents and Blockchain Technology**

---