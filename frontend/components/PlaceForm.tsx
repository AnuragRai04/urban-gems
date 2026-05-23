"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createPlaceAction } from "../app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mt-6">
      {pending ? "Adding Gem..." : "Add Gem"}
    </button>
  );
}

export default function PlaceForm() {
  const [state, formAction] = useFormState(createPlaceAction, { error: null });

  return (
    <form action={formAction} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-5">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-medium border border-red-200">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
        <input type="text" name="place[title]" required placeholder="e.g., Assi Ghat Rooftop" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
          <input type="text" name="place[location]" required placeholder="e.g., Varanasi, UP" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Entry Fee (₹)</label>
          <input type="number" name="place[entryFee]" required min="0" placeholder="0 for free" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
          <select name="place[category]" required className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white">
            <option value="Food">Food</option>
            <option value="Study">Study</option>
            <option value="Views">Views</option>
            <option value="Cafes">Cafes</option>
            <option value="Chill spots">Chill spots</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Best Time to Visit</label>
          <input type="text" name="place[bestTime]" required placeholder="e.g., Evening, 6 PM" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Upload Images</label>
        <input type="file" name="image" multiple accept="image/*" required className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
        <textarea name="place[description]" required rows={4} placeholder="What makes this place special?" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>

      <SubmitButton />
    </form>
  );
}