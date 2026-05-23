import Link from "next/link";

const CATEGORIES = ["Food", "Study", "Views", "Cafes", "Chill spots"];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <section className="text-center max-w-3xl mb-16">
        <h1 className="text-5xl md:text-7xl font-bold font-playfair mb-6 text-gray-900">
          Discover your city's hidden gems.
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Find the best local spots for studying, eating, and chilling. Reviewed by locals, curated for you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/places" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition w-full sm:w-auto">
            Explore places
          </Link>
          <Link href="/places/new" className="bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition w-full sm:w-auto">
            Add a gem
          </Link>
        </div>
      </section>

      <section className="w-full max-w-4xl border-t border-gray-200 pt-10">
        <h2 className="text-sm uppercase tracking-widest text-gray-500 font-semibold text-center mb-6">Browse by Category</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {CATEGORIES.map((category) => (
            <Link 
              key={category} 
              href={`/places?category=${encodeURIComponent(category)}`}
              className="px-6 py-2 bg-white border border-gray-200 rounded-full hover:border-blue-500 hover:text-blue-600 transition shadow-sm"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}