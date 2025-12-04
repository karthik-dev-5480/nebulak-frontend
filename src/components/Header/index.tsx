"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
// NOTE: menuData import is not needed as we are hardcoding the data
import { useAuth } from "../../auth/AuthContext"

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { user, logout } = useAuth();

  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => {
        window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, []);

  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const usePathName = usePathname();

  // 1. Helper Function for Admin Console Visibility
  // Checks if the user is logged in and has a role with level <= 2.
  const canViewAdminConsoles = () => {
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }
    
    // Check if any role has a level of 1 or 2
    return user.roles.some(
      (userRole) => userRole.role && userRole.role.level <= 500
    );
  };

  const canViewSuperAdminConsoles = () => {
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }
    
    // Check if any role has a level of 1 or 2
    return user.roles.some(
      (userRole) => userRole.role && userRole.role.level <= 100
    );
  };


  return (
    <>
      <header
        className={`header top-0 left-0 z-40 flex w-full items-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky fixed z-9999 bg-white/80 backdrop-blur-xs transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-5 lg:py-2" : "py-8"
                } `}
              >
                <Image
                  src="/images/logo/logo-2.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="w-full dark:hidden"
                />
                <Image
                  src="/images/logo/logok.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[250px] rounded border-[.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    
                    {/* START: HARDCODED MENU ITEMS from menuData */}

                    {/* 1. Home */}
                    <li className="group relative">
                      <Link
                        href="/"
                        className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                          usePathName === "/"
                            ? "text-primary dark:text-white"
                            : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                        }`}
                      >
                        Home
                      </Link>
                    </li>

                    {/* 2. About */}
                    <li className="group relative">
                      <Link
                        href="/about"
                        className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                          usePathName === "/about"
                            ? "text-primary dark:text-white"
                            : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                        }`}
                      >
                        About
                      </Link>
                    </li>

                    {/* 3. Blog */}
                    <li className="group relative">
                      <Link
                        href="/blog"
                        className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                          usePathName === "/blog"
                            ? "text-primary dark:text-white"
                            : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                        }`}
                      >
                        Blog
                      </Link>
                    </li>
                    
                    {/* 4. Support (Contact) */}
                    <li className="group relative">
                      <Link
                        href="/contact"
                        className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                          usePathName === "/contact"
                            ? "text-primary dark:text-white"
                            : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                        }`}
                      >
                        Support
                      </Link>
                    </li>

                    {/* 5. Products (With Submenu) - Assigned mobile index 4 */}
                    <li className="group relative">
                      <p
                        onClick={() => handleSubmenu(4)} 
                        className="text-dark group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 dark:text-white/70 dark:group-hover:text-white"
                      >
                        Products
                        <span className="pl-3">
                          <svg width="25" height="24" viewBox="0 0 25 24">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </p>
                      <div
                        className={`submenu dark:bg-dark relative top-full left-0 rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                          openIndex === 4 ? "block" : "hidden" // Index 4 control for mobile
                        }`}
                      >
                        {/* Submenu Items */}
                        <Link
                            href="/learning/student/courses"
                            className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                          >
                            Learning
                          </Link>
                         <Link
                            href="/contact"
                            className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                          >
                            Contact Page
                          </Link>
                          <Link
                            href="/blog"
                            className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                          >
                            Blog Grid Page
                          </Link>
                          <Link
                            href="/blog-sidebar"
                            className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                          >
                            Blog Sidebar Page
                          </Link>
                          <Link
                            href="/blog-details"
                            className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                          >
                            Blog Details Page
                          </Link>
                          <Link
                            href="/signin"
                            className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                          >
                            Sign In Page
                          </Link>
                          <Link
                            href="/signup"
                            className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                          >
                            Sign Up Page
                          </Link>
                          <Link
                            href="/error"
                            className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                          >
                            Error Page
                          </Link>
                      </div>
                    </li>
                    
                    {/* 2. Admin Consoles (Conditional Rendering Applied) */}
                    {canViewAdminConsoles() && (
                      <li className="group relative">
                        <p
                          onClick={() => handleSubmenu(5)} // Changed index to 5 to prevent conflict with 'Products' index 4
                          className="text-dark group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 dark:text-white/70 dark:group-hover:text-white"
                        >
                          Admin Consoles
                          <span className="pl-3">
                            <svg width="25" height="24" viewBox="0 0 25 24">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </p>
                        <div
                          className={`submenu dark:bg-dark relative top-full left-0 rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                            openIndex === 5 ? "block" : "hidden" // Index 5 control for mobile
                          }`}
                        >
                          {/* Submenu Items */}
                          <Link
                              href="/learning/admin/courses"
                              className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                            >
                              Learning Admin
                            </Link>
                          
                            <Link
                              href="/signin"
                              className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                            >
                              Sign In Page
                            </Link>
                            <Link
                              href="/common/signup"
                              className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                            >
                              Sign Up Page
                            </Link>
                            <Link
                              href="/error"
                              className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                            >
                              Error Page
                            </Link>
                        </div>
                      </li>
                    )}
                    {canViewSuperAdminConsoles() && (
                      <li className="group relative">
                        <p
                          onClick={() => handleSubmenu(5)} // Changed index to 5 to prevent conflict with 'Products' index 4
                          className="text-dark group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 dark:text-white/70 dark:group-hover:text-white"
                        >
                          Super Admin Consoles
                          <span className="pl-3">
                            <svg width="25" height="24" viewBox="0 0 25 24">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </p>
                        <div
                          className={`submenu dark:bg-dark relative top-full left-0 rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                            openIndex === 5 ? "block" : "hidden" // Index 5 control for mobile
                          }`}
                        >
                          {/* Submenu Items */}
                          <Link
                              href="/learning/admin/courses"
                              className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                            >
                              Learning Super Admin
                            </Link>
                           <Link
                              href="/learning/admin/users"
                              className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                            >
                              Manage Users
                            </Link>
                            <Link
                              href="/common/role/addrole"
                              className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                            >
                              Manage Roles
                            </Link>
                           
                            <Link
                              href="/error"
                              className="text-dark hover:text-primary block rounded-sm py-2.5 text-sm lg:px-3 dark:text-white/70 dark:hover:text-white"
                            >
                              Error Page
                            </Link>
                        </div>
                      </li>
                    )}
                    
                    {/* END: HARDCODED MENU ITEMS */}

                    {/* START: Mobile Auth Buttons (Always visible in the mobile nav) */}
                    <div className="lg:hidden">
                      <div className="border-t border-body-color/20 dark:border-body-color/20 mt-4 pt-4"> {/* Added separator */}
                        {user ? (
                          <>
                            <Link href="/common/profile" className="text-dark flex py-2 text-base hover:opacity-70 dark:text-white">
                              Profile
                            </Link>
                            <Link href="/common/cart" className="text-dark flex py-2 text-base hover:opacity-70 dark:text-white">
                              Cart
                            </Link>
                            <button onClick={logout} className="text-dark flex w-full py-2 text-base hover:opacity-70 dark:text-white">
                              Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <Link href="/common/signin" className="text-dark flex py-2 text-base hover:opacity-70 dark:text-white">
                              Sign In
                            </Link>
                            <Link href="/common/signup" className="text-dark flex py-2 text-base hover:opacity-70 dark:text-white">
                              Sign Up
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                    {/* END: Mobile Auth Buttons */}
                  </ul>
                </nav>
              </div>
              
              {/* START: Desktop Auth Buttons (Modified for Profile Dropdown) */}
              <div className="flex items-center justify-end pr-16 lg:pr-0">

                {user ? (
                  // LOGGED IN: Profile Icon with Dropdown for Desktop
                  <div
                    className="relative hidden md:block" // Hidden on small screens, shown on md and up
                    onMouseEnter={() => setProfileDropdownOpen(true)}
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    {/* Profile Icon Button */}
                    <button
                      className="text-dark dark:text-white px-3 py-2 text-base font-medium rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150"
                      aria-label="Profile Menu"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`submenu dark:bg-gray-dark absolute right-0 top-full mt-2 w-40 rounded-md bg-white p-2 shadow-lg transition-all duration-300 z-50 ${
                        profileDropdownOpen
                          ? "visible opacity-100"
                          : "invisible opacity-0"
                      }`}
                    >
                      <Link
                        href="/common/profile"
                        className="text-dark hover:text-primary dark:text-white/70 dark:hover:text-white block rounded-md px-3 py-2 text-sm transition-colors duration-150"
                        onClick={() => setProfileDropdownOpen(false)} // Close dropdown on click
                      >
                        Profile
                      </Link>
                      <Link
                        href="/common/cart"
                        className="text-dark hover:text-primary dark:text-white/70 dark:hover:text-white block rounded-md px-3 py-2 text-sm transition-colors duration-150"
                        onClick={() => setProfileDropdownOpen(false)} // Close dropdown on click
                      >
                        Cart
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false); // Close dropdown after logout
                        }}
                        className="text-dark hover:text-primary dark:text-white/70 dark:hover:text-white block w-full text-left rounded-md px-3 py-2 text-sm transition-colors duration-150"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/common/signin"
                      className="ease-in-up shadow-btn hover:shadow-btn-hover bg-primary hover:bg-primary/90 hidden rounded-xs px-8 py-3 text-base font-medium text-white transition duration-300 md:block md:px-9 lg:px-6 xl:px-9"
                    >
                      Login
                    </Link>
                  </>
                )}
                
                <div>
                  <ThemeToggler />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;