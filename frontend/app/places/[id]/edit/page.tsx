import Link from "next/link";
// Notice the extra ../ added to these paths because we are one folder deeper!
import { updatePlaceAction } from "../../../actions"; 

export default async function EditPlacePage({ params }: { params: { id: string } }) {
  // 1. Fetch the existing place data to prepopulate the form
  const res = await fetch(`http://127.0.0.1:3000/api/places/${params.id}`, { cache: "no-store" });
  const place = await res.json();

  // 2. Bind the place ID to the server action
  const updateActionWithId = updatePlaceAction.bind(null, place._id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Edit {place.title}</h1>
      
      <form action={updateActionWithId} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
          <input type="text" name="place[title]" defaultValue={place.title} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
          <input type="text" name="place[location]" defaultValue={place.location} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* UPDATED GRID: Now 3 columns to fit the missing bestTime field! */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Entry Fee (₹)</label>
            <input type="number" name="place[entryFee]" defaultValue={place.entryFee} min="0" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          
          {/* THE MISSING FIELD */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Best Time to Visit</label>
            <input type="text" name="place[bestTime]" defaultValue={place.bestTime} placeholder="e.g. Evening, Oct-March" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select name="place[category]" defaultValue={place.category} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="Food">Food</option>
              <option value="Study">Study</option>
              <option value="Views">Views</option>
              <option value="Cafes">Cafes</option>
              <option value="Chill spots">Chill spots</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
          <textarea name="place[description]" defaultValue={place.description} rows={5} required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition shadow-sm">
            Update Gem
          </button>
          <Link href={`/places/${place._id}`} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition text-center shadow-sm">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}