import { Suspense } from "react";
// Import the new wrapper which is now a Client Component
import AdminCourseDetailsWrapper from "./AdminCourseDetailsWrapper"; 

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="container py-20 text-center">
          <p className="text-xl font-semibold">Loading Course...</p>
        </div>
      }
    >
      {/* Use the new wrapper component */}
      <AdminCourseDetailsWrapper /> 
    </Suspense>
  );
}