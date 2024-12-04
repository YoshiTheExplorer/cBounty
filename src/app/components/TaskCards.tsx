'use client';
import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import React, { useState } from "react";

type CampaignCardProps = {
    campaignAddress: string;
    index: number;
};

export const TaskCards: React.FC<CampaignCardProps> = ({ campaignAddress, index }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: campaignAddress,
    });

    // Fetch task data
    const { data, isPending } = useReadContract({
        contract,
        method:
            "function getList() view returns ((string name, string description, uint256 bounty, uint256 dueDate)[])",
        params: [],
    });

    // Handle loading and error states
    if (isPending) {
        return <p>Loading tasks...</p>;
    }

    if (!data || data.length === 0) {
        return <p>No tasks found for this campaign.</p>;
    }

    const taskName = data[index]?.name;
    const dueDate = new Date(Number(data[index]?.dueDate) * 1000); // TODO: Change so user can change Time System
    const taskDescription = data[index]?.description;

    return (
        <>
            <div className="flex flex-col justify-between max-w-sm p-6 bg-black border border-slate-200 rounded-lg shadow">
                <div>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{taskName}</h5>
                    <p className="mb-3 font-normal text-gray-400">Due: {dueDate.toString()}</p>
                </div>

                {/* Button to open modal */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    More Details
                    <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </button>
            </div>

            {/* Modal for task description */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-black rounded-lg p-6 max-w-sm shadow-lg">
                        <h5 className="mb-4 text-2xl font-bold">{taskName}</h5>
                        <p className="mb-4 text-gray-300">{taskDescription}</p>
                        <p className="mb-4 text-gray-400">Due: {dueDate.toString()}</p>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
