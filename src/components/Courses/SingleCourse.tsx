// SingleCourse.tsx

import { Course } from "@/types/course";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

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
const ENROLLMENT_FETCH_URL = `${API_BASE_URL}/api/user/enrollments`;
const CART_PAGE_URL = "/common/cart";
const COURSE_DETAIL_URL_BASE = "/learning/student/coursedetails?courseId=";

const SingleCourse = ({ course }: { course: Course }) => {
  const { id, title, description, imageUrl, instructorName, price, discountedPrice, category } = course;

  const jwt = useAuthToken();

  const [isCourseEnrolled, setIsCourseEnrolled] = useState(false);
  const [isLoadingEnrollmentStatus, setIsLoadingEnrollmentStatus] = useState(true);

  const [isCourseInCart, setIsCourseInCart] = useState(false);
  const [isLoadingCartStatus, setIsLoadingCartStatus] = useState(true);

  useEffect(() => {
    if (jwt) {
        const fetchEnrollmentStatus = async () => {
            setIsLoadingEnrollmentStatus(true);
            try {
                const response = await fetch(ENROLLMENT_FETCH_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    const foundEnrolled = userData.enrollments.some(
                        (enrollment) => enrollment.course.id === id
                    );
                    setIsCourseEnrolled(foundEnrolled);
                } else {
                    console.error("Failed to fetch enrollment status:", response.status);
                    setIsCourseEnrolled(false);
                }
            } catch (error) {
                console.error("Network error fetching enrollment status:", error);
                setIsCourseEnrolled(false);
            } finally {
                setIsLoadingEnrollmentStatus(false);
            }
        };

        fetchEnrollmentStatus();
    } else {
        setIsLoadingEnrollmentStatus(false);
        setIsCourseEnrolled(false);
    }
}, [jwt, id]);


  useEffect(() => {
    if (jwt) {
      const fetchCartStatus = async () => {
        setIsLoadingCartStatus(true);
        try {
          const response = await fetch(CART_FETCH_URL, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwt}`,
            },
          });

          if (response.ok) {
            const cartData = await response.json();
            const foundInCart = cartData.cartItems.some(
              (item) => item.course.id === id
            );
            setIsCourseInCart(foundInCart);
          } else {
            console.error("Failed to fetch cart status:", response.status);
            setIsCourseInCart(false);
          }
        } catch (error) {
          console.error("Network error fetching cart status:", error);
          setIsCourseInCart(false);
        } finally {
          setIsLoadingCartStatus(false);
        }
      };

      fetchCartStatus();
    } else {
      setIsLoadingCartStatus(false);
      setIsCourseInCart(false);
    }
  }, [jwt, id]); 

  
  const formattedPrice = price != null ? price.toFixed(2) : 'N/A';
  const formattedDiscountedPrice = discountedPrice != null ? discountedPrice.toFixed(2) : null;
  
  const handleAddToCart = async () => {
   
    if (!jwt) {
      alert("You need to be logged in to add courses to your cart.");
      return;
    }

    const cartUrl = `${API_BASE_URL}/cart/addtocart?courseId=${id}`;

    try {
      const response = await fetch(cartUrl, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      });

      if (response.ok) {
        alert(`Course "${title}" added to cart successfully!`);
        setIsCourseInCart(true); 
      } else if (response.status === 401) {
        alert("Authentication failed. Please log in again.");
      } else {
        const contentType = response.headers.get("content-type");
        let errorMessage = 'Unknown error';
        
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
            errorMessage = `Server returned status ${response.status}`;
        }

        alert(`Failed to add course to cart: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("A network error occurred while adding to cart.");
    }
  };

  const renderCartButton = () => {
    if ((isLoadingCartStatus || isLoadingEnrollmentStatus) && jwt) {
      return (
        <button 
          disabled
          className="w-full rounded-md bg-gray-400 py-2 text-white font-semibold cursor-not-allowed"
        >
          Checking Status...
        </button>
      );
    }

    if (isCourseEnrolled) {
      return (
        <Link 
          href={`${COURSE_DETAIL_URL_BASE}${id}`}
          className="w-full text-center rounded-md bg-indigo-600 py-2 text-white font-semibold hover:bg-indigo-700 transition duration-300 block"
        >
          **View Course Details**
        </Link>
      );
    }

    if (isCourseInCart) {
      return (
        <Link 
          href={CART_PAGE_URL}
          className="w-full text-center rounded-md bg-green-600 py-2 text-white font-semibold hover:bg-green-700 transition duration-300 block"
        >
          **Go to Cart**
        </Link>
      );
    }

    return (
      <button 
        onClick={handleAddToCart} 
        className="w-full rounded-md bg-primary py-2 text-white font-semibold hover:bg-opacity-90 transition duration-300"
      >
        Add to Cart
      </button>
    );
  };


  return (
    <>
      <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xs bg-white duration-300 h-full">
        <Link
          href={`/learning/student/coursedetails?courseId=${id}`}
          className="relative block aspect-37/22 w-full"
        >
          <span className="bg-primary absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
            {category.name}
          </span>
          <Image
            src={imageUrl || "/images/placeholder-course.jpg"}
            alt={title}
            fill
            className="object-cover"
          />
        </Link>
        
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3 style={{ minHeight: '4.5rem' }}> 
            <Link
              href={`/learning/student/coursedetails?courseId=${id}`}
              className="hover:text-primary dark:hover:text-primary mb-2 block text-xl font-bold text-black sm:text-2xl dark:text-white line-clamp-2"
            >
              {title}
            </Link>
          </h3>
          <p className="text-body-color mb-4 text-base font-medium line-clamp-2">
            {description}
          </p>
          
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
          
          {renderCartButton()}
        </div>
      </div>
    </>
  );
};

export default SingleCourse;