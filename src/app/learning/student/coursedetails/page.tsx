// app/student/view-course/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Course, Section } from "@/types/course"; 
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import StudentCourseContentList from "@/components/Courses/Student/StudentCoureContentList";
import TopicNoteForm from "@/components/Courses/Student/TopicNoteForm";


const StudentCourseContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseIdParam = searchParams.get('courseId');
    const courseId = courseIdParam ? parseInt(courseIdParam) : null;

    const [course, setCourse] = useState<Course | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State for managing the active note form
    const [activeNote, setActiveNote] = useState<{ topicId: number, topicTitle: string } | null>(null);


    const fetchCourseDetails = useCallback(async () => {
        if (!courseId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Re-using the same public API endpoint to fetch course data
            const response = await fetch(`http://localhost:5454/courses/course/${courseId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch course details for ID: ${courseId}`);
            }
       
            const data: Course = await response.json();
            setCourse(data);
            // Sort sections by sectionOrder for correct display
            const sortedSections = data.sections?.sort((a, b) => a.sectionOrder - b.sectionOrder) || [];
            // Sort topics within each section
            sortedSections.forEach(section => {
                section.topics.sort((a, b) => a.topicOrder - b.topicOrder);
            });
            setSections(sortedSections); 
        
        } catch (error) {
            console.error("Error fetching course details:", error);
            setCourse(null);
            setSections([]);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourseDetails();
    }, [fetchCourseDetails]);


    // Handle opening the note form
    const handleAddNote = (topicId: number, topicTitle: string) => {
        setActiveNote({ topicId, topicTitle });
    };

    // Handle closing the note form after saving
    const handleNoteSaved = () => {
        setActiveNote(null);
        // Optionally refetch user-specific notes here if needed
    }


    if (!courseId) {
        return (
            <div className="container py-20 text-center">
                <Breadcrumb pageName="Course View" description="Error" />
                <p className="text-xl text-red-500">Error: No Course ID provided.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container py-20 text-center">
                <Breadcrumb pageName="Course View" description="Loading..." />
                <p className="text-xl">Loading Course Details...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container py-20 text-center">
                <Breadcrumb pageName="Course View" description="Course Not Found" />
                <p className="text-xl text-red-500">Course with ID {courseId} not found.</p>
            </div>
        );
    }

    return (
        <>
            <Breadcrumb
                pageName={`Course Content: ${course.title}`}
                description={`Start learning! ${course.description}`}
            />

            <section className="pb-[120px] pt-[70px]">
                <div className="container">
                   
                    {/* Course Info Header (Simplified) */}
                    <div className="bg-white dark:bg-gray-900 shadow-two rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-6 border border-primary/20">
                        {/* Course Image Section */}
                        <div className="flex-shrink-0 w-full md:w-1/4 h-36 relative rounded-lg overflow-hidden">
                            <Image
                                src={course.imageUrl || "/images/placeholder-course.jpg"}
                                alt={course.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Course Details */}
                        <div className="w-full md:w-3/4">
                            <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
                                {course.title}
                            </h2>
                            <p className="text-body-color text-sm italic mb-2">
                                Category: **{course.category?.name ?? 'N/A'}** | Instructor: **{course.instructorName}**
                            </p>
                            <p className="text-body-color line-clamp-2">
                                {course.description}
                            </p>
                            
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* --- Notes Section (1/3) --- */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20">
                                {activeNote ? (
                                    // Show the Note Form if a topic is selected
                                    <TopicNoteForm 
                                        topicId={activeNote.topicId}
                                        topicTitle={activeNote.topicTitle}
                                        courseId={course.id}
                                        onNoteSaved={handleNoteSaved}
                                    />
                                ) : (
                                    // Default message when no topic is selected
                                    <div className="p-6 bg-white dark:bg-gray-800 shadow-one rounded-lg border border-gray-300 dark:border-gray-700">
                                        <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                                            Your Study Hub
                                        </h3>
                                        <p className="text-body-color">
                                            Select a lesson's **Notes** button to begin taking personal notes for that topic.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- Content Display (2/3) --- */}
                        <div className="lg:col-span-2">
                            <StudentCourseContentList 
                                sections={sections} 
                                onAddNote={handleAddNote}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default StudentCourseContent;