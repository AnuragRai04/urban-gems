"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "../app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mt-4">
      {pending ? "Logging in..." : "Log In"}
    </button>
  );
}

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      
      {state?.message && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          {state.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input type="text" name="username" required className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" name="password" required className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <SubmitButton />
    </form>
  );
}