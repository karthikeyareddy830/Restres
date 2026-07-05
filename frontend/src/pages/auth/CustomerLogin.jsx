import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const CustomerLogin = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await login(data.email, data.password);
      
      // Role Verification
      if (response.user.role !== 'customer') {
        logout(); // Clear the incorrectly established session
        setErrorMsg('Unauthorized: Customer access only');
        return;
      }
      
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid credentials or network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-neutral-50">
      {/* Decorative background element for Customer */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

      <Card className="max-w-md w-full p-8 z-10 shadow-xl border-neutral-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Welcome Guest
          </h2>
          <p className="mt-3 text-sm text-neutral-500 font-medium">
            Sign in to book your table at our Restaurant
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{errorMsg}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              error={errors.email?.message}
              placeholder="you@example.com"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </div>
          
          <div className="text-center text-sm pt-2">
            Don't have an account? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">Register here</Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CustomerLogin;
