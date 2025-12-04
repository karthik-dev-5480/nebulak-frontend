"use client";
import { useState, useRef, useEffect } from "react";

// Define the shape of the category data
interface Category {
  id: number;
  name: string;
}

// --- JWT Hook (Copied from AdminCourses) ---
const token = "token"; // Assuming this is your localStorage key
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
// -------------------------------------------


const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [duration, setDuration] = useState("");
  // categoryId will be a string value from the <select>
  const [categoryId, setCategoryId] = useState("");
  const [productImage, setProductImage] = useState<string | null>(null);

  // New state for storing fetched categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  
  // Get the JWT token
  const jwt = useAuthToken();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- useEffect to fetch categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5454/courses/getcategories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data: Category[] = await response.json();
        setCategories(data);
        // Set the default categoryId to the first item's ID if available
        if (data.length > 0) {
          setCategoryId(String(data[0].id));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoryError("Could not load categories. Please check the backend server.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  // ------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for JWT token
    if (!jwt) {
        alert("Authentication required. JWT token is missing or not loaded.");
        console.error("JWT is null. Cannot submit form.");
        return;
    }

    if (!fileInputRef.current?.files?.[0]) {
      alert("Please select an image");
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
    // categoryId is now guaranteed to be set from the dropdown's state
    formData.append("categoryId", String(categoryId)); 
    formData.append("image", fileInputRef.current.files[0]);

    try {
      const response = await fetch("http://localhost:5454/courses/addcourse", {
        method: "POST",
        // --- ADDED Authorization Header with JWT ---
        headers: {
            'Authorization': `Bearer ${jwt}`, 
        },
        // FormData automatically sets the Content-Type to multipart/form-data
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Check for specific unauthorized/forbidden status
        if (response.status === 401 || response.status === 403) {
             throw new Error("Unauthorized or Forbidden. Please log in as an administrator.");
        }
        throw new Error(errorText);
      }

      const result = await response.text();
      console.log("Course created successfully:", result);
      alert("Course added successfully!");

      // Optional: reset form
      setTitle("");
      setDescription("");
      setInstructorName("");
      setPrice("");
      setDiscountedPrice("");
      setDuration("");
      // Reset categoryId to the default/first one
      if (categories.length > 0) {
          setCategoryId(String(categories[0].id));
      } else {
          setCategoryId("");
      }
      setProductImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      console.error("Error uploading course:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <section id="add-product" className="pt-16 pb-10 md:pt-20 lg:pt-28">
      <div className="container">
        <div className="flex justify-center">
          <div className="w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900">
            <h2 className="mb-6 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Add New Course
            </h2>

            {/* Image Upload Block (omitted for brevity, assume it's the same) */}
            <div className="flex flex-col items-center gap-4 mb-8">
              {/* ... existing image upload logic ... */}
              <div className="relative h-36 w-36 overflow-hidden rounded-xl border-4 border-gray-300 dark:border-gray-700">
                {productImage ? (
                  <img
                    src={productImage}
                    alt="Product"
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
                Upload Image
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
                  {loadingCategories ? (
                    <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
                  ) : categoryError ? (
                    <p className="text-red-500 dark:text-red-400">{categoryError}</p>
                  ) : (
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    >
                      {/* Optional: Add a disabled default option if no category is pre-selected */}
                      {categories.length === 0 && (
                        <option value="" disabled>No categories available</option>
                      )}
                      
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {/* --- CATEGORY DROPDOWN REPLACEMENT END --- */}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;