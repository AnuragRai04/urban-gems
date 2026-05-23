import Link from "next/link";
import Image from "next/image";
import { getPlaces } from "../../lib/api";
import { getCurrentUser } from "../../lib/auth";
import ClusterMap from "../../components/ClusterMap"; // <-- Importing the new Map!

export const dynamic = "force-dynamic";

const CATEGORIES = ["Food", "Study", "Views", "Cafes", "Chill spots"];

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [allPlaces, user] = await Promise.all([getPlaces(), getCurrentUser()]);

  // Filter places based on the clicked category
  const places = searchParams.category
    ? allPlaces.filter((p: any) => p.category === searchParams.category)
    : allPlaces;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 🗺️ THE REAL CLUSTER MAP */}
      <div className="w-full h-[400px] mb-12 shadow-lg border border-slate-200 rounded-xl overflow-hidden">
        {/* We pass the filtered places to the map so the pins update when you click a category! */}
        <ClusterMap places={places} />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-playfair">
          {searchParams.category ? `${searchParams.category} Spots` : "All Places"}
        </h1>
        <Link href="/places/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add Place
        </Link>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        <Link 
          href="/places" 
          className={`px-4 py-1.5 rounded-full text-sm border whitespace-nowrap ${!searchParams.category ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/places?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-1.5 rounded-full text-sm border whitespace-nowrap ${searchParams.category === cat ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* PLACES GRID */}
      {places.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No places found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place: any) => {
            const avgRating = place.reviews?.length
              ? (place.reviews.reduce((acc: any, r: any) => acc + r.rating, 0) / place.reviews.length).toFixed(1)
              : "New";

            return (
              <Link key={place._id} href={`/places/${place._id}`} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
                <div className="relative h-48 w-full bg-gray-100">
                  {place.images?.[0] ? (
                    <Image src={place.images[0].url} alt={place.title} fill className="object-cover group-hover:scale-105 transition duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold shadow-sm">
                    {place.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{place.title}</h2>
                    <span className="flex items-center text-sm font-medium text-yellow-600">
                      ⭐ {avgRating}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-1">📍 {place.location}</p>
                  <div className="text-sm font-medium text-gray-900 border-t pt-3">
                    {place.entryFee === 0 ? "Free Entry" : `₹${place.entryFee}`}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}