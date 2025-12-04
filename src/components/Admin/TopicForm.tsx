"use client";

import React, { useState, useEffect } from "react";
// Assuming lucide-react icons are available in the environment
import { Plus, CheckCircle, XCircle, Loader2 } from 'lucide-react'; 

// Define a placeholder type for Section since we must be self-contained
interface Section {
    id: number;
    title: string;
    sectionOrder: number; 
}

interface TopicFormProps {
    courseId: number;
    sections: Section[]; 
    onTopicAdded: () => void;
}

// Define the structure for form data
interface TopicFormData {
    topicOrder: number;
    name: string;
    description: string;
    durationMinutes: number;
    videoFile: File | null;
    sectionId: number;
}

// Custom Loading Overlay Component
const LoadingOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300">
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center w-80">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
            <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Uploading Video...</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Please do not close this window. Uploads for large video files may take several minutes.
            </p>
        </div>
    </div>
);


const TopicForm = ({ courseId, sections, onTopicAdded }: TopicFormProps) => {
    // Determine the initial default sectionId
    const initialSectionId = sections.length > 0 ? sections[0].id : 0;

    const [topicData, setTopicData] = useState<TopicFormData>({
        topicOrder: 1, 
        name: '',
        description: '',
        durationMinutes: 10,
        videoFile: null,
        sectionId: initialSectionId, 
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Update default sectionId when sections array changes, but only if no section is selected (initial state)
    useEffect(() => {
        if (sections.length > 0 && topicData.sectionId === 0) {
            setTopicData(prev => ({ ...prev, sectionId: sections[0].id }));
        }
    }, [sections, topicData.sectionId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTopicData(prev => ({
            ...prev,
            // Convert numeric fields to integers
            [name]: ['topicOrder', 'sectionId', 'durationMinutes'].includes(name) ? parseInt(value) || 0 : value,
        }));
        // Clear status messages on change
        setError(null);
        setSuccess(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setTopicData(prev => ({ ...prev, videoFile: e.target.files![0] }));
        } else {
            setTopicData(prev => ({ ...prev, videoFile: null }));
        }
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic client-side validation
        if (!topicData.sectionId) {
            setError("Please select a section to add the topic to.");
            return;
        }
        if (!topicData.videoFile) {
            setError("Please select a video file for the topic.");
            return;
        }

        setIsLoading(true);
        
        const formData = new FormData();
        // Backend expects: title, description, topicOrder, durationMinutes, video
        formData.append('title', topicData.name);
        formData.append('description', topicData.description);
        formData.append('topicOrder', String(topicData.topicOrder));
        formData.append('durationMinutes', String(topicData.durationMinutes));
        formData.append('video', topicData.videoFile);
        
        // Construct the API URL using the provided courseId and selected sectionId
        const apiUrl = `http://localhost:5454/courses/addtopic/course/${courseId}/section/${topicData.sectionId}`;
        
        try {
            // Simulate a longer wait time for large files before fetching
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                // Content-Type is handled automatically by the browser for FormData
                body: formData,
            });

            // The Spring Boot endpoint returns ResponseEntity<String>, so we read the text response
            const message = await response.text(); 

            if (response.ok) {
                setSuccess(message || "Topic added successfully!");
                onTopicAdded();
                
                // Reset form state for a new topic
                setTopicData(prev => ({
                    topicOrder: prev.topicOrder + 1, // Increment for convenience
                    name: '',
                    description: '',
                    durationMinutes: 10, 
                    videoFile: null,
                    sectionId: prev.sectionId, // Keep current section selected
                }));
                
                // Clear the file input element visually
                const fileInput = document.getElementById('videoFile') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

            } else {
                // Backend error messages (e.g., Course not found, Section not found) are returned in the response body
                setError(message || `Failed to add topic (Status: ${response.status})`);
            }
        } catch (err) {
            console.error("Network or Fetch Error:", err);
            setError("A network error occurred. Please ensure the server is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
            {/* Loading Overlay is rendered conditionally */}
            {isLoading && <LoadingOverlay />}
            
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center">
                <Plus className="mr-3 h-6 w-6 text-indigo-500" /> Add New Topic
            </h4>
            
            {(error || success) && (
                <div className={`p-3 mb-4 rounded-lg flex items-center ${error ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
                    {error ? <XCircle className="h-5 w-5 mr-3" /> : <CheckCircle className="h-5 w-5 mr-3" />}
                    <p className="font-medium text-sm">{error || success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Topic Order and Duration side-by-side */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Topic Order</label>
                    <input
                        type="number"
                        name="topicOrder"
                        value={topicData.topicOrder}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Duration (Mins)</label>
                    <input
                        type="number"
                        name="durationMinutes"
                        value={topicData.durationMinutes}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Topic Name */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Topic Name</label>
                    <input
                        type="text"
                        name="name"
                        value={topicData.name}
                        onChange={handleChange}
                        placeholder="e.g., Setting up the development environment"
                        required
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={topicData.description}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Detailed explanation of what the topic covers."
                        required
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>

                {/* Select Section */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Section</label>
                    <select
                        name="sectionId"
                        value={topicData.sectionId}
                        onChange={handleChange}
                        required
                        disabled={sections.length === 0 || isLoading}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    >
                        {sections.length === 0 ? (
                            <option value={0} disabled>No sections available</option>
                        ) : (
                            sections.map(section => (
                                <option key={section.id} value={section.id}>
                                    {section.sectionOrder}. {section.title}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                
                {/* Video File */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Video File (.mp4, .mov, etc.)</label>
                    <input
                        id="videoFile"
                        type="file"
                        name="videoFile"
                        onChange={handleFileChange}
                        accept="video/*"
                        required={!topicData.videoFile} // Make required only if no file is currently selected (for initial create)
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 px-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 transition duration-300 cursor-pointer"
                    />
                    {topicData.videoFile && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Selected: {topicData.videoFile.name}</p>}
                </div>
                
                {/* Submit Button */}
                <div className="md:col-span-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || sections.length === 0 || !topicData.videoFile}
                        className="flex items-center justify-center rounded-lg bg-indigo-600 py-2 px-8 text-white font-bold text-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading...
                            </>
                        ) : (
                            'Add Topic'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TopicForm;