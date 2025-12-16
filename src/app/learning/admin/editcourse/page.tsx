"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation'; 

// Define the shape of the category data (same as in AddProduct)
interface Category {
  id: number;
  name: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const EditCourseContent = () => {
  // 1. Get search parameters from the URL
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId') || ""; 

  // State for Course Data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [categoryId, setCategoryId] = useState(""); // Stores the selected category ID
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- NEW STATE FOR CATEGORIES ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  // ----------------------------------

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effect 1: Fetch all Categories ---
  useEffect(() => {
    const fetchCategories = async () => {
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
            setCategoriesLoaded(true);
        }
    };
    fetchCategories();
  }, []);

  // --- Effect 2: Load existing course data (Dependent on categories) ---
  useEffect(() => {
    // Only fetch if a valid courseId is found AND categories are loaded
    if (courseId && categoriesLoaded) {
      fetchCourseData(courseId);
    } else if (!courseId) {
        // If courseId is missing, stop loading
        console.error("Course ID is missing from URL.");
        setIsLoading(false);
    }
  }, [courseId, categoriesLoaded]); // Dependency array includes categoriesLoaded

  const fetchCourseData = async (id: string) => {
    try {
       const response = await fetch(`${API_BASE_URL}/courses/course/${id}`);
       if (!response.ok) {
           throw new Error(`Failed to fetch course details for ID: ${id}`);
       }
       
       const data = await response.json();

       // Ensure your /courses/course/{id} endpoint returns the category ID 
       // or at least the category object from which you can get the ID.
       const fetchedCategoryId = data.category.id || (data.category && data.category.id);
       
       setTitle(data.title);
       setDescription(data.description);
       setInstructorName(data.instructorName);
       setPrice(String(data.price));
       setDiscountedPrice(String(data.discountedPrice));
       setDuration(String(data.duration));
       
       // SET CATEGORY ID: Use the fetched ID to set the dropdown's initial value
       if (fetchedCategoryId) {
           setCategoryId(String(fetchedCategoryId));
       } else if (categories.length > 0) {
           // Fallback: If category ID is missing, select the first one
           setCategoryId(String(categories[0].id));
       }

       setProductImage(data.imageUrl);

    } catch (error) {
      console.error("Error fetching course data:", error);
      alert("Failed to load course data.");
    } finally {
      setIsLoading(false);
    }
  };


  // 2. Form Submission for Update (Unchanged logic, uses categoryId state)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId) {
        alert("Cannot update course: ID is missing.");
        return;
    }
    if (!categoryId) {
        alert("Please select a category.");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("instructorName", instructorName);
    formData.append("price", String(price));
    formData.append("discountedPrice", String(discountedPrice));
    formData.append("duration", String(duration));
    formData.append("categoryId", String(categoryId)); // Category ID from the dropdown
    
    // Check if a new file is selected. Only append 'image' if a new file exists.
    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      // NOTE: Ensure your backend endpoint is correct (it should be /editcourse/{courseId})
      const response = await fetch(`${API_BASE_URL}/courses/editcourse/${courseId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.text();
      console.log("Course updated successfully:", result);
      alert("Course updated successfully!");

      // Optional: Refetch data to ensure UI reflects the latest changes
      fetchCourseData(courseId);

    } catch (error: any) {
      console.error("Error updating course:", error.message);
      alert("Error: " + error.message);
    }
  };

  if (isLoading || !categoriesLoaded) {
    return (
      <section id="edit-course" className="pt-16 pb-10 md:pt-20 lg:pt-28">
        <div className="container text-center text-lg font-semibold">
            {isLoading ? "Loading Course Data..." : "Loading Categories..."}
        </div>
      </section>
    );
  }

  // The rest of the return JSX is where we replace the input field
  return (
    <section id="edit-course" className="pt-16 pb-10 md:pt-20 lg:pt-28">
      <div className="container">
        <div className="flex justify-center">
          <div className="w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900">
            <h2 className="mb-6 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Edit Course (ID: {courseId})
            </h2>
            
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative h-36 w-36 overflow-hidden rounded-xl border-4 border-gray-300 dark:border-gray-700">
                {productImage ? (
                  <img
                    src={productImage}
                    alt="Course"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800">
                    No Image
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setProductImage(URL.createObjectURL(file));
                  }
                }}
              />

              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload New Image
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Title, Description, Instructor, Price, Discounted Price, Duration fields (omitted for brevity, assume they are the same) */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter product title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instructor Name
                </label>
                <input
                  type="text"
                  placeholder="Enter instructor name"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="4999.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    placeholder="999.00"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    placeholder="12"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                {/* --- CATEGORY DROPDOWN REPLACEMENT START --- */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    {/* Default/Placeholder option */}
                    {categories.length === 0 && (
                      <option value="" disabled>No categories available</option>
                    )}
                    
                    {/* Map the fetched categories */}
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* --- CATEGORY DROPDOWN REPLACEMENT END --- */}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const EditCourse = () => {
  return (
    <Suspense fallback={
      <section id="edit-course" className="pt-16 pb-10 md:pt-20 lg:pt-28">
        <div className="container text-center text-lg font-semibold">
          Loading...
        </div>
      </section>
    }>
      <EditCourseContent />
    </Suspense>
  );
};

export default EditCourse;