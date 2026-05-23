"use client";

import { useTransition } from "react";
import { deleteReviewAction } from "../app/actions";

export default function DeleteReviewButton({ placeId, reviewId }: { placeId: string; reviewId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Delete this review?")) {
      startTransition(() => {
        deleteReviewAction(placeId, reviewId);
      });
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50">
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}