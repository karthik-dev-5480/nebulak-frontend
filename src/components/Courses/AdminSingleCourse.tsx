import { Course } from "@/types/course"; // Assuming you define the types above
import Image from "next/image";
import Link from "next/link";
import React from "react"; // Explicitly import React for clarity

interface AdminSingleCourseProps {
  course: Course;
  onDelete: (courseId: number) => void;
}

const AdminSingleCourse = ({ course, onDelete }: AdminSingleCourseProps) => {
  const { id, title, description, imageUrl, instructorName, price, discountedPrice, category } = course;
  
  const formattedPrice = price != null ? price.toFixed(2) : 'N/A';
  const formattedDiscountedPrice = discountedPrice != null ? discountedPrice.toFixed(2) : null;
  
  // Define the target URL for editing
  const editUrl = `/learning/admin/editcourse?courseId=${id}`;

  return (
    <>
      <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xs bg-white duration-300 h-full">
        {/* Course Image and Category Tag */}
        <Link
          href={`/learning/admin/admincoursedetails?courseId=${id}`} // Link to a course detail page
          className="relative block aspect-37/22 w-full"
        >
          <span className="bg-primary absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
            {category.name}
          </span>
          {/* Using a placeholder image if imageUrl is empty */}
          <Image 
            src={imageUrl || "/images/placeholder-course.jpg"} 
            alt={title} 
            fill 
            className="object-cover"
          />
        </Link>
        
        {/* Course Details */}
        <div 
            className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8 flex flex-col justify-between"
            style={{ minHeight: '300px' }}
        >
          <div>
            {/* Title - FIX APPLIED HERE: Added minHeight to reserve space for 2 lines */}
            <h3 style={{ minHeight: '4.5rem' }} className="mb-2"> {/* minHeight: 4.5rem is approximately 72px, safe for 2 lines of text-2xl */}
              <Link
                href={`/learning/admin/admincoursedetails?courseId=${id}`}
                className="hover:text-primary dark:hover:text-primary block text-xl font-bold text-black sm:text-2xl dark:text-white line-clamp-2"
              >
                {title}
              </Link>
            </h3>
            {/* Description */}
            <p className="text-body-color mb-4 text-base font-medium line-clamp-2">
              {description}
            </p>
          </div>
          
          {/* Instructor and Price */}
          <div>
              <div className="flex items-center justify-between border-body-color/10 mb-6 border-b pb-4 dark:border-white/10">
                <div>
                  <h4 className="text-dark mb-1 text-sm font-medium dark:text-white">
                    Instructor
                  </h4>
                  <p className="text-body-color text-xs">{instructorName}</p>
                </div>
                
                <div className="text-right">
                  {formattedDiscountedPrice ? (
                    <>
                      <p className="text-body-color text-xs line-through">
                        ${formattedPrice}
                      </p>
                      <h4 className="text-primary text-xl font-bold dark:text-white">
                        ${formattedDiscountedPrice}
                      </h4>
                    </>
                  ) : (
                    <h4 className="text-primary text-xl font-bold dark:text-white">
                      ${formattedPrice}
                    </h4>
                  )}
                </div>
              </div>
              
              {/* Admin Action Buttons */}
              <div className="flex space-x-4">
                <Link
                  href={editUrl}
                  className="w-1/2 rounded-md bg-green-500 py-2 text-white font-semibold hover:bg-green-600 transition duration-300 text-center"
                >
                  Edit ✏️
                </Link>
                <button 
                  onClick={() => onDelete(id)}
                  className="w-1/2 rounded-md bg-red-500 py-2 text-white font-semibold hover:bg-red-600 transition duration-300"
                >
                  Delete 🗑️
                </button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSingleCourse;