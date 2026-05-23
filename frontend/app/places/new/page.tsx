// frontend/app/places/new/page.tsx
import PlaceForm from "../../../components/PlaceForm";

export default function NewPlacePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold font-playfair mb-2 text-gray-900 text-center">Add a New Gem</h1>
      <p className="text-gray-500 text-center mb-8">Share your favorite local spot with the community.</p>
      
      <PlaceForm />
    </div>
  );
}