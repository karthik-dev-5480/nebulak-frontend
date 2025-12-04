// components/Student/StudentCourseContentList.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Section } from "@/types/course"; // Assuming you have this interface
import { ChevronDown, ChevronUp, BookOpen, X } from 'lucide-react'; 

// --- START: Auth Token Hook (Copied from the Admin component) ---
const useAuthToken = (): string | null => {
    const [jwt, setJwt] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setJwt(storedToken);
            } else {
                // Using a static token for demo/unauthenticated flow, adjust as needed
                setJwt("STATIC_DEMO_TOKEN_12345"); 
            }
        }
    }, []);

    return jwt;
};
// --- END: Auth Token Hook ---

interface StudentCourseContentListProps {
    sections: Section[]; 
    onAddNote: (topicId: number, topicTitle: string) => void; // Callback to open the note form
}

interface VideoModalProps {
    topicId: number; // Changed from videoUrl to topicId
    onClose: () => void;
}

// --- START: Refactored VideoModal to fetch secure URL ---
const VideoModal = ({ topicId, onClose }: VideoModalProps) => {
    const authToken = useAuthToken(); 

    const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isExternal, setIsExternal] = useState(false); // State to handle external vs. direct URL

    // Function to handle YouTube/External URL conversion
    const getEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            const videoId = urlObj.searchParams.get('v');
            if (url.includes('youtube.com') && videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
            return url;
        } catch (e) {
            return url;
        }
    };

    useEffect(() => {
        const fetchSecureUrl = async () => {
            if (!authToken) { 
                setError("Authentication token missing. Please log in.");
                setIsLoading(false);
                return;
            }

            // This is the same API call used in the Admin component's VideoModal
            const SECURE_VIDEO_API = `http://localhost:5454/courses/secure/video/${topicId}`;
            
            try {
                const response = await fetch(SECURE_VIDEO_API, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`, 
                    },
                });

                if (response.ok) {
                    const urlFromText = await response.text();

                    if (urlFromText) {
                        // Check if the URL is external (e.g., YouTube)
                        if (urlFromText.includes('youtube.com') || urlFromText.includes('youtu.be')) {
                            setIsExternal(true);
                            setFinalVideoUrl(getEmbedUrl(urlFromText));
                        } else {
                            setIsExternal(false);
                            setFinalVideoUrl(urlFromText);
                        }
                    } else {
                        setError("Secure video endpoint did not provide a redirect URL.");
                    }
                } else if (response.status === 403) {
                    setError("You are not authorized to view this video (Enrollment required).");
                } else {
                    const errorText = await response.text();
                    setError(`Failed to fetch secure video URL. Status: ${response.status}. Message: ${errorText.substring(0, 100)}`);
                }

            } catch (err) {
                console.error("Network or Fetch Error:", err);
                setError("Network error: Could not connect to the video service.");
            } finally {
                setIsLoading(false);
            }
        };

        if (authToken !== null) {
            fetchSecureUrl();
        }
        
    }, [topicId, authToken]); 


    return (
        // Backdrop
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4"
            onClick={onClose} // Close on backdrop click
        >
            {/* Modal Container */}
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-auto"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Header with Close Button */}
                <div className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                    <h5 className="text-lg font-semibold text-black dark:text-white ml-2">Video Player</h5>
                    <button 
                        onClick={onClose} 
                        className="text-gray-600 dark:text-gray-300 hover:text-red-500 p-1"
                        title="Close Video"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-4">
                    {isLoading ? (
                        <p className="text-center text-lg text-blue-500">Loading video access...</p>
                    ) : error ? (
                        <p className="text-center text-lg text-red-500">Error: {error}</p>
                    ) : finalVideoUrl ? (
                        // Video Player (16:9 Aspect Ratio)
                        <div className="relative" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                            {isExternal ? (
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full rounded-b-lg"
                                    src={finalVideoUrl} // finalVideoUrl is the embed URL here
                                    title="Course Topic Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    className="absolute top-0 left-0 w-full h-full rounded-b-lg"
                                    src={finalVideoUrl} // finalVideoUrl is the direct secure URL here
                                    controls
                                    autoPlay
                                    poster="" 
                                    onContextMenu={(e) => e.preventDefault()} // Basic anti-download measure
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-lg text-gray-500">No video URL available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
// --- END: Refactored VideoModal ---


const StudentCourseContentList = ({ sections, onAddNote }: StudentCourseContentListProps) => {
    const [expandedSection, setExpandedSection] = useState<number | null>(null);
    // Changed state to hold topicId instead of videoUrl
    const [modalTopicId, setModalTopicId] = useState<number | null>(null); 

    const toggleSection = (sectionId: number) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    // Updated to open modal with topicId
    const openVideoModal = (id: number) => {
        setModalTopicId(id);
    };
    
    // Updated to close modal
    const closeVideoModal = () => {
        setModalTopicId(null);
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4 border-b pb-2">
                Course Curriculum: {sections.length} Sections
            </h3>
            
            {/* Display the Modal if modalTopicId is set, passing topicId */}
            {modalTopicId !== null && <VideoModal topicId={modalTopicId} onClose={closeVideoModal} />}

            {sections.length === 0 ? (
                <p className="text-body-color">No content available for this course yet.</p>
            ) : (
                sections.map(section => (
                    <div key={section.id} className="mb-4 rounded-lg shadow-md dark:shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Section Header */}
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150"
                            onClick={() => toggleSection(section.id)}
                        >
                            <h4 className="text-lg font-semibold text-black dark:text-white flex items-center">
                                <BookOpen className="h-5 w-5 mr-3 text-primary" />
                                {section.sectionOrder}. {section.title}
                            </h4>
                            <div className="flex items-center space-x-3">
                                {expandedSection === section.id ? <ChevronUp /> : <ChevronDown />}
                            </div>
                        </div>

                        {/* Section Content (Description & Topics) */}
                        {expandedSection === section.id && (
                            <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                                <p className="text-body-color italic mb-4 text-sm">{section.description}</p>
                                
                                <h5 className="font-bold text-black dark:text-white mb-2 border-b pb-1">Lessons:</h5>
                                <ul className="space-y-3">
                                    {section.topics.length === 0 ? (
                                        <p className="text-body-color text-sm italic ml-4">No lessons in this section yet.</p>
                                    ) : (
                                        section.topics.map(topic => (
                                            <li key={topic.id} className="text-body-color flex justify-between items-center text-base border-b border-dashed pb-2 last:border-b-0 last:pb-0">
                                                <span className="font-medium text-black dark:text-white">{topic.topicOrder}. {topic.title}</span>
                                                <div className="flex items-center space-x-3 text-sm">
                                                    
                                                    {/* View Video Button */}
                                                    <button 
                                                        className={`text-xs p-2 rounded-full font-medium ${topic.videoUrl // Still check topic.videoUrl to enable/disable the button
                                                            ? 'bg-primary text-white hover:bg-opacity-80' 
                                                            : 'bg-gray-300 text-gray-600 cursor-default'}`} 
                                                        title={topic.videoUrl ? 'View Video' : 'No Video Available'}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); 
                                                            if(topic.videoUrl) openVideoModal(topic.id) // Pass topic.id
                                                        }}
                                                        disabled={!topic.videoUrl}
                                                    >
                                                        {topic.videoUrl ? 'Watch' : 'Locked'}
                                                    </button>
                                                    
                                                    {/* Add Note Button */}
                                                    <button 
                                                        className="text-xs p-2 rounded-full bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition" 
                                                        title="Add or View Notes"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onAddNote(topic.id, topic.title);
                                                        }}
                                                    >
                                                        Notes
                                                    </button>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default StudentCourseContentList;