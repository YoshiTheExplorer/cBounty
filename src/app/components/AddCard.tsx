'use client';
import { client } from "@/app/client";
import React, { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { toWei } from "thirdweb/utils";

type AddTaskProps = {
    contractAddress: string;
};

export const AddTaskButton: React.FC<AddTaskProps> = ({ contractAddress }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("")
    const [taskDueDate, setTaskDueDate] = useState("");
    const [bountyPrice, setBountyPrice] = useState("");

    // Initialize contract
    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: contractAddress,
    });

    // Initialize the send transaction
    const { mutate: sendTransaction } = useSendTransaction();

    const handleAddTask = async () => {
        // Make sure taskName and taskDueDate is filled out
        if (!taskName || !taskDueDate ) {
            alert("All fields are required!");
            return;
        }

        // Check if the due date is at least 5 minutes ahead
        if (new Date(taskDueDate).getTime() <= new Date().getTime() + 300000) {
            alert("Due date must be at least 5 minutes ahead from current time.");
            return;
        }


        // Prepare contract call to add a task
        const transaction = prepareContractCall({
            contract,
            method: "function addTask(string name, string description, uint256 dueDate) payable",
            params: [
                taskName,
                taskDescription,
                BigInt(Math.floor(new Date(taskDueDate).getTime() / 1000)),
            ],
            value: toWei(bountyPrice),
        });

        // Send transaction to blockchain
        sendTransaction(transaction, {
            onSuccess: () => {
                alert("Task added successfully!");
                // Reset form fields
                setTaskName("");
                setTaskDescription("");
                setTaskDueDate("");
                setBountyPrice("");
                setIsModalOpen(false);
            },
            onError: (error) => {
                console.error("Error adding task:", error);
                alert("Failed to add task. Please try again.");
            },
        });
        
    };

    return (
        <>
            <div
                className="flex items-center justify-center max-w-sm h-40 bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-lg shadow-lg cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <button className="text-2xl font-bold text-white">
                    Add Task
                </button>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                    onClick={() => setIsModalOpen(false)} // Close modal on background click
                >
                    <div
                        className="p-4 bg-gray-800 rounded-lg shadow-md max-w-sm"
                        onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Add New Task</h2>
                        <div className="flex flex-col space-y-4">
                            {/* Task Name Input */}
                            <input
                                type="text"
                                placeholder="Task Name"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                            />

                            {/* Task Description Input */}
                            <textarea
                                placeholder="Task Description"
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                            ></textarea>

                            {/* Task Due Date Input */}
                            <input
                                type="datetime-local"
                                placeholder="Due Date and Time"
                                value={taskDueDate}
                                onChange={(e) => setTaskDueDate(e.target.value)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                            />

                            {/* Task Bounty Input */}
                            <input
                                placeholder="Bounty (Leave Empty if N/A)"
                                value={bountyPrice}
                                onChange={(e) => setBountyPrice(e.target.value)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                            />

                            {/* Submit Button */}
                            <button
                                onClick={handleAddTask}
                                className={"px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700"}
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
