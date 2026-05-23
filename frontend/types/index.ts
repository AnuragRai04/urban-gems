// frontend/types/index.ts

export type PlaceCategory = 
  | "Food" 
  | "Study" 
  | "Views" 
  | "Cafes" 
  | "Chill spots";

export interface PlaceImage {
  _id?: string; // MongoDB auto-generates this for subdocuments
  url: string;
  filename: string;
  thumbnail?: string; // From the virtual property in your Express schema
}

// Represents the authenticated user extracted from the JWT
export interface AuthUser {
  _id: string;
  email: string;
  username: string;
}

// Represents the populated user data attached to Places and Reviews
export interface Author {
  _id: string;
  email: string;
  username: string;
}

export interface Review {
  _id: string;
  body: string;
  rating: number;
  author: Author; // Fully populated interface, not just ObjectId
}

export interface PlaceGeometry {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Place {
  _id: string;
  title: string;
  images: PlaceImage[];
  entryFee: number;
  category: PlaceCategory;
  bestTime: string;
  description: string;
  location: string;
  geometry: PlaceGeometry;
  author: Author; // Fully populated interface
  reviews: Review[]; // Fully populated array of Review interfaces
}

// Standard structure for Next.js 14 Server Action responses (e.g., using useFormState)
export interface FormState {
  message?: string | null;
  errors?: Record<string, string[]>;
  success?: boolean;
}