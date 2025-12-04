"use client";

import Link from "next/link";
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
// Import the Loader icon for the loading state
import { Loader2 } from 'lucide-react'; 

// Custom Loading Overlay Component (Adapted from TopicForm)
const LoadingOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300">
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center w-80">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" /> {/* Changed color to primary for consistency */}
            <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Registering User...</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Please wait while we set up your account.
            </p>
        </div>
    </div>
);


const SignupPage = () => {
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // New state for loading
    const [isLoading, setIsLoading] = useState(false); 

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            const success = await register(firstName, lastName, email, password);
            if (success) alert("Registered in successfully, Please check your mail for account activation!");
            else alert("Registration failed");
        } catch (error) {
            console.error("Registration error:", error);
            alert("An unexpected error occurred during registration.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <>
            {/* Conditional Loading Overlay */}
            {isLoading && <LoadingOverlay />}

            <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
                <div className="container">
                    <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4">
                            <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
                                <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                                    Create your account
                                </h3>
                                <p className="text-body-color mb-11 text-center text-base font-medium">
                                    It’s totally free and super easy
                                </p>

                                <form>
                                    <div className="mb-8">
                                        <label
                                            htmlFor="firstname"
                                            className="text-dark mb-3 block text-sm dark:text-white"
                                        >
                                            {" "}
                                            First Name{" "}
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Enter your first name"
                                            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                                        />
                                    </div>
                                    <div className="mb-8">
                                        <label
                                            htmlFor="lastname"
                                            className="text-dark mb-3 block text-sm dark:text-white"
                                        >
                                            {" "}
                                            Last Name{" "}
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Enter your last name"
                                            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                                        />
                                    </div>
                                    <div className="mb-8">
                                        <label
                                            htmlFor="email"
                                            className="text-dark mb-3 block text-sm dark:text-white"
                                        >
                                            {" "}
                                            Email{" "}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your Email"
                                            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                                        />
                                    </div>
                                    <div className="mb-8">
                                        <label
                                            htmlFor="password"
                                            className="text-dark mb-3 block text-sm dark:text-white"
                                        >
                                            {" "}
                                            Your Password{" "}
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your Password"
                                            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                                        />
                                    </div>
                                    <div className="mb-8 flex">
                                        <label
                                            htmlFor="checkboxLabel"
                                            className="text-body-color flex cursor-pointer text-sm font-medium select-none"
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    id="checkboxLabel"
                                                    className="sr-only"
                                                />
                                                <div className="box border-body-color/20 mt-1 mr-4 flex h-5 w-5 items-center justify-center rounded-sm border dark:border-white/10">
                                                    <span className="opacity-0">
                                                        <svg
                                                            width="11"
                                                            height="8"
                                                            viewBox="0 0 11 8"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                                                fill="#3056D3"
                                                                stroke="#3056D3"
                                                                strokeWidth="0.4"
                                                            />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <span>
                                                By creating account means you agree to the
                                                <a href="#0" className="text-primary hover:underline">
                                                    {" "}
                                                    Terms and Conditions{" "}
                                                </a>
                                                , and our
                                                <a href="#0" className="text-primary hover:underline">
                                                    {" "}
                                                    Privacy Policy{" "}
                                                </a>
                                            </span>
                                        </label>
                                    </div>
                                    <div className="mb-6">
                                        <button
                                            onClick={handleRegister}
                                            disabled={isLoading} // Disable button when loading
                                            className={`shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
                                                </>
                                            ) : (
                                                'Sign up'
                                            )}
                                        </button>
                                    </div>
                                </form>
                                <div className="mb-8 flex items-center justify-center">
                                    <span className="bg-body-color/50 hidden h-[1px] w-full max-w-[60px] sm:block"></span>
                                    <p className="text-body-color w-full px-5 text-center text-base font-medium">
                                        Or, register with your Gmail
                                    </p>
                                    <span className="bg-body-color/50 hidden h-[1px] w-full max-w-[60px] sm:block"></span>
                                </div>
                                <button className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color hover:border-primary hover:bg-primary/5 hover:text-primary dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary mb-6 flex w-full items-center justify-center rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:hover:shadow-none">
                                    <span className="mr-3">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clipPath="url(#clip0_95:967)">
                                                <path
                                                    d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.8328 19.9997 13.266 19.9997 10.2216"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.0005 10.2046 20.0001"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.17322 8.66075 4.38696 8.02225L4.38127 7.88968L1.19282 5.4624L1.08852 5.51101C0.372885 6.90343 0.00012207 8.4408 0.00012207 9.99987C0.00012207 11.5589 0.372885 13.0963 1.08852 14.4887L4.39911 11.9777Z"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.901848 12.7366 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.38775 8.02225C4.79132 6.82005 5.56974 5.77231 6.61327 5.02675C7.6568 4.28118 8.91279 3.87541 10.2042 3.86663Z"
                                                    fill="#EB4335"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_95:967">
                                                    <rect width="20" height="20" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    Sign in with Google
                                </button>



                                <p className="text-body-color text-center text-base font-medium">
                                    Already using Startup?{" "}
                                    <Link href="/common/signin" className="text-primary hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 left-0 z-[-1]">
                    <svg
                        width="1440"
                        height="969"
                        viewBox="0 0 1440 969"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <mask
                            id="mask0_95:1005"
                            style={{ maskType: "alpha" }}
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="1440"
                            height="969"
                        >
                            <rect width="1440" height="969" fill="#090E34" />
                        </mask>
                        <g mask="url(#mask0_95:1005)">
                            <path
                                opacity="0.1"
                                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                                fill="url(#paint0_linear_95:1005)"
                            />
                            <path
                                opacity="0.1"
                                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                                fill="url(#paint1_linear_95:1005)"
                            />
                        </g>
                        <defs>
                            <linearGradient
                                id="paint0_linear_95:1005"
                                x1="1178.4"
                                y1="151.853"
                                x2="780.959"
                                y2="453.581"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#4A6CF7" />
                                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_95:1005"
                                x1="160.5"
                                y1="220"
                                x2="1099.45"
                                y2="1192.04"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#4A6CF7" />
                                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </section>
        </>
    );
};

export default SignupPage;