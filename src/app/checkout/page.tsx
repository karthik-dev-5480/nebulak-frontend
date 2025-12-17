"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { isNull } from "util";

declare const Razorpay: any; 

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
const BASE_CART_FETCH_URL = `${API_BASE_URL}/cart/user/checkout`; 
const RAZORPAY_KEY_ID = "rzp_test_RaByK8gDEWOIqc"; 

interface CartDetails {
  user: any; 
  cartTotal: number;
  checkoutPrice:number;
  taxGst: number; 
  couponAmount: number;
  couponCodeApplied: string | null;
}

const loadRazorpayScript = () => {
  return new Promise<void>((resolve) => {
    if (document.querySelector(`script[src="https://checkout.razorpay.com/v1/checkout.js"]`)) {
        return resolve();
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => {
      console.error("Failed to load Razorpay script.");
      resolve(); 
    };
    document.body.appendChild(script);
  });
};


const Checkout = () => {
  const jwt = useAuthToken();
  const [cartDetails, setCartDetails] = useState<CartDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | null>('razorpay'); 

  const [couponInput, setCouponInput] = useState<string>('');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'applying' | 'applied' | 'error'>('idle');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const fetchCartDetails = async (token: string, couponCode: string | null = null) => {
    setLoading(true);
    setError(null);

    let cartFetchUrl = BASE_CART_FETCH_URL;
    if (couponCode) {
        cartFetchUrl += `?couponCode=${couponCode}`;
    }

    try {
      const response = await fetch(cartFetchUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: CartDetails = await response.json();
        setCartDetails(data);
        
        if (data.couponCodeApplied) {
            setCouponStatus('applied');
            setCouponInput(data.couponCodeApplied);
            setCouponMessage(null); 
        } else {
            setCouponStatus('idle');
            if (!couponCode) setCouponInput('');
            setCouponMessage(null);
        }

      } else if (response.status === 404) {
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
    loadRazorpayScript(); 

    if (jwt) {
      fetchCartDetails(jwt); 
    } else {
      setLoading(false);
      setError("Please log in to complete your checkout.");
    }
  }, [jwt]);
  
  const cartTotal = cartDetails?.cartTotal|| 0;
  const taxAmount = cartDetails?.taxGst || 0; 
  const finalTotal = cartDetails?.checkoutPrice || 0; 
  const couponAmount = cartDetails?.couponAmount || 0; 

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jwt || !couponInput.trim()) return;

    setCouponStatus('applying');
    setCouponMessage(null);

    try {
        const response = await fetch(BASE_CART_FETCH_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ couponCode: couponInput.trim() }),
        });

        if (response.ok) {
            await fetchCartDetails(jwt, couponInput.trim()); 
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Invalid or expired coupon.");
        }
    } catch (err) {
        setCouponStatus('error');
        setCouponMessage((err as Error).message || "Failed to apply coupon.");
        console.error("Coupon application error:", err);
        fetchCartDetails(jwt); 
    }
  };

  const handleRazorpayPayment = async () => {
    if (!jwt || !cartDetails || isProcessing || selectedPaymentMethod !== 'razorpay') {
        alert("Cannot process payment. Please ensure you are logged in and have items in your cart.");
        return;
    }
    
    setIsProcessing(true);

    const amountInPaise = Math.round(finalTotal * 100); 
    
    if (cartDetails.couponCodeApplied){
      const appliedCouponCode=null;
    }
    
    let orderId;
    try {
        const orderUrl = `${API_BASE_URL}/api/payments/createorder`; 
        const orderResponse = await fetch(orderUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                couponCode: cartDetails.couponCodeApplied || null 
            }) 
        });

        if (!orderResponse.ok) {
            const errorText = await orderResponse.text();
            throw new Error(`Failed to create Razorpay Order. Status: ${orderResponse.status}. Response: ${errorText}`);
        }
        
        const orderData = await orderResponse.json();
        orderId = orderData.id; 

        if (!orderId) throw new Error("Backend did not return a valid order ID.");

    } catch (error) {
        setIsProcessing(false);
        console.error("Error creating Razorpay Order:", error);
        alert(`Error creating order: ${(error as Error).message}`);
        return;
    }

    
    const options = {
        key: RAZORPAY_KEY_ID, 
        amount: amountInPaise, 
        currency: 'INR', 
        name: 'E-Learning Platform',
        description: `Enrollment for courses`, 
        order_id: orderId, 
        handler: async function (response: any) {
     
            const verifyUrl = `${API_BASE_URL}/api/payments/verify`; 
            
            try {
                const verifyResponse = await fetch(verifyUrl, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(response) 
                });

                if (verifyResponse.ok) {
                    alert("Payment successful! You've been enrolled in your courses.");
                    fetchCartDetails(jwt); 
                    setCouponInput('');
                } else {
                    const errorText = await verifyResponse.text();
                    alert(`Payment verification failed. Please contact support. Error: ${errorText}`);
                }
            } catch (err) {
                console.error("Error verifying payment:", err);
                alert("A network error occurred during payment verification.");
            }
            setIsProcessing(false);
        },
        prefill: {
            name: cartDetails?.user?.name || "", 
            email: cartDetails?.user?.email || "",
        },
        modal: {
            ondismiss: () => {
                setIsProcessing(false);
                console.log('Payment modal closed by user.');
            },
        },
    };

    try {
        const rzp1 = new Razorpay(options);
        rzp1.open(); 
    } catch (error) {
        console.error("Razorpay initialization failed:", error);
        setIsProcessing(false);
        alert("Could not initialize payment gateway. Please try again.");
    }
  };

  if (loading) {
    return (
        <section className="pt-[100px] pb-[100px] text-center">
            <div className="container">
                <p className="text-xl font-medium text-primary">Loading cart details...</p>
            </div>
        </section>
    );
  }

  if (error) {
    return (
        <section className="pt-[100px] pb-[100px] text-center">
            <div className="container">
                <p className="text-xl font-medium text-red-500">{error}</p>
                <Link href="/login" className="mt-4 inline-block text-primary underline">Go to Login</Link>
            </div>
        </section>
    );
  }
  
  

  return (
    <>
      <Breadcrumb pageName="Checkout" description="Complete your purchase securely." />

      <section className="pt-[60px] pb-[120px] lg:pt-[80px] lg:pb-[160px] xl:pt-[100px] xl:pb-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap lg:justify-center">
            
            <div className="w-full px-4 lg:w-2/3">
                <div className="shadow-one rounded-xs p-4 sm:p-8 mb-8 dark:bg-dark">
                    <h2 className="mb-6 text-2xl font-bold text-black dark:text-white border-b pb-4">
                        Coupon Code
                    </h2>
                    
                    <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponInput}
                            onChange={(e) => {
                                setCouponInput(e.target.value);
                                setCouponStatus('idle'); 
                                setCouponMessage(null);
                            }}
                            className="w-full rounded-md border border-stroke dark:border-dark-3 bg-transparent py-3 px-5 text-base text-body-color outline-none focus:border-primary transition duration-300"
                            disabled={cartDetails?.couponCodeApplied ? true : couponStatus === 'applying'}
                        />
                        <button
                            type="submit"
                            disabled={!couponInput.trim() || couponStatus === 'applying' || !!cartDetails?.couponCodeApplied}
                            className="flex-shrink-0 rounded-md bg-primary py-3 px-6 text-white font-semibold transition duration-300 ease-in-out hover:bg-opacity-90 disabled:bg-opacity-60 disabled:cursor-not-allowed"
                        >
                            {couponStatus === 'applying' ? 'Applying...' : 'Apply'}
                        </button>
                    </form>

                    {/* CORRECTED SUCCESS LABEL CONDITION */}
                    {(cartDetails?.couponCodeApplied || couponStatus === 'applied') && (
                        <div className="mt-3 flex items-center space-x-2">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                COUPON APPLIED
                            </span>
                            <p className="text-sm text-green-600">
                                **'{cartDetails?.couponCodeApplied || couponInput}'** is active, saving you **₹{couponAmount.toFixed(2)}**.
                            </p>
                            <button
                                onClick={() => {
                                    setCouponInput('');
                                    setCouponMessage(null);
                                    setCouponStatus('idle'); // Ensure status is explicitly reset
                                    fetchCartDetails(jwt); 
                                }}
                                className="text-primary text-sm underline hover:text-primary-dark whitespace-nowrap"
                            >
                                (Remove)
                            </button>
                        </div>
                    )}

                    {/* ERROR MESSAGE (Only shows if status is 'error') */}
                    {couponMessage && couponStatus === 'error' && (
                        <p className={`mt-3 text-sm text-red-500`}>
                            {couponMessage}
                        </p>
                    )}
                </div>

              <div className="shadow-one rounded-xs p-4 sm:p-8 dark:bg-dark">
                <h2 className="mb-6 text-2xl font-bold text-black dark:text-white border-b pb-4">
                  Select Payment Method
                </h2>

                <div className="space-y-4">
                    <label className="flex items-center p-4 border border-stroke rounded-md cursor-pointer dark:border-dark-3 transition duration-300 hover:border-primary dark:hover:border-primary">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="razorpay"
                            checked={selectedPaymentMethod === 'razorpay'}
                            onChange={() => setSelectedPaymentMethod('razorpay')}
                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-3 text-lg font-semibold text-black dark:text-white flex items-center">
                            Razorpay 
                            <span className="ml-2 text-sm text-body-color">(Pay via UPI, Cards, Netbanking)</span>
                        </span>
                    </label>
                </div>
                
                <button
                    onClick={handleRazorpayPayment}
                    disabled={isProcessing || !selectedPaymentMethod || finalTotal <= 0}
                    className="w-full mt-8 rounded-md bg-primary py-3 text-white font-semibold transition duration-300 ease-in-out hover:bg-opacity-90 disabled:bg-opacity-60 disabled:cursor-not-allowed"
                >
                    {isProcessing ? 'Initializing Payment...' : `Pay Now ₹${finalTotal.toFixed(2)}`}
                </button>
                <p className="text-center text-sm text-body-color mt-3">
                    Your payment is processed securely via the Razorpay gateway.
                </p>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/3 mt-8 lg:mt-0">
              <div className="sticky top-20 shadow-one rounded-xs p-6 dark:bg-dark">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white border-b pb-3">
                  Final Order Summary
                </h3>
                
                <p className="text-lg font-medium text-dark dark:text-white mb-4">
                  Items: <span className="text-primary font-bold">0</span> Courses
                </p>

                <div className="space-y-3">
                    <div className="flex justify-between">
                    <span className="text-body-color">Courses checkoutPrice:</span>
                    <span className="font-semibold text-dark dark:text-white">₹{cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                    <span className="text-body-color">Discount ({cartDetails?.couponCodeApplied || 'N/A'}):</span>
                    <span className="font-semibold text-green-600">-₹{couponAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                    <span className="text-body-color">Tax (0%):</span>
                    <span className="font-semibold text-dark dark:text-white">₹{taxAmount.toFixed(2)}</span>
                    </div>

                    
                    
                </div>

                <div className="flex justify-between py-4 mt-4 border-t border-body-color/20">
                  <span className="text-xl font-bold text-black dark:text-white">Grand Total:</span>
                  <span className="text-2xl font-bold text-primary">₹{finalTotal.toFixed(2)}</span>
                </div>

                <Link
                    href="/cart"
                    className="mt-4 inline-block text-primary hover:text-primary-dark transition duration-300"
                >
                    &larr; Return to Cart
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;