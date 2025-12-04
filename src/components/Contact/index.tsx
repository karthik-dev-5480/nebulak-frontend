"use client";


import React, { useState } from 'react';
import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  // 1. Add State to manage form inputs and submission status
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', or null

  // Handler for input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    // 3. Prevent Default Form Submission
    e.preventDefault();
    setSubmissionStatus('submitting');
    
    // **NOTE**: Replace this with your actual Java API endpoint
    const apiEndpoint = 'http://localhost:5454/public/contact';

    try {
      // 4. Collect and Prepare Data
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the state data as a JSON string
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful submission
        setSubmissionStatus('success');
        // Optionally clear the form
        setFormData({ name: '', email: '', message: '' }); 
      } else {
        // Handle API errors (e.g., 4xx or 5xx status codes)
        console.error('API Error:', response.status, response.statusText);
        setSubmissionStatus('error');
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Network or other submission error:', error);
      setSubmissionStatus('error');
    }
  };

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div
              className="mb-12 rounded-xs bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Need Help? Open a Ticket
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Our support team will get back to you ASAP via email.
              </p>
              
              {/* Submission Status Message */}
              {submissionStatus === 'success' && (
                <p className="mb-4 text-green-600 font-bold">
                  ✅ Ticket submitted successfully! We'll be in touch soon.
                </p>
              )}
              {submissionStatus === 'error' && (
                <p className="mb-4 text-red-600 font-bold">
                  ❌ Submission failed. Please try again later.
                </p>
              )}

              {/* 2. Add onSubmit Handler */}
              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name" // Important for handleChange
                        placeholder="Enter your name"
                        value={formData.name} // Controlled component
                        onChange={handleChange} // Capture input
                        className="border-stroke w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-hidden focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email" // Important for handleChange
                        placeholder="Enter your email"
                        value={formData.email} // Controlled component
                        onChange={handleChange} // Capture input
                        className="border-stroke w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-hidden focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message" // Important for handleChange
                        rows={5}
                        placeholder="Enter your Message"
                        value={formData.message} // Controlled component
                        onChange={handleChange} // Capture input
                        className="border-stroke w-full resize-none rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-hidden focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button 
                      type="submit" // Ensure this is a submit button
                      className="rounded-xs bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                      disabled={submissionStatus === 'submitting'} // Disable button during submission
                    >
                      {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;