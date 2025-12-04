"use client";

import React, { useState, useEffect } from "react";
import AdminSingleCourse from "@/components/Courses/AdminSingleCourse"; 
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Course, CoursesPageResponse } from "@/types/course";
import { useRouter } from 'next/navigation';

const token = "token";
const useAuthToken = () => {
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwtToken = localStorage.getItem(token);
      setJwt(jwtToken);
    }
  }, []);

  return jwt;
};
// Define the shape of the category data
interface Category {
  id: number;
  name: string;
}

// Keep mockDurations as they are client-side only
const mockDurations = [
    { value: "6", label: "0-5 Hours" },
    { value: "12", label: "5-10 Hours" },
    { value: "18", label: "10+ Hours" },
];

// --- New: Add Category Modal Component ---
const AddCategoryModal = ({ onClose, onSave, isLoading }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (categoryName.trim()) {
            onSave(categoryName.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-dark p-8 rounded-lg shadow-2xl w-full max-w-md mx-4">
                <h3 className="mb-6 text-2xl font-bold text-black dark:text-white border-b pb-3">
                    Add New Course Category
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label 
                            htmlFor="categoryName" 
                            className="block text-md font-medium text-black dark:text-white mb-2"
                        >
                            Category Name
                        </label>
                        <input
                            type="text"
                            id="categoryName"
                            placeholder="e.g., Web Development"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full rounded-md border border-stroke dark:border-dark-3 py-3 px-4 text-dark dark:text-white focus:border-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-gray-200 dark:bg-gray-700 py-2 px-4 text-black dark:text-white font-semibold hover:bg-gray-300 transition duration-300"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="rounded-md bg-primary py-2 px-4 text-white font-bold hover:bg-opacity-90 transition duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
// ---------------------------------------------


const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  // --- NEW STATE FOR CATEGORIES ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // --- NEW STATE FOR MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  // ----------------------------------

  const pageSize = 3; 
  const router = useRouter();
  const jwt = useAuthToken(); // jwt will be null initially, then updated

  // --- Category Data Fetching Logic (Refactored to be callable) ---
  const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
          const response = await fetch("http://localhost:5454/courses/getcategories");
          if (!response.ok) {
              throw new Error("Failed to fetch categories");
          }
          const data: Category[] = await response.json();
          setCategories(data);
      } catch (error) {
          console.error("Error fetching categories:", error);
      } finally {
          setLoadingCategories(false);
      }
  };

  useEffect(() => {
    fetchCategories();
  }, []); // Run only once on component mount

  // --- New: Handler for adding a category ---
  const handleAddCategory = async (categoryName: string) => {
    setIsSavingCategory(true);
    try {
        const response = await fetch("http://localhost:5454/courses/addcategory", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Assuming you need an Authorization header if this is an admin action
                'Authorization': `Bearer ${jwt}`, 
            },
            body: JSON.stringify({ name: categoryName }),
        });

        if (!response.ok) {
            // Attempt to read the error message from the response body
            const errorText = await response.text();
            throw new Error(`Failed to add category: ${errorText || response.statusText}`);
        }

        alert(`Category "${categoryName}" added successfully!`);
        setIsModalOpen(false); // Close the modal
        await fetchCategories(); // Refresh the category list in the sidebar

    } catch (error) {
        console.error("Error adding category:", error);
        alert(`Failed to add category. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
        setIsSavingCategory(false);
    }
  };
  // ------------------------------------------

  // --- Course Data Fetching Logic (Existing useEffect) ---
  const fetchCourses = async () => {
    setLoading(true);
    
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('size', pageSize.toString());

    if (selectedCategory) {
      params.append('categoryId', selectedCategory.toString());
    }
    if (keyword) {
      params.append('keyword', keyword);
    }
    if (selectedDuration) {
      params.append('duration', selectedDuration);
    }

    
  
    const url = `http://localhost:5454/courses/admin/getcourses?${params.toString()}`;
    
    // Console log to see the token being used
    console.log("Fetching courses with JWT:", jwt ? "Token Present" : "Token NULL/Missing");

    try {
      const response = await fetch(url,{
        method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Use the resolved jwt value here
                'Authorization': `Bearer ${jwt}`, 
            }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204 || response.headers.get('Content-Length') === '0') {
            console.warn("Received 204 No Content or empty body. Setting courses to empty array.");
            setCourses([]);
            setTotalPages(1);
            return; // Exit successfully without trying to parse JSON
        }
        
        // Try-catch block around JSON parsing to handle unexpected empty body errors gracefully
        let data: CoursesPageResponse;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error("Error parsing JSON. Response text:", await response.text());
            throw new Error("Failed to parse course data as JSON. Received an unexpected response format.");
        }
        
        const courseContent = Array.isArray(data.content) ? data.content : [];
        
        setCourses(courseContent);
        setTotalPages(data.totalPages || 1);

    } catch (error) {
      console.error("Failed to fetch courses for admin:", error);
      setCourses([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // --- FIX APPLIED HERE ---
  useEffect(() => {
    // Only fetch courses if the JWT has been loaded (i.e., is not null)
    if (jwt) {
      fetchCourses();
    } else {
      // If jwt is null, we are waiting for the token to load from localStorage.
      // Set loading to true initially until token is resolved.
      setLoading(true);
    }
  }, [currentPage, selectedCategory, keyword, selectedDuration, jwt]);
  // -------------------------

  // --- Filter and Pagination Handlers ---
  const handleFilterChange = (setter: React.Dispatch<any>, value: any) => {
    setCurrentPage(1);
    setter(value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  };

  
  const handleDelete = async (courseId: number) => {
      if (!confirm(`Are you sure you want to DELETE Course ID: ${courseId}?`)) {
          return;
      }

      console.log(`[ADMIN ACTION] Deleting Course ID: ${courseId}...`);
      
      try {
          const response = await fetch(`http://localhost:5454/courses/deletecourse/${courseId}`, {
              method: 'DELETE',
          });
          if (response.ok) {
              console.log(`Course ${courseId} deleted successfully.`);
              // Refetch courses to update the list
              fetchCourses(); 
          } else {
              alert('Failed to delete course.');
          }
      } catch (error) {
          console.error("Delete failed:", error);
      }
     
  };


// --- FilterSidebar Component (Updated) ---
const FilterSidebar = () => (
    <div className="sticky top-20 p-6 shadow-one rounded-xs dark:bg-dark">
      <h3 className="mb-4 text-xl font-bold text-black dark:text-white border-b pb-2">
        Filter Courses
      </h3>

      <div className="mb-6">
        <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
          Search
        </h4>
        <input
          type="text"
          placeholder="Keyword search"
          value={keyword}
          onChange={(e) => handleFilterChange(setKeyword, e.target.value)}
          className="w-full rounded-md border border-stroke dark:border-dark-3 py-2 px-4 text-dark dark:text-white focus:border-primary focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
          Category
        </h4>
        {loadingCategories ? (
            <p className="text-body-color">Loading categories...</p>
        ) : (
            categories.map((cat) => (
              <label key={cat.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedCategory === cat.id}
                  onChange={() => 
                    handleFilterChange(
                      setSelectedCategory, 
                      selectedCategory === cat.id ? null : cat.id
                    )
                  }
                  className="mr-2 accent-primary"
                />
                <span className="text-body-color">{cat.name}</span>
              </label>
            ))
        )}
      </div>

      <div className="mb-6">
        <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
          Duration
        </h4>
        <select
          value={selectedDuration || ""}
          onChange={(e) => 
            handleFilterChange(
              setSelectedDuration, 
              e.target.value === "" ? null : e.target.value
            )
          }
          className="w-full rounded-md border border-stroke dark:border-dark-3 py-2 px-4 text-dark dark:text-white focus:border-primary focus:outline-none"
        >
          <option value="">All Durations</option>
          {mockDurations.map((dur) => (
            <option key={dur.value} value={dur.value}>
              {dur.label}
            </option>
          ))}
        </select>
      </div>

      <button 
        onClick={() => {
          handleFilterChange(setKeyword, "");
          handleFilterChange(setSelectedCategory, null);
          handleFilterChange(setSelectedDuration, null);
        }}
        className="w-full rounded-md bg-gray-200 dark:bg-gray-700 py-2 text-black dark:text-white font-semibold hover:bg-gray-300 transition duration-300"
      >
        Clear Filters
      </button>
    </div>
  );
  
  // --- Main Render ---
  return (
    <>
      <Breadcrumb
        pageName="Admin Course Management"
        description="Manage the course catalog: Edit, Delete, or Add new courses/categories."
      />

      {/* --- Render the Modal if state is true --- */}
      {isModalOpen && (
        <AddCategoryModal 
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddCategory}
            isLoading={isSavingCategory}
        />
      )}
      {/* ------------------------------------------- */}

      <section className="pb-[120px]">
        <div className="container">
           <div className="mb-8 flex justify-end space-x-4"> {/* Added space-x-4 */}
                  
                  {/* --- NEW: Add Category Button --- */}
                  <button 
                      className="rounded-md bg-green-500 py-3 px-6 text-white font-bold hover:bg-green-600 transition duration-300"
                      onClick={() => setIsModalOpen(true)} // Open the modal
                  >
                      + Add Category
                  </button>
                  {/* --------------------------------- */}

                  <button 
                      className="rounded-md bg-primary py-3 px-6 text-white font-bold hover:bg-opacity-90 transition duration-300"
                      onClick={() => router.push(`/learning/admin/addcourse`)}
                  >
                      + Create New Course
                  </button>
              </div>
          <div className="-mx-4 flex flex-wrap">
            
            <div className="w-full px-4 lg:w-1/4">
              <FilterSidebar />
            </div>

            <div className="w-full px-4 lg:w-3/4">
              {loading ? (
                <div className="text-center py-20">Loading Courses...</div>
              ) : courses.length > 0 ? (
                <>
                  <div className="-mx-4 flex flex-wrap">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="w-full px-4 md:w-1/2 xl:w-1/3 mb-8"
                      >
                        <AdminSingleCourse 
                          course={course} 
                          onDelete={handleDelete}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="w-full px-4">
                    {/* Pagination component here */}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  No courses found matching your criteria.
                </div>
              )}
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminCourses;