"use client";

import { useTransition } from "react";
import { deletePlaceAction } from "../app/actions";

export default function DeletePlaceButton({ placeId }: { placeId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this place? This cannot be undone.")) {
      startTransition(() => {
        deletePlaceAction(placeId);
      });
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className="w-full text-center bg-red-600 text-white py-2 rounded-md hover:bg-red-700 font-medium transition disabled:opacity-50">
      {isPending ? "Deleting..." : "Delete Place"}
    </button>
  );
}