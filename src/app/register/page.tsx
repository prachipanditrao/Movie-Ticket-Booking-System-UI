import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <RegisterForm />
    </div>
  );
}
