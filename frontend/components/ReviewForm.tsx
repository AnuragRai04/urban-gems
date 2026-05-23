"use client";

import { useState } from "react";
import { useFormState } from "react-dom"; // <-- Required for your action signature
import { createReviewAction } from "../app/actions";

export default function ReviewForm({ placeId }: { placeId: string }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  
  // Hook up YOUR custom server action
  const [state, formAction] = useFormState(createReviewAction, {});

  return (
    <form action={formAction} className="space-y-4">
      {/* Hidden inputs to pass data seamlessly to your action */}
      <input type="hidden" name="placeId" value={placeId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`text-4xl transition-colors ${
                star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Review</label>
        <textarea
          name="body"
          required
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="What did you think of this spot?"
        ></textarea>
      </div>
      
      {/* Show beautiful error or success messages from your action! */}
      {state?.error && <p className="text-red-500 text-sm font-bold">{state.error}</p>}
      {state?.success && <p className="text-green-600 text-sm font-bold">{state.success}</p>}

      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg w-full transition shadow-sm">
        Submit Review
      </button>
    </form>
  );
}