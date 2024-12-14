'use client';
import { client } from "@/app/client";
import { getContract, prepareContractCall } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { TransactionButton, useReadContract, useActiveAccount } from "thirdweb/react";
import React, { useState } from "react";
import { TASKMANAGER_FACTORY } from "../constants/contracts";

type CampaignCardProps = {
    contractAddress: string;
    index: number;
};

type Task = {
    name: string;
    description: string;
    bounty: bigint;
    dueDate: bigint;
    completedBy: string;
    isComplete: boolean;
};

//TODO Make Description wrap around
//TODO Fix Styling

export const TaskCards: React.FC<CampaignCardProps> = ({ contractAddress, index }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTaskApprovalOpen, setIsTaskApprovalOpen] = useState(false);

    const userAddress = useActiveAccount()?.address;
    const userAddressString = userAddress || "0";

    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: contractAddress,
    });

    // Fetch admin status
    const getAdmin = useReadContract({
        contract,
        method: "function getAdmin() view returns (address)",
        params: [],
    });

    // Fetch all tasks
    const tasks = useReadContract({
        contract,
        method: "function getList() view returns ((string name, string description, uint256 bounty, uint256 dueDate, address completedBy, bool isComplete)[])",
        params: [],
    });

    // Fetch username for the completedBy address
    const usernameQuery = useReadContract({
        contract: getContract({
            client: client,
            chain: baseSepolia,
            address: TASKMANAGER_FACTORY,
        }),
        method: "function getUserName(address user) view returns (string)",
        params: [tasks.data ? tasks.data[index]?.completedBy : ""],
    });

    // Handle loading and missing data
    if (tasks.isPending || !tasks.data) {
        return <p>Loading tasks...</p>;
    }

    if (!tasks.data[index]) {
        return <p>No tasks found.</p>;
    }

    // Extract task details
    const { name: taskName, description: taskDescription, bounty, dueDate, completedBy: completeAddress, isComplete } = tasks.data[index];
    const username = usernameQuery.data || completeAddress;

    if (String(getAdmin) == userAddressString) {
        return (
            <>
                <div className="flex flex-col justify-between max-w-sm p-6 bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-lg shadow-lg space-y-4">
                    <h5 className="text-2xl font-bold text-white">{taskName}</h5>

                    <p className="text-gray-400">
                        <strong>Due:</strong> {new Date(Number(dueDate) * 1000).toLocaleString()}
                    </p>

                    <p className="text-gray-400">
                        <strong>Bounty:</strong> {Number(bounty) / 1e18} ETH /
                    </p>

                    <div className="flex justify-between space-x-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200"
                        >
                            More Details
                        </button>

                        {isComplete && (
                            <button
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                            >
                                Task Claimed
                            </button>
                        )}

                        {!isComplete && (
                            <TransactionButton
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                                transaction={() =>
                                    prepareContractCall({
                                        contract,
                                        method: "function markTaskCompleted(uint256 _index)",
                                        params: [BigInt(index)],
                                    })
                                }
                                onTransactionConfirmed={async () => {
                                    alert("Task Marked complete!");
                                    setIsModalOpen(false);
                                }}
                                onError={(error) => alert(`Error: ${error.message}`)}
                            >
                                Claim Task
                            </TransactionButton>
                        )}
                    </div>
                </div>

                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                        onClick={() => setIsModalOpen(false)} // Close modal when clicking outside
                    >
                        <div
                            className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <h5 className="mb-4 text-2xl font-bold">{taskName}</h5>
                            <p className="mb-4 text-gray-300">{taskDescription}</p>
                            <p className="mb-4 text-gray-400">
                                Task Claimed By {username}
                            </p>
                            <p className="text-gray-400">
                                <strong>Bounty:</strong> {Number(bounty) / 1e18} ETH
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                >
                                    Close
                                </button>
                                {isComplete && (
                                    <button
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                                    >
                                        Task Claimed
                                    </button>
                                )}

                                {!isComplete && (
                                    <TransactionButton
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                                        transaction={() =>
                                            prepareContractCall({
                                                contract,
                                                method: "function markTaskCompleted(uint256 _index)",
                                                params: [BigInt(index)],
                                            })
                                        }
                                        onTransactionConfirmed={async () => {
                                            alert("Task Marked complete!");
                                            setIsModalOpen(false);
                                        }}
                                        onError={(error) => alert(`Error: ${error.message}`)}
                                    >
                                        Claim Task
                                    </TransactionButton>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    return (
        <>
            <div className="flex flex-col justify-between max-w-sm p-6 bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-lg shadow-lg space-y-4">
                <h5 className="text-2xl font-bold text-white">{taskName}</h5>

                <p className="text-gray-400">
                    <strong>Due:</strong> {new Date(Number(dueDate) * 1000).toLocaleString()}
                </p>

                <p className="text-gray-400">
                    <strong>Bounty:</strong> {Number(bounty) / 1e18} ETH
                </p>

                <div className="flex justify-between space-x-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200"
                    >
                        More Details
                    </button>

                    {!isComplete && (
                        <TransactionButton
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                            transaction={() =>
                                prepareContractCall({
                                    contract,
                                    method: "function approveTaskCompletion(uint256 _index)",
                                    params: [BigInt(index)],
                                })
                            }
                            onTransactionConfirmed={async () => {
                                alert("Task completed successfully!");
                                setIsModalOpen(false);
                            }}
                            onError={(error) => alert(`Error: ${error.message}`)}
                        >
                            Complete Task
                        </TransactionButton>
                    )}

                    {isComplete && (
                        <button
                            onClick={() => {
                                setIsTaskApprovalOpen(true);
                            }}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                        >
                            Task Claimed
                        </button>
                    )}

                    {isTaskApprovalOpen && (

                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                            onClick={() => setIsTaskApprovalOpen(false)} // Close modal when clicking outside
                        >
                            <div
                                className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                            >
                                <h5 className="mb-4 text-2xl font-bold">{taskName}</h5>
                                <p className="mb-4 text-gray-300">{taskDescription}</p>
                                <p className="mb-4 text-gray-400">
                                    Task Claimed By {username}
                                </p>
                                <p className="text-gray-400">
                                    <strong>Bounty:</strong> {Number(bounty) / 1e18} ETH
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <TransactionButton
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-400 rounded-lg hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                                        transaction={() =>
                                            prepareContractCall({
                                                contract,
                                                method: "function rejectTaskCompletion(uint256 _index)",
                                                params: [BigInt(index)],
                                            })
                                        }
                                        onTransactionConfirmed={async () => {
                                            alert("Task Rejected Successfully!");
                                            setIsTaskApprovalOpen(false);
                                        }}
                                        onError={(error) => alert(`Error: ${error.message}`)}
                                    >
                                        Reject Task
                                    </TransactionButton>
                                    <TransactionButton
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                                        transaction={() =>
                                            prepareContractCall({
                                                contract,
                                                method: "function approveTaskCompletion(uint256 _index)",
                                                params: [BigInt(index)],
                                            })
                                        }
                                        onTransactionConfirmed={async () => {
                                            alert("Task completed successfully!");
                                            setIsTaskApprovalOpen(false);
                                        }}
                                        onError={(error) => alert(`Error: ${error.message}`)}
                                    >
                                        Approve Task
                                    </TransactionButton>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                    onClick={() => {
                        setIsModalOpen(false)
                        setIsTaskApprovalOpen(false);
                    }} // Close modal when clicking outside
                >
                    <div
                        className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <h5 className="mb-4 text-2xl font-bold">{taskName}</h5>
                        <p className="mb-4 text-gray-300">{taskDescription}</p>
                        <p className="mb-4 text-gray-400">
                            Due: {new Date(Number(dueDate) * 1000).toLocaleString()}
                        </p>
                        <p className="text-gray-400">
                            <strong>Bounty:</strong> {Number(bounty) / 1e18} ETH
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                Close
                            </button>
                            {!isComplete && (
                                <TransactionButton
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                                    transaction={() =>
                                        prepareContractCall({
                                            contract,
                                            method: "function approveTaskCompletion(uint256 _index)",
                                            params: [BigInt(index)],
                                        })
                                    }
                                    onTransactionConfirmed={async () => {
                                        alert("Task completed successfully!");
                                        setIsModalOpen(false);
                                    }}
                                    onError={(error) => alert(`Error: ${error.message}`)}
                                >
                                    Complete Task
                                </TransactionButton>
                            )}

                            {isComplete && (
                                <button
                                    onClick={() => {
                                        setIsTaskApprovalOpen(true);
                                        setIsModalOpen(false);
                                    }}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                                >
                                    Task Claimed
                                </button>
                            )}

                            {isTaskApprovalOpen && (

                                <div
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                                    onClick={() => {
                                        setIsTaskApprovalOpen(false)
                                        setIsModalOpen(false);
                                    }} // Close modal when clicking outside
                                >
                                    <div
                                        className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm"
                                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                                    >
                                        <h5 className="mb-4 text-2xl font-bold">{taskName}</h5>
                                        <p className="mb-4 text-gray-300">{taskDescription}</p>
                                        <p className="mb-4 text-gray-400">
                                            Task Claimed By {username}
                                        </p>
                                        <p className="text-gray-400">
                                            <strong>Bounty:</strong> {Number(bounty) / 1e18} ETH
                                        </p>
                                        <div className="flex justify-end space-x-4">
                                            <TransactionButton
                                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-400 rounded-lg hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                                                transaction={() =>
                                                    prepareContractCall({
                                                        contract,
                                                        method: "function rejectTaskCompletion(uint256 _index)",
                                                        params: [BigInt(index)],
                                                    })
                                                }
                                                onTransactionConfirmed={async () => {
                                                    alert("Task Rejected Successfully!");
                                                    setIsTaskApprovalOpen(false);
                                                    setIsModalOpen(false);
                                                }}
                                                onError={(error) => alert(`Error: ${error.message}`)}
                                            >
                                                Reject Task
                                            </TransactionButton>
                                            <TransactionButton
                                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                                                transaction={() =>
                                                    prepareContractCall({
                                                        contract,
                                                        method: "function approveTaskCompletion(uint256 _index)",
                                                        params: [BigInt(index)],
                                                    })
                                                }
                                                onTransactionConfirmed={async () => {
                                                    alert("Task completed successfully!");
                                                    setIsTaskApprovalOpen(false);
                                                    setIsModalOpen(false);
                                                }}
                                                onError={(error) => alert(`Error: ${error.message}`)}
                                            >
                                                Approve Task
                                            </TransactionButton>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};