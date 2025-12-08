"use client"; // Keep this directive

import React, { useState, useEffect, useCallback } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Course, Section } from "@/types/course"; // Import Course and Section interfaces
// NOTE: useSearchParams has been removed from this file.
import { useRouter } from 'next/navigation'; 
import { Plus } from 'lucide-react'; 
import Image from 'next/image';

import SectionForm from "@/components/Admin/SectionForm";
import TopicForm from "@/components/Admin/TopicForm";
import CourseContentList from "@/components/Admin/CouseContentList";

// Define props interface for the new component structure
interface AdminCourseDetailsProps {
    initialCourseId: number | null;
}

// Update the component to accept the courseId as a prop
const AdminCourseDetails: React.FC<AdminCourseDetailsProps> = ({ initialCourseId }) => {
    const router = useRouter();
    
    // Get courseId from props, not useSearchParams()
    const courseId = initialCourseId; 

    const [course, setCourse] = useState<Course | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'content' | 'section' | 'topic'>('content');

    const fetchCourseDetails = useCallback(async () => {
        if (!courseId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            
            // NOTE: The backend URL below seems to be a local development server, 
            // ensure you update this for your Vercel deployment if needed (e.g., using environment variables).
            const response = await fetch(`http://localhost:5454/courses/course/${courseId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch course details for ID: ${courseId}`);
            }
       
            const data: Course = await response.json();
            setCourse(data);
            setSections(data.sections || []); 
        
        } catch (error) {
            console.error("Error fetching course details:", error);
            setCourse(null);
            setSections([]);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        // Now it depends on the prop, which is stable after the initial client render
        fetchCourseDetails();
    }, [fetchCourseDetails]);

    if (!courseId) {
        return (
            <div className="container py-20 text-center">
                <Breadcrumb pageName="Course Details" description="Error" />
                <p className="text-xl text-red-500">Error: No Course ID provided.</p>
                <button 
                    onClick={() => router.push('/admin/courses')}
                    className="mt-4 rounded-md bg-primary py-2 px-6 text-white font-bold hover:bg-opacity-90"
                >
                    Go Back to Course Management
                </button>
            </div>
        );
    }

    if (loading) {
        // The Suspense fallback handles the initial loading state before this component mounts
        return (
            <div className="container py-20 text-center">
                <Breadcrumb pageName="Course Details" description="Loading..." />
                <p className="text-xl">Loading Course Details...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container py-20 text-center">
                <Breadcrumb pageName="Course Details" description="Course Not Found" />
                <p className="text-xl text-red-500">Course with ID {courseId} not found.</p>
            </div>
        );
    }

    return (
        <>
            <Breadcrumb
                pageName={`Manage Content: ${course.title}`}
                description={`${course.description}`}
            />

            <section className="pb-[120px] pt-[70px]">
                <div className="container">
                   {/* Course Info Header */}
                   

<div className="bg-white dark:bg-dark shadow-two rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-6">
    {/* Course Image Section */}
    <div className="flex-shrink-0 w-full md:w-1/3 h-48 relative rounded-lg overflow-hidden">
        {/* Use Image component for optimization. Ensure 'imageUrl' is not null/undefined. */}
        <Image
            src={course.imageUrl || "/images/placeholder-course.jpg"}
            alt={course.title}
            fill
            className="object-cover"
            // You might need to add priority or unoptimized based on your setup
        />
    </div>

    {/* Course Details and Actions Section */}
    <div className="w-full md:w-2/3">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
            {course.title}
        </h2>
        <p className="text-body-color italic mb-2">
           Course ID: **{course.id}** | Category: **{course.category?.name ?? 'N/A'}**
        </p>
        <p className="text-body-color text-lg mb-4 font-semibold">
           Instructor: **{course.instructorName}**
        </p>
        
        <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
                onClick={() => router.push(`/admin/editcourse?courseId=${course.id}`)}
                className="rounded-md bg-green-500 py-2 px-4 text-white font-semibold hover:bg-green-600 transition duration-300 flex items-center"
            >
                Edit Course Details 📝
            </button>
            <button
                onClick={() => router.push('/admin/courses')}
                className="rounded-md bg-gray-500 py-2 px-4 text-white font-semibold hover:bg-gray-600 transition duration-300 flex items-center"
            >
                Back to Courses ⬅️
            </button>
        </div>
    </div>
</div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* --- Content Management Actions (1/3) --- */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 p-6 shadow-one rounded-lg dark:bg-dark">
                                <h3 className="text-xl font-bold text-black dark:text-white mb-4 border-b pb-2">
                                    Content Actions
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setActiveTab('section')}
                                        className={`w-full py-3 px-4 text-left rounded-md font-semibold transition duration-300 ${
                                            activeTab === 'section' 
                                                ? 'bg-primary text-white' 
                                                : 'bg-gray-200 dark:bg-gray-300 text-black dark:text-black hover:bg-gray-200 dark:hover:bg-dark-4'
                                        }`}
                                    >
                                        <Plus className="inline-block h-4 w-4 mr-2" /> Add Section
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('topic')}
                                        className={`w-full py-3 px-4 text-left rounded-md font-semibold transition duration-300 ${
                                            activeTab === 'topic' 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-200 dark:bg-gray-300 text-black dark:text-black hover:bg-gray-200 dark:hover:bg-dark-4'
                                        }`}
                                        disabled={sections.length === 0}
                                    >
                                        <Plus className="inline-block h-4 w-4 mr-2" /> Add Topic
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('content')}
                                        className={`w-full py-3 px-4 text-left rounded-md font-semibold transition duration-300 ${
                                            activeTab === 'content' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-200 dark:bg-gray-300 text-black dark:text-black hover:bg-gray-200 dark:hover:bg-dark-4'
                                        }`}
                                    >
                                        Content Structure
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* --- Forms and Content Display (2/3) --- */}
                        <div className="lg:col-span-2">
                            {/* Conditional Rendering of Forms */}
                            {activeTab === 'section' && (
                                <SectionForm 
                                    courseId={course.id} 
                                    onSectionAdded={fetchCourseDetails}
                                />
                            )}
                            
                            {activeTab === 'topic' && (
                                <TopicForm 
                                    courseId={course.id} 
                                    sections={sections} 
                                    onTopicAdded={fetchCourseDetails}
                                />
                            )}
                            
                            {/* Default or 'content' tab display */}
                            {(activeTab === 'content' || (activeTab !== 'section' && activeTab !== 'topic')) && (
                                <CourseContentList 
                                    sections={sections} 
                                     courseId={course.id} 
                                    refetchContent={fetchCourseDetails}
                                />
                            )}

                            {/* Always show the content list below the forms if a form is active */}
                            {activeTab !== 'content' && (
                                <div className="mt-8">
                                    <h3 className="text-2xl font-bold text-black dark:text-white mb-4 border-b pb-2">
                                        Current Content Preview
                                    </h3>
                                    <CourseContentList 
                                        sections={sections}
                                        courseId={course.id} 
                                        refetchContent={fetchCourseDetails}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminCourseDetails;