import LoginForm from "../../components/LoginForm";

export default function LoginPage({ searchParams }: { searchParams: { from?: string } }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold font-playfair mb-6 text-center">Welcome Back</h1>
        <LoginForm redirectTo={searchParams.from ?? "/places"} />
      </div>
    </div>
  );
}