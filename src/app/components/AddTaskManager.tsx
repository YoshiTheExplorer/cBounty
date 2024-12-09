'use client';
import { client } from "@/app/client";
import React, { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

type AddTaskProps = {
    contractAddress: string;
};

export const AddTaskManager: React.FC<AddTaskProps> = ({ contractAddress }) => {
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenJoin, setIsModalOpenJoin] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [password, setPassword] = useState("")

    // Initialize contract
    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: contractAddress,
    });

    // Initialize the send transaction
    const { mutate: sendTransaction } = useSendTransaction();

    const handleCreateProject = async () => {
        // Make sure taskName and taskDueDate is filled out
        if (!projectName || !password ) {
            alert("All fields are required!");
            return;
        }

        // Prepare contract call to add a task
        const transaction = prepareContractCall({
            contract,
            method:
                "function createTaskManager(string name, string password)",
            params: [projectName, password],
        });

        // Send transaction to blockchain
        sendTransaction(transaction, {
            onSuccess: () => {
                alert("Task added successfully!");
                // Reset form fields
                setProjectName("");
                setPassword("");
            },
            onError: (error) => {
                console.error("Error adding project:", error);
                alert("Failed to add project. Please try again.");
            },
        });
        
    };

    const handleJoinProject = async () => {
        // Make sure taskName and taskDueDate is filled out
        if (!projectName || !password ) {
            alert("All fields are required!");
            return;
        }

        // Prepare contract call to add a task
        const transaction = prepareContractCall({
            contract,
            method:
              "function joinTaskManager(address taskManagerAddress, string password)",
            params: [projectName, password],
          });

        // Send transaction to blockchain
        sendTransaction(transaction, {
            onSuccess: () => {
                alert("Task added successfully!");
                // Reset form fields
                setProjectName("");
                setPassword("");
            },
            onError: (error) => {
                console.error("Error Joining project:", error);
                alert("Failed to join project. Please try again.");
            },
        });
        
    };

    return (
        <>
            <div
                className="flex items-center justify-center max-w-sm h-40 bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-lg shadow-lg cursor-pointer"
                onClick={() => setIsModalOpenCreate(true)}
            >
                <button className="text-2xl font-bold text-white">
                    Create Project
                </button>
            </div>

            <div
                className="flex items-center justify-center max-w-sm h-40 bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-lg shadow-lg cursor-pointer"
                onClick={() => setIsModalOpenJoin(true)}
            >
                <button className="text-2xl font-bold text-white">
                    Join Project
                </button>
            </div>

            {isModalOpenCreate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                    onClick={() => setIsModalOpenCreate(false)} // Close modal on background click
                >
                    <div
                        className="p-4 bg-gray-800 rounded-lg shadow-md max-w-sm"
                        onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Create New Project</h2>
                        <div className="flex flex-col space-y-4">
                            {/* Project Name Input */}
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                            />

                            {/* Password Input */}
                            <textarea
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                            ></textarea>

                            {/* Submit Button */}
                            <button
                                onClick={handleCreateProject}
                                className={"px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700"}
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpenJoin && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                    onClick={() => setIsModalOpenJoin(false)} // Close modal on background click
                >
                    <div
                        className="p-4 bg-gray-800 rounded-lg shadow-md max-w-sm"
                        onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Join Existing Project</h2>
                        <div className="flex flex-col space-y-4">
                            {/* Task Manager Address Input */}
                            <input
                                type="text"
                                placeholder="Task Manager Address"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                            />

                            {/* Password Input */}
                            <textarea
                                placeholder="Task Description"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                            ></textarea>

                            {/* Submit Button */}
                            <button
                                onClick={handleJoinProject}
                                className={"px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700"}
                            >
                                Join Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
