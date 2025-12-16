"use client";

import React, { useState, useEffect } from "react";
import SingleCourse from "@/components/Courses/SingleCourse"; 
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Course, CoursesPageResponse } from "@/types/course";

// Define the shape of the category data (copied from AdminCourses)
interface Category {
  id: number;
  name: string;
}

// Replaced with an empty array to be populated by the fetch
// const mockCategories = [
//   { id: 1, name: "Web Development" },
//   { id: 2, name: "Data Science" },
//   { id: 3, name: "UI/UX Design" },
// ];

const mockDurations = [
    { value: "0-5", label: "0-5 Hours" },
    { value: "5-10", label: "5-10 Hours" },
    { value: "10+", label: "10+ Hours" },
];


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Courses = () => {
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
  // ----------------------------------

  const pageSize = 9; 

  // --- Category Data Fetching Logic (Copied from AdminCourses) ---
  const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
          const response = await fetch(`${API_BASE_URL}/courses/getcategories`);
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
  // -----------------------------------------------------------------

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
  
    const url = `${API_BASE_URL}/courses/getcourses?${params.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const data: CoursesPageResponse = await response.json();
      
      const courseContent = Array.isArray(data.content) ? data.content : [];
      
      setCourses(courseContent);
      setTotalPages(data.totalPages || 1); 

    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCourses([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, selectedCategory, keyword, selectedDuration]);

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

  const Pagination = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <ul className="flex items-center justify-center pt-8">
        <li className="mx-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-body-color/15 text-body-color hover:bg-primary flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
        </li>
        
        {pages.map((page) => (
          <li key={page} className="mx-1">
            <button
              onClick={() => handlePageChange(page)}
              className={`flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition ${
                page === currentPage 
                  ? 'bg-primary text-white' 
                  : 'bg-body-color/15 text-body-color hover:bg-primary hover:text-white'
              }`}
            >
              {page}
            </button>
          </li>
        ))}
        
        <li className="mx-1">
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-body-color/15 text-body-color hover:bg-primary flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </li>
      </ul>
    );
  };
    
  // --- FilterSidebar Component (UPDATED to use fetched categories) ---
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
        {loadingCategories ? ( // Show loading state for categories
            <p className="text-body-color">Loading categories...</p>
        ) : (
            categories.map((cat) => ( // Use the fetched 'categories' state
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
      {/* ------------------------------------------------------------- */}


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
  return (
    <>
      <Breadcrumb
        pageName="Course Catalog"
        description="Explore a wide range of courses tailored to your professional development."
      />

      <section className="pt-[60px] pb-[120px]">
        <div className="container">
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
                        <SingleCourse course={course} />
                      </div>
                    ))}
                  </div>

                  <div className="w-full px-4">
                    <Pagination />
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

export default Courses;