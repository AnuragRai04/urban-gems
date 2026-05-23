// frontend/app/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { updatePlace } from "../lib/api";
import { revalidatePath } from "next/cache";
import { 
  loginUser, 
  registerUser, 
  createReview, 
  deleteReview, 
  deletePlace 
} from "../lib/api";
import { COOKIE_NAME, getRawToken } from "../lib/auth";
import { FormState } from "../types";

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/places";

  try {
    const { token } = await loginUser(username, password);
    
    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });
  } catch (error: any) {
    return { message: error.message || "Invalid username or password" };
  }

  // redirect() must be called outside the try/catch block
  redirect(redirectTo);
}

export async function registerAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!password || password.length < 8) {
    return { message: "Password must be at least 8 characters long." };
  }

  try {
    const { token } = await registerUser(username, email, password);
    
    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error: any) {
    return { message: error.message || "Failed to register account" };
  }

  redirect("/places");
}

export async function logoutAction() {
  cookies().delete(COOKIE_NAME);
  redirect("/");
}

export async function createReviewAction(
  prevState: any, 
  formData: FormData
): Promise<{ success?: string; error?: string }> {
  const placeId = formData.get("placeId") as string;
  const rating = parseInt(formData.get("rating") as string, 10);
  const body = formData.get("body") as string;

  const token = getRawToken();
  if (!token) {
    return { error: "You must be logged in to leave a review." };
  }

  try {
    await createReview(placeId, { rating, body }, token);
    
    // Force Next.js to instantly update the screen!
    revalidatePath(`/places/${placeId}`); 
    return { success: "Review added!" };
  } catch (error: any) {
    return { error: error.message || "Failed to add review." };
  }
}

export async function deleteReviewAction(placeId: string, reviewId: string) {
  const token = getRawToken();
  if (!token) {
    throw new Error("You must be logged in to delete a review.");
  }

  await deleteReview(placeId, reviewId, token);
  revalidateTag(`place-${placeId}`);
}

export async function deletePlaceAction(placeId: string) {
  const token = getRawToken();
  if (!token) {
    throw new Error("You must be logged in to delete a place.");
  }

  await deletePlace(placeId, token);
  
  // Clear the cache for both the master list and the specific place
  revalidateTag("places");
  revalidateTag(`place-${placeId}`);
  
  redirect("/places");
}

// Add this to the bottom of frontend/app/actions.ts
import { createPlace } from "../lib/api";

export async function createPlaceAction(prevState: any, formData: FormData) {
  const token = getRawToken();
  if (!token) {
    return { error: "You must be logged in to create a place." };
  }

  try {
    // We pass the raw FormData directly to the API wrapper
    await createPlace(formData, token);
    
    // Clear the cache so the new place shows up immediately
    revalidateTag("places");
  } catch (error: any) {
    return { error: error.message || "Failed to create place." };
  }

  // Redirect back to the main list
  redirect("/places");
}



export async function updatePlaceAction(placeId: string, formData: FormData) {
  const token = getRawToken();
  if (!token) {
    throw new Error("You must be logged in."); // Changed to throw
  }

  try {
    await updatePlace(placeId, formData, token);
    revalidateTag("places");
    revalidateTag(`place-${placeId}`);
  } catch (error: any) {
    throw new Error(error.message || "Failed to update place."); // Changed to throw
  }
  
  redirect(`/places/${placeId}`);
}