"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../auth/AuthContext"; // adjust path if needed

const Profile = () => {
  // CHANGED: Destructured reloadUser from useAuth
  const { user, token, authAxios, reloadUser } = useAuth();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for form fields
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // CHANGED: Added state for user feedback (e.g., success or error messages)
  const [feedback, setFeedback] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      // Use the profile_pic from the user context as the source of truth
      setProfileImage(user.profile_pic || null);
    }
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFeedback(null); // Clear previous feedback

    // Show a temporary local preview of the image
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // The authAxios instance already includes the token
      await authAxios.post("api/user/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // CHANGED: After a successful upload, reload the user data from the context.
      // This will update the `user.profile_pic` URL across the entire app.
      await reloadUser();
      
      setFeedback({ type: 'success', message: 'Image updated successfully!' });
      
    } catch (error: any) {
      console.error("Upload failed:", error.response?.data || error.message);
      setFeedback({ type: 'error', message: 'Failed to upload image.' });
      // Revert to the original image from the user context if upload fails
      setProfileImage(user?.profile_pic || null); 
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // CHANGED: Implemented the form submission logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null); // Clear previous feedback

    // Create a payload with the data to update
    const updateData: { [key: string]: string } = {
      firstName,
      lastName,
    };

    // Only include the password if the user has entered a new one
    if (password) {
      updateData.password = password;
    }

    try {
      // Assuming your backend has a PUT endpoint to update user details
      await authAxios.put("/api/user/profile", updateData);

      // CRUCIAL: Reload user data to reflect changes globally
      await reloadUser();
      
      setFeedback({ type: 'success', message: 'Profile saved successfully!' });
      setPassword(""); // Clear the password field for security
      
    } catch (error: any) {
      console.error("Profile update failed:", error.response?.data || error.message);
      setFeedback({ type: 'error', message: 'Failed to save profile.' });
    }
  };

  return (
    <section id="profile" className="pt-16 pb-10 md:pt-20 lg:pt-28">
      <div className="container">
        <div className="flex justify-center"> {/* Centering the whole component */}
            <div className="w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900">
              <h2 className="mb-6 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Edit Your Profile
              </h2>

              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-gray-300 dark:border-gray-700">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
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
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleEditClick}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  Change Picture
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    disabled
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password to change"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                {/* CHANGED: Added feedback display */}
                {feedback && (
                  <div
                    className={`rounded-md p-3 text-sm ${
                      feedback.type === 'success'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}


                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
                >
                  Save Profile
                </button>
              </form>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;