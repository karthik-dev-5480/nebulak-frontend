// types/course.ts
export interface Category {
  id: number;
  name: string;
  // Add other category fields if necessary
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructorName: string;
  price: number;
  discountedPrice: number;
  duration: number; // in hours or similar unit
  imageUrl: string;
  category: Category;
 sections: Section[];
}

// types/api-response.ts
export interface CoursesPageResponse {
  content: Course[];
  totalPages: number;
  totalElements: number;
  number: number; // current page number (0-indexed)
  size: number; // page size
  // Add other Page interface fields if necessary
}

export interface Topic {
    id: number;
    topicOrder: number;
    title: string;
    description: string;
    videoUrl: string | null; 
    sectionId: number;
}

export interface Section {
    id: number;
    sectionOrder: number; // Corresponds to the sectionOrder in your API
    title: string;        // Corresponds to the title in your API
    description: string | null;
    topics: Topic[]; 
}