"use client";

import { useTransition } from "react";
import { logoutAction } from "../app/actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => startTransition(() => logoutAction())} 
      disabled={isPending}
      className="text-gray-600 hover:text-red-600 font-medium transition text-sm disabled:opacity-50"
    >
      {isPending ? "..." : "Logout"}
    </button>
  );
}