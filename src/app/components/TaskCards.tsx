'use client';
import { client } from "@/app/client";
import { getContract, prepareContractCall } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { TransactionButton, useReadContract} from "thirdweb/react";
import React, { useState } from "react";

type CampaignCardProps = {
    campaignAddress: string;
    index: number;
};

export const TaskCards: React.FC<CampaignCardProps> = ({ campaignAddress, index }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: campaignAddress,
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
            <div className="flex flex-col justify-between max-w-sm p-6 bg-black border border-slate-200 rounded-lg shadow">
                <h5 className="mb-2 text-2xl font-bold text-white">{taskName}</h5>
                <p className="mb-3 text-gray-400">Due: {new Date(Number(dueDate) * 1000).toLocaleString()}</p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                >
                    More Details
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm">
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
                                //TODO Why does it not have a blue background? wtf???
                                className="px-4 py-2 text-sm font-medium text-white-100 bg-blue-600 rounded-lg hover:bg-blue-700"
                                transaction={() =>
                                    prepareContractCall({
                                        contract,
                                        method: "function completeTask(uint256 _index)",
                                        params: [BigInt(index)],
                                    })
                                }
                                onTransactionConfirmed={async () => {
                                    alert("Task completed successfully!")
                                    setIsModalOpen(false)
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
