'use client';

import React, { useState } from 'react';
import { FaRegFile, FaRegFolder, FaRegFolderOpen } from 'react-icons/fa';
import Link from 'next/link';

const DynamicDropDown = ({ data }) => {
    // State to track which nodes are open
    const [openNodes, setOpenNodes] = useState([]);

    // Toggle node open/close state
    const toggleNode = (node) => {
        if (openNodes.includes(node.label)) {
            setOpenNodes(openNodes.filter((n) => n !== node.label));
        } else {
            setOpenNodes([...openNodes, node.label]);
        }
    };

    // Check if node is open
    const isOpen = (node) => openNodes.includes(node.label);

    // Recursive rendering of tree nodes
    const renderTree = (nodes) => {
        return (
            <ul className="space-y-2">
                {nodes.map((node) => (
                    <li key={node.label} className="">
                        {/* Node Label */}
                        <div
                            className="cursor-pointer py-1 px-3 flex items-center rounded-md gap-[5px] hover:bg-blue-100 hover:text-blue-800 group transition-all text-[1rem] duration-200"
                            onClick={() => toggleNode(node)}
                        >
                            {node.children && (
                                <span className="text-gray-400">
                                    {isOpen(node) ? (
                                        <FaRegFolderOpen className="group-hover:text-blue-800 transition-all text-[1.2rem] duration-200" />
                                    ) : (
                                        <FaRegFolder className="group-hover:text-blue-800 transition-all text-[1.2rem] duration-200" />
                                    )}
                                </span>
                            )}

                            {!node.children && (
                                <FaRegFile className="group-hover:text-blue-800 text-gray-400 transition-all text-[1rem] duration-200" />
                            )}

                            {/* Link for "Add Blogs" and "All Blogs" */}
                            {!node.children ? (
                                <Link href={node.link || '#'}>
                                    <span className="">{node.label}</span>
                                </Link>
                            ) : (
                                <span>{node.label}</span>
                            )}
                        </div>

                        {/* Children nodes */}
                        {node.children && (
                            <div
                                className={`ml-6 overflow-hidden transition-all duration-500 ease-in-out ${
                                    isOpen(node) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                                style={{
                                    transition: 'max-height 0.3s ease-in-out, opacity 0.2s ease-in-out',
                                }}
                            >
                                <ul>{renderTree(node.children)}</ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="">
                                    {renderTree(data)}
                                </div>
                            );
};

                            export default DynamicDropDown;