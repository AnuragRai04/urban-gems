// frontend/lib/api.ts
import { Place, Review, AuthUser } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Global error handler for fetch responses to extract the Express error message
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `API request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      // Fallback if response isn't JSON
    }
    throw new Error(errorMessage);
  }
  
  // For DELETE requests or empty responses
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return {} as T;
  }
  
  return res.json();
}

export async function getPlaces(): Promise<Place[]> {
  const res = await fetch(`${API_URL}/api/places`, {
    next: { revalidate: 60, tags: ["places"] },
  });
  return handleResponse<Place[]>(res);
}

export async function getPlace(id: string): Promise<Place> {
  const res = await fetch(`${API_URL}/api/places/${id}`, {
    // Dynamic tag allowing targeted invalidation when a specific place updates
    next: { revalidate: 60, tags: [`place-${id}`] },
  });
  return handleResponse<Place>(res);
}

export async function createPlace(formData: FormData, token: string): Promise<Place> {
  const res = await fetch(`${API_URL}/api/places`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Note: Do NOT set Content-Type to 'multipart/form-data' manually.
      // Fetch automatically sets it along with the proper boundary when body is FormData.
    },
    body: formData,
  });
  return handleResponse<Place>(res);
}

export async function updatePlace(id: string, formData: FormData, token: string): Promise<Place> {
  const res = await fetch(`${API_URL}/api/places/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse<Place>(res);
}

export async function deletePlace(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/places/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<void>(res);
}

export async function createReview(
  placeId: string,
  data: { rating: number; body: string },
  token: string
): Promise<Review> {
  const res = await fetch(`${API_URL}/api/places/${placeId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // Wrapped in { review: data } to match your existing Express joi validation schema
    body: JSON.stringify({ review: data }), 
  });
  return handleResponse<Review>(res);
}

export async function deleteReview(placeId: string, reviewId: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/places/${placeId}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<void>(res);
}

export async function loginUser(
  username: string, 
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<{ token: string; user: AuthUser }>(res);
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse<{ token: string; user: AuthUser }>(res);
}