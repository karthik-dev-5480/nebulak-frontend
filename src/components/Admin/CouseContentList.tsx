"use client";

import React, { useState, useEffect } from "react";
import { Section, Topic } from "@/types/course";
import { ChevronDown, ChevronUp, Edit, Trash2, X } from 'lucide-react'; 

const useAuthToken = (): string | null => {
    const [jwt, setJwt] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setJwt(storedToken);
            } else {
                setJwt("STATIC_DEMO_TOKEN_12345"); 
            }
        }
    }, []);

    return jwt;
};


interface VideoModalProps {
    topicId: number;
    onClose: () => void;
}

const VideoModal = ({ topicId, onClose }: VideoModalProps) => {
    const authToken = useAuthToken(); 

    const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSecureUrl = async () => {
            if (!authToken) { 
                setError("Authentication token missing. Please log in.");
                setIsLoading(false);
                return;
            }

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
                        setFinalVideoUrl(urlFromText);
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
        <div
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4"
            onClick={onClose} 
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-auto"
                onClick={e => e.stopPropagation()} 
            >
                <div className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                    <h5 className="text-lg font-semibold text-black dark:text-white ml-2"></h5>
                    <button
                        onClick={onClose}
                        className="text-gray-600 dark:text-gray-300 hover:text-red-500 p-1"
                        title="Close Video"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-4">
                    {isLoading ? (
                        <p className="text-center text-lg text-blue-500">Loading video access...</p>
                    ) : error ? (
                        <p className="text-center text-lg text-red-500">Error: {error}</p>
                    ) : finalVideoUrl ? (
                        <div className="relative" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                            <video
                                className="absolute top-0 left-0 w-full h-full rounded-b-lg"
                                src={finalVideoUrl} 
                                controls
                                autoPlay
                                poster="" 
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <p className="text-center text-lg text-gray-500">No video URL available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


interface CourseContentListProps {
    courseId: number;
    sections: Section[];
    refetchContent: () => void;
}

const CourseContentList = ({ courseId, sections, refetchContent }: CourseContentListProps) => {
    const authToken = useAuthToken(); 

    const [expandedSection, setExpandedSection] = useState<number | null>(null);
    const [modalTopicId, setModalTopicId] = useState<number | null>(null); 

    const toggleSection = (sectionId: number) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    const handleDelete = async (type: 'section' | 'topic', section_id: number, topic_id: number) => {
        if (!confirm(`Are you sure you want to DELETE this ${type} with ID ${topic_id || section_id}?`)) {
            return; 
        }

        console.log(`[ADMIN ACTION] Deleting ${type} ID: ${topic_id || section_id}...`);
        const SECTION_DELETE_API_BASE = "http://localhost:5454/courses/deletesection";
        const TOPIC_DELETE_API_BASE = "http://localhost:5454/courses/deletetopic/course";
        
        if (!authToken) { 
            alert("Authorization token is missing. Cannot proceed with deletion.");
            return;
        }

        if (type === 'section') {
            try {
                const url = `${SECTION_DELETE_API_BASE}/${courseId}/${section_id}`;
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`, // Use authToken here
                    },
                });

                if (response.ok) {
                    alert(`Section deleted successfully!`); 
                    refetchContent();
                } else {
                    const errorText = await response.text();
                    alert(`Error deleting section: ${response.status} - ${errorText.substring(0, 100)}`);
                    console.error('API Error:', errorText);
                }
            } catch (error) {
                alert("Network error during section deletion.");
            }
        } else {
            try {
                const url = `${TOPIC_DELETE_API_BASE}/${courseId}/section/${section_id}/topic/${topic_id}`;
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`, // Use authToken here
                    },
                });

                if (response.ok) {
                    alert(`Topic deleted successfully!`); 
                    refetchContent();
                } else {
                    const errorText = await response.text();
                    alert(`Error deleting topic: ${response.status} - ${errorText.substring(0, 100)}`);
                    console.error('API Error:', errorText);
                }
            } catch (error) {
                 alert("Network error during topic deletion.");
            }
        }
    };

    // Function to open the modal, passing the topic ID
    const openVideoModal = (id: number) => {
        setModalTopicId(id);
    };

    // Function to close the modal
    const closeVideoModal = () => {
        setModalTopicId(null);
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4 border-b pb-2">
                Course Content: {sections.length} Sections
            </h3>
            {modalTopicId !== null && <VideoModal topicId={modalTopicId} onClose={closeVideoModal} />}

            {sections.length === 0 ? (
                <p className="text-body-color">No content added yet. Start by adding a Section.</p>
            ) : (
                sections.map(section => (
                    <div key={section.id} className="mb-4 rounded-lg shadow-md dark:shadow-xl overflow-hidden">
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 dark:bg-dark hover:bg-gray-200 dark:hover:bg-dark/80 transition duration-150"
                            onClick={() => toggleSection(section.id)}
                        >
                            <h4 className="text-lg font-semibold text-black dark:text-white">
                                {section.sectionOrder}. {section.title}
                            </h4>
                            <div className="flex items-center space-x-3">
                                <button className="text-primary hover:text-green-600 p-1" title="Edit Section">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Delete Section"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete('section', section.id, -1); // topic_id not applicable
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                                {expandedSection === section.id ? <ChevronUp /> : <ChevronDown />}
                            </div>
                        </div>

                        {expandedSection === section.id && (
                            <div className="p-4 bg-white dark:bg-gray-200 border-t dark:border-dark-3">
                                <p className="text-body-color mb-4">{section.description}</p>

                                <h5 className="font-bold text-black dark:text-black mb-2">Topics:</h5>
                                {section.topics.length === 0 ? (
                                    <p className="text-body-color text-sm italic ml-4">No topics in this section yet.</p>
                                ) : (
                                    <ul className="list-disc pl-5">
                                        {section.topics.map((topic: Topic) => ( // Explicitly use Topic type
                                            <li key={topic.id} className="text-body-color mb-1 flex justify-between items-center text-sm">
                                                <span>{topic.topicOrder}. {topic.title}</span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        className={`text-xs p-1 rounded ${topic.videoUrl 
                                                            ? 'text-primary hover:underline hover:bg-gray-100 dark:hover:bg-gray-700'
                                                            : 'text-gray-400 dark:text-gray-500 cursor-default'}`}
                                                        title={topic.videoUrl ? 'View Video' : 'No Video'}
                                                        onClick={() => openVideoModal(topic.id)}
                                                        disabled={!topic.videoUrl}
                                                    >
                                                        {topic.videoUrl ? 'View Video' : 'No Video'}
                                                    </button>
                                                    <button className="text-primary hover:text-green-600 p-1" title="Edit Topic">
                                                        <Edit className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                        title="Delete Topic"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete('topic', section.id, topic.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default CourseContentList;