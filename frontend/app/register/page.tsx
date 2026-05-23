import RegisterForm from "../../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold font-playfair mb-6 text-center">Join UrbanGems</h1>
        <RegisterForm />
      </div>
    </div>
  );
}