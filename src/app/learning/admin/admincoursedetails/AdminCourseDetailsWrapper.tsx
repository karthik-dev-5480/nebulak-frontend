"use client"; // REQUIRED: This component must run on the client

import { useSearchParams } from 'next/navigation'; 
import AdminCourseDetails from "./AdminCourseDetails";

// This component extracts the search param and is responsible for the client-side call
export default function AdminCourseDetailsWrapper() {
    // This hook call is now safely wrapped inside a client-side component 
    // which is a direct child of the Suspense boundary.
    const searchParams = useSearchParams(); 
    const courseIdParam = searchParams.get('courseId');
    const courseId = courseIdParam ? parseInt(courseIdParam) : null;

    return <AdminCourseDetails initialCourseId={courseId} />; 
}