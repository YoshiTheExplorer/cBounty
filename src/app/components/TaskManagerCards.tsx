'use client';
import { client } from "@/app/client";
import { getContract, prepareContractCall } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { TransactionButton, useReadContract } from "thirdweb/react";
import React, { useState } from "react";

//TODO Add Feature To See How Much ETH is Staked

type CampaignCardProps = {
    contractAddress: string;
    index: number;
};

export const AddTaskManager: React.FC<CampaignCardProps> = ({ contractAddress, index }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: contractAddress,
    });

    const { data, isPending } = useReadContract({
        contract,
        method:
            "function getList() view returns ((string name, string description, uint256 bounty, uint256 dueDate)[])",
        params: [],
    });

    if (isPending) return <p>Loading tasks...</p>;
    if (!data || !data[index]) return <p>No tasks found.</p>;

    const { name: taskName, description: taskDescription, dueDate } = data[index];

    return (
        <>
            <div className="flex flex-col justify-between max-w-sm p-6 bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-lg shadow-lg space-y-4">
                <h5 className="text-2xl font-bold text-white">{taskName}</h5>

                <p className="text-gray-400">
                    <strong>Due:</strong> {new Date(Number(dueDate) * 1000).toLocaleString()}
                </p>

                <div className="flex justify-between space-x-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200"
                    >
                        More Details
                    </button>

                    <TransactionButton
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                        transaction={() =>
                            prepareContractCall({
                                contract,
                                method: "function completeTask(uint256 _index)",
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
                            Due: {new Date(Number(dueDate) * 1000).toLocaleString()}
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                Close
                            </button>
                            <TransactionButton
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-lg hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400"
                                transaction={() =>
                                    prepareContractCall({
                                        contract,
                                        method: "function completeTask(uint256 _index)",
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
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
