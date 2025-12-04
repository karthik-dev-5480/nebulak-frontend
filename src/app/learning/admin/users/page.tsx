"use client";

import { useState, useEffect, useCallback } from "react";
// ADDED ICONS: Pencil, Trash2, PlusCircle
import { Loader2, Pencil, Trash2, PlusCircle } from "lucide-react"; 

// --- DTO and Page Types (can be imported from a separate 'types' file) ---
interface UserDetailsDTO {
  id: number;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // Current page number (0-based)
  size: number;
  first: boolean;
  last: boolean;
}
// -------------------------------------------------------------------------


// Simple Loading Component
const SimpleLoader = () => (
    <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-primary animate-spin mr-3" /> 
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading Users...</span>
    </div>
);

// Pagination Component (PaginationBar) (No changes needed)
interface PaginationBarProps {
    totalPages: number;
    currentPage: number; // 1-based
    onPageChange: (page: number) => void;
}

const PaginationBar = ({ totalPages, currentPage, onPageChange }: PaginationBarProps) => {
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    if (endPage - startPage + 1 < maxPagesToShow) {
        if (startPage > 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        } else if (endPage < totalPages) {
            endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        }
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const baseStyle = "mx-1 px-3 py-1 text-sm font-medium rounded-md transition duration-150";
    const activeStyle = "bg-primary text-white";
    const defaultStyle = "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600";
    
    return (
        <div className="flex justify-center items-center space-x-1">
            {/* First Page Link (if range doesn't start at 1) */}
            {startPage > 1 && (
                <>
                    <button 
                        onClick={() => onPageChange(1)}
                        className={`${baseStyle} ${defaultStyle}`}
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="text-gray-500 dark:text-gray-400">...</span>}
                </>
            )}

            {/* Page Number Buttons */}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                    className={`${baseStyle} ${page === currentPage ? activeStyle : defaultStyle}`}
                >
                    {page}
                </button>
            ))}

            {/* Last Page Link (if range doesn't end at totalPages) */}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="text-gray-500 dark:text-gray-400">...</span>}
                    <button 
                        onClick={() => onPageChange(totalPages)}
                        className={`${baseStyle} ${defaultStyle}`}
                    >
                        {totalPages}
                    </button>
                </>
            )}
        </div>
    );
};


const UsersPage = () => {
    const [userData, setUserData] = useState<Page<UserDetailsDTO> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // State for client-side pagination parameters (using 1-based index for client display)
    const [currentPage, setCurrentPage] = useState(1); 
    const pageSize = 10; // Fixed page size for this example

    // --- NEW ACTION HANDLERS ---
    const handleAddUser = () => {
        alert("Action: Add New User"); // Placeholder for showing a form/modal
    };

    const handleEditUser = (user: UserDetailsDTO) => {
        alert(`Action: Edit User ${user.firstName} (ID: ${user.id})`); // Placeholder for opening edit form
    };

    const handleDeleteUser = (userId: number) => {
        if(window.confirm(`Are you sure you want to delete user ID ${userId}?`)) {
            alert(`Action: Delete User ID ${userId}`); // Placeholder for API call
        }
    };
    // ---------------------------

    // Function to fetch data from the backend
    const fetchUsers = useCallback(async (page: number, size: number) => {
        setIsLoading(true);
        // FIX: Convert client 1-based page (e.g., 1, 2) to server 0-based page index (e.g., 0, 1)
        const zeroBasedPage = page - 1; 
        
        try {
            // Use the 0-based page index in the URL
            const response = await fetch(
                `http://localhost:5454/auth/users/getallusers?page=${zeroBasedPage}&size=${size}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Page<UserDetailsDTO> = await response.json();
            setUserData(data);

        } catch (error) {
            console.error("Error fetching users:", error);
            // Optionally set an error state here
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect to fetch data when the page number changes
    useEffect(() => {
        fetchUsers(currentPage, pageSize);
    }, [currentPage, pageSize, fetchUsers]);


    const handleNextPage = () => {
        if (userData && currentPage < userData.totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };
    
    // Handler for clicking a specific page number
    const handlePageChange = (page: number) => {
        if (userData && page >= 1 && page <= userData.totalPages) {
            setCurrentPage(page);
        }
    }

    // Defensive check using the server-provided flags
    const isPrevDisabled = userData ? userData.first || isLoading : true;
    const isNextDisabled = userData ? userData.last || isLoading : true;


    return (
        <section className="py-20 lg:py-[120px] bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="max-w-8xl mx-auto">
                    <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
                        Registered Users
                    </h2>

                    {/* ADD USER BUTTON */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleAddUser}
                            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150 shadow-md"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Add New User
                        </button>
                    </div>

                    {isLoading && <SimpleLoader />}

                    {!isLoading && (!userData || userData.content.length === 0) && (
                        <p className="text-center text-lg text-gray-500 dark:text-gray-400">
                            No users found.
                        </p>
                    )}

                    {/* Users Grid/Table Display */}
                    {!isLoading && userData && userData.content.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                            {/* Grid/Table Header (Updated to 5 columns) */}
                            <div className="grid grid-cols-8 p-4 font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                <span>ID</span>
                                <span>Display Name</span>
                                <span>First Name</span>
                                <span>Last Name</span>
                                <span>Email</span>
                                {/* NEW: Actions Header */}
                                <span className="text-center">Actions</span> 
                            </div>

                            {/* User Rows (Updated to 5 columns) */}
                            {userData.content.map((user) => (
                                <div
                                    key={user.id}
                                    className="grid grid-cols-8 p-4 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                                >
                                    <span className="text-gray-800 dark:text-gray-200">{user.id}</span>
                                    <span className="text-gray-800 dark:text-gray-200">{user.displayName}</span>
                                    <span className="text-gray-800 dark:text-gray-200">{user.firstName}</span>
                                    <span className="text-gray-800 dark:text-gray-200">{user.lastName}</span>
                                    <span className="text-blue-600 dark:text-blue-400">{user.email}</span>
                                    
                                    {/* NEW: Actions Column */}
                                    <div className="flex justify-center space-x-3">
                                        <button 
                                            onClick={() => handleEditUser(user)}
                                            title="Edit User"
                                            className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-500 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(user.id)}
                                            title="Delete User"
                                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Pagination Controls */}
                    {userData && userData.totalPages > 1 && (
                        <div className="flex flex-col items-center mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                            
                            <div className="flex justify-between w-full items-center">
                                {/* 1. Previous Button (Left Side) */}
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={isPrevDisabled} 
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition duration-150 ${
                                        isPrevDisabled
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                            : 'bg-primary text-white hover:bg-primary/90'
                                    }`}
                                >
                                    Previous
                                </button>
    
                                {/* 2. Center Content: Page Numbers and Status (Flex column to stack them) */}
                                <div className="flex flex-col items-center space-y-2">
                                    {/* Page Numbers Bar */}
                                    <PaginationBar 
                                        totalPages={userData.totalPages}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                    />
                                    
                                    
                                </div>
    
                                {/* 3. Next Button (Right Side) */}
                                <button
                                    onClick={handleNextPage}
                                    disabled={isNextDisabled}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition duration-150 ${
                                        isNextDisabled
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                            : 'bg-primary text-white hover:bg-primary/90'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UsersPage;