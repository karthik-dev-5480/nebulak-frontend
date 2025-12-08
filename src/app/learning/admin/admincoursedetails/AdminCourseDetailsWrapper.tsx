"use client"; // REQUIRED: This component must run on the client

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; 
import AdminCourseDetails from "./AdminCourseDetails";

// Inner component that uses the search params
function AdminCourseDetailsWrapperInner() {
    // This hook call is now safely wrapped inside a client-side component 
    // which is a direct child of the Suspense boundary.
    const searchParams = useSearchParams(); 
    const courseIdParam = searchParams.get('courseId');
    const courseId = courseIdParam ? parseInt(courseIdParam) : null;

    return <AdminCourseDetails initialCourseId={courseId} />; 
}

// This component extracts the search param and is responsible for the client-side call
export default function AdminCourseDetailsWrapper() {
    return (
        <Suspense fallback={
            <div className="pt-16 pb-10 md:pt-20 lg:pt-28">
                <div className="container text-center text-lg font-semibold">
                    Loading...
                </div>
            </div>
        }>
            <AdminCourseDetailsWrapperInner />
        </Suspense>
    );
}