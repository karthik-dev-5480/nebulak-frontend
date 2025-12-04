// components/Student/TopicNoteForm.tsx

"use client";

import React, { useState } from "react";
import { Bookmark, Send } from 'lucide-react'; 

interface TopicNoteFormProps {
    topicId: number;
    topicTitle: string;
    courseId: number; // Might be needed for the API call
    onNoteSaved: () => void;
}

const TopicNoteForm = ({ topicId, topicTitle, onNoteSaved }: TopicNoteFormProps) => {
    const [noteContent, setNoteContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // --- API CALL LOGIC HERE ---
        console.log(`[STUDENT ACTION] Saving note for Topic ID ${topicId}: "${noteContent}"`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, you would fetch('your-note-api', { method: 'POST', body: ... })
        
        alert(`Note saved for topic: ${topicTitle}`);
        setNoteContent('');
        setIsLoading(false);
        onNoteSaved(); // Refresh or close the form if needed
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-indigo-300 dark:border-indigo-600">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center border-b pb-2">
                <Bookmark className="mr-2 h-5 w-5 text-indigo-500" /> Notes for: {topicTitle}
            </h4>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={4}
                    placeholder="Type your personal notes about this lesson here..."
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        disabled={isLoading || noteContent.trim().length === 0}
                        className="flex items-center rounded-md bg-indigo-600 py-2 px-6 text-white font-bold hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400"
                    >
                        <Send className="h-4 w-4 mr-2" /> {isLoading ? 'Saving...' : 'Save Note'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TopicNoteForm;