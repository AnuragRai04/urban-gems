import Link from "next/link";
import { getCurrentUser } from "../../../lib/auth";
import ReviewForm from "../../../components/ReviewForm";
import { deletePlaceAction, deleteReviewAction } from "../../../app/actions";

// Fetch the single place from our Express API
async function getPlace(id: string) {
  const res = await fetch(`http://127.0.0.1:3000/api/places/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch place");
  return res.json();
}

export default async function PlaceDetails({ params }: { params: { id: string } }) {
  const place = await getPlace(params.id);
  const user = await getCurrentUser();

  // Safely grab the IDs whether your auth system uses .id or ._id
  const userId = user?._id || user?.id;
  const authorId = place.author?._id || place.author;

  // Force both IDs to be Strings so the strict === comparison never fails
  const isOwner = Boolean(userId && authorId && String(userId) === String(authorId));

  // Fallback: We added the '?' to user?.username so TypeScript stops panicking
  const authorName = place.author?.username || (isOwner ? (user?.username || "You") : "Unknown User");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* ========================================== */}
        {/* LEFT COLUMN: PLACE DETAILS & OWNER BUTTONS */}
        {/* ========================================== */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Image Box */}
            <div className="h-96 bg-gray-200 relative">
              {place.images && place.images.length > 0 ? (
                <img
                  src={place.images[0].url}
                  alt={place.title}
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium bg-slate-50">
                  No Image Provided
                </div>
              )}
            </div>

            {/* Content Box */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-extrabold text-gray-900">{place.title}</h1>
                <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1 rounded-full">
                  {place.entryFee === 0 ? "Free" : `₹${place.entryFee}`}
                </span>
              </div>
              
              <p className="text-gray-500 font-medium mb-6 flex items-center gap-2">
                📍 {place.location}
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                {place.description}
              </p>

              <div className="text-sm text-gray-500 border-t pt-4">
                Submitted by <span className="font-bold text-gray-700">{authorName}</span>
              </div>
            </div>

            {/* Owner Controls (Only visible if you created the place) */}
            {isOwner && (
              <div className="px-8 pb-8 flex gap-4">
                <Link 
                  href={`/places/${place._id}/edit`} 
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Edit Gem
                </Link>
                {/* Delete Place Action Wired Up Here */}
                <form action={deletePlaceAction.bind(null, place._id)}>
                  <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition">
                    Delete Gem
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: REVIEWS SYSTEM               */}
        {/* ========================================== */}
        <div className="space-y-8">
          
          {/* Leave a Review Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Leave a Review</h2>
            
            {user ? (
              <ReviewForm placeId={place._id} />
            ) : (
              <div className="bg-slate-50 text-slate-800 p-6 rounded-xl text-center border border-slate-200">
                <p className="font-medium mb-3 text-slate-600">Want to share your thoughts on this spot?</p>
                <Link 
                  href="/login" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-sm"
                >
                  Log in to leave a review
                </Link>
              </div>
            )}
          </div>

          {/* List of Past Reviews */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Past Reviews</h3>
            {place.reviews && place.reviews.length > 0 ? (
              <div className="space-y-4">
                {place.reviews.map((review: any) => {
                  // Check if the current user owns this specific review
                  const isReviewOwner = user && review.author && (user._id === review.author._id || user._id === review.author);
                  
                  return (
                    <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                      <div className="flex items-center gap-1 text-yellow-400 text-lg mb-2 tracking-widest">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </div>
                      <p className="text-gray-700 mb-2">{review.body}</p>
                      <p className="text-xs text-gray-400 font-medium">By {review.author?.username || "Anonymous"}</p>
                      
                      {/* Delete Review Action Wired Up Here */}
                      {isReviewOwner && (
                        <form action={deleteReviewAction.bind(null, place._id, review._id)} className="absolute top-6 right-6">
                          <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 px-3 py-1 rounded-md">
                            Delete
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No reviews yet. Be the first to review this gem!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}