// components/Admin/SectionForm.tsx

"use client";

import React, { useState } from "react";
import { Plus } from 'lucide-react'; 

interface SectionFormProps {
    courseId: number;
    onSectionAdded: () => void;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SectionForm = ({ courseId, onSectionAdded }: SectionFormProps) => {
    const [sectionData, setSectionData] = useState({
        sectionNumber: 1, // Start with 1 as a default (maps to sectionOrder)
        name: '', // maps to title
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSectionData(prev => ({
            ...prev,
            [name]: name === 'sectionNumber' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const payload = {
            title: sectionData.name, // maps name to title
            sectionOrder: sectionData.sectionNumber, // maps sectionNumber to sectionOrder
            description: sectionData.description,
        };

        console.log("Submitting Section:", payload);
         try {
            const response = await fetch(`${API_BASE_URL}/courses/addsection/${courseId}`, {
               method: 'POST',
             headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Use the fixed payload
           });
          if (response.ok) {
              alert("Section added successfully!");
                onSectionAdded();
                // Increment number and clear other fields
                setSectionData({ sectionNumber: sectionData.sectionNumber + 1, name: '', description: '' });
             } else {
                 const errorText = await response.text();
                 throw new Error(`Failed to add section: ${response.status} - ${errorText}`);
             }
         } catch (error) {
            console.error("Error adding section:", error);
             alert("Error adding section: " + (error as Error).message);
         } finally {
            setIsLoading(false);
         }

    };

    return (
        <div className="p-6 bg-white dark:bg-dark shadow-one rounded-lg mb-8">
            <h4 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center">
                <Plus className="mr-2 h-5 w-5 text-primary" /> Add New Section
            </h4>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-body-color mb-1">Section Number </label>
                    <input
                        type="number"
                        name="sectionNumber"
                        value={sectionData.sectionNumber}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-stroke dark:border-dark-3 py-2 px-3 text-dark dark:text-white focus:border-primary focus:outline-none"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-body-color mb-1">Section Name</label>
                    <input
                        type="text"
                        name="name"
                        value={sectionData.name}
                        onChange={handleChange}
                        placeholder="e.g., Introduction to React"
                        required
                        className="w-full rounded-md border border-stroke dark:border-dark-3 py-2 px-3 text-dark dark:text-white focus:border-primary focus:outline-none"
                    />
                </div>
                <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-body-color mb-1">Description</label>
                    <textarea
                        name="description"
                        value={sectionData.description}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Brief overview of the section content."
                        required
                        className="w-full rounded-md border border-stroke dark:border-dark-3 py-2 px-3 text-dark dark:text-white focus:border-primary focus:outline-none"
                    ></textarea>
                </div>
                <div className="md:col-span-3 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-md bg-primary py-2 px-6 text-white font-bold hover:bg-opacity-90 transition duration-300 disabled:bg-opacity-60"
                    >
                        {isLoading ? 'Adding...' : 'Add Section'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SectionForm;