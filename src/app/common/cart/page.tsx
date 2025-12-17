// app/cart/page.tsx or pages/cart.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "@/types/course"; // Assuming you have this type
import Breadcrumb from "@/components/Common/Breadcrumb"; // Assuming you have this component
import { useRouter } from "next/navigation";
// 💡 Reuse the authentication hook and constants from SingleCourse.tsx
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const CART_FETCH_URL = `${API_BASE_URL}/cart/user`;

// --- Type Definitions for Cart (UPDATED) ---
interface CartItem {
  id: number; // Cart Item ID
  course: Course;
  quantity: number; // Will always be 1 for a course, but good to have
}

interface CartDetails {
  id: number;
  user: any; // Simplified user
  cartItems: CartItem[];
  // Assuming these fields now come directly from the backend
  subtotal: number;
  discountAmount: number; 
  totalPrice: number;
}

// ------------------------------------

const Cart = () => {
  const jwt = useAuthToken();
  const [cartDetails, setCartDetails] = useState<CartDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 const router = useRouter(); 

  const fetchCartDetails = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(CART_FETCH_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Ensure the backend data matches the new CartDetails interface
        const data: CartDetails = await response.json(); 
        setCartDetails(data);
      } else if (response.status === 404) {
        // Cart is empty or not yet created
        setCartDetails(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch cart: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError((err as Error).message || "A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jwt) {
      fetchCartDetails(jwt);
    } else {
      setLoading(false);
      setError("Please log in to view your cart.");
    }
  }, [jwt]);


  // --- Handlers for Cart Actions ---

  const handleRemoveItem = async (cartItemId: number) => {
    if (!jwt) return;

    const removeUrl = `${API_BASE_URL}/cart/removeitem/${cartItemId}`;

    try {
      const response = await fetch(removeUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });

      if (response.ok) {
        alert("Course removed from cart.");
        // Re-fetch cart details to update the UI
        fetchCartDetails(jwt); 
      } else {
        const errorData = await response.json();
        alert(`Failed to remove course: ${errorData.message || response.status}`);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("A network error occurred while removing the course.");
    }
  };

  const handleCheckout = () => {
   if (!jwt) {
      alert("Please log in to proceed to checkout.");
      return;
    }

    // Redirect to checkout page
    router.push("/checkout");
  };


  // --- Loading and Error States ---

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Shopping Cart" description="Review your selected courses." />
        <section className="py-[60px] pb-[120px] container text-center">
          <p className="text-xl">Loading your cart...</p>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Breadcrumb pageName="Shopping Cart" description="Review your selected courses." />
        <section className="py-[60px] pb-[120px] container text-center">
          <p className="text-xl text-red-600">{error}</p>
        </section>
      </>
    );
  }

  if (!cartDetails || cartDetails.cartItems.length === 0) {
    return (
      <>
        <Breadcrumb pageName="Shopping Cart" description="Review your selected courses." />
        <section className="py-[60px] pb-[120px] container text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-lg text-body-color mb-6">
            Looks like you haven't added any courses yet.
          </p>
          <Link
            href="/learning/student/courses"
            className="rounded-md bg-primary py-3 px-8 text-base font-semibold text-white duration-300 ease-in-out hover:bg-opacity-80"
          >
            Start Browsing Courses
          </Link>
        </section>
      </>
    );
  }


  // --- Main Cart View & Formatting (SIMPLIFIED) ---
  const totalItems = cartDetails.cartItems.length;

  // Use values directly from cartDetails object
  const subtotalDisplay = cartDetails.subtotal.toFixed(2);
  const totalDiscountDisplay = cartDetails.discountAmount.toFixed(2);
  const totalPriceDisplay = cartDetails.totalPrice.toFixed(2);


  return (
    <>
      <Breadcrumb pageName="Shopping Cart" description="Review your selected courses before checkout." />

      <section className="pt-[60px] pb-[120px] lg:pt-[80px] lg:pb-[160px] xl:pt-[100px] xl:pb-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            
            {/* 🛒 Cart Items List (3/4 width) */}
            <div className="w-full px-4 lg:w-3/4">
              <div className="shadow-one rounded-xs p-4 sm:p-8 dark:bg-dark">
                <h2 className="mb-6 text-2xl font-bold text-black dark:text-white border-b pb-4">
                  Courses in Cart ({totalItems})
                </h2>

                {cartDetails.cartItems.map((item) => {
                  
                  // Logic to determine which price to display prominently
                  const originalPrice = item.course.price;
                  const discountedPrice = item.course.discountedPrice;
                  const isDiscounted = discountedPrice !== undefined && discountedPrice < originalPrice;
                  const displayPrice = isDiscounted ? discountedPrice : originalPrice;

                  return (
                    <div key={item.id} className="flex items-center border-b border-body-color/10 py-4 last:border-b-0">
                      
                      {/* Course Image */}
                      <div className="flex-shrink-0 w-20 h-20 relative mr-4">
                        <Image
                          src={item.course.imageUrl || "/images/placeholder-course.jpg"}
                          alt={item.course.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      {/* Course Details */}
                      <div className="flex-grow">
                        <Link href={`/courses/${item.course.id}`} className="text-lg font-semibold text-black dark:text-white hover:text-primary transition duration-300 line-clamp-2">
                          {item.course.title}
                        </Link>
                        <p className="text-body-color text-sm">
                          By {item.course.instructorName}
                        </p>
                      </div>

                      {/* Price and Remove Button */}
                      <div className="flex-shrink-0 text-right ml-4">
                        {/* Strikethrough Original Price if Discounted */}
                        {isDiscounted && (
                          <p className="text-sm text-body-color line-through mb-1">
                            ${originalPrice.toFixed(2)}
                          </p>
                        )}
                        {/* Display Final Price */}
                        <p className="text-xl font-bold text-primary dark:text-white mb-2">
                          ${displayPrice.toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm transition duration-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                <Link 
                    href="/courses" 
                    className="text-primary hover:text-primary-dark mt-4 inline-block font-semibold transition duration-300"
                >
                    ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* 💳 Order Summary (1/4 width) - SIMPLIFIED */}
            <div className="w-full px-4 lg:w-1/4 mt-8 lg:mt-0">
              <div className="sticky top-20 shadow-one rounded-xs p-6 dark:bg-dark">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white border-b pb-3">
                  Order Summary
                </h3>
                
                <div className="flex justify-between py-2">
                  <span className="text-body-color">Subtotal:</span>
                  <span className="font-semibold text-dark dark:text-white">
                    ${subtotalDisplay}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-body-color/10 mb-4">
                  <span className="text-body-color">Discount:</span>
                  <span className={`font-semibold ${cartDetails.discountAmount > 0 ? 'text-green-600' : 'text-body-color'}`}>
                    -${totalDiscountDisplay}
                  </span>
                </div>

                <div className="flex justify-between py-2 pt-4 border-t border-body-color/10">
                  <span className="text-xl font-bold text-black dark:text-white">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    ${totalPriceDisplay}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 rounded-md bg-primary py-3 text-white font-semibold hover:bg-opacity-90 transition duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;