import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const AdminLogin = () => {
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
      if (response.user.role !== 'admin') {
        logout(); // Clear the incorrectly established session
        setErrorMsg('Unauthorized: Admin access only');
        return;
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid credentials or network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-900">
      <Card className="max-w-md w-full p-8 shadow-2xl border-neutral-700 bg-neutral-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-neutral-700 text-neutral-300 mb-6 border border-neutral-600 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-3 text-sm text-neutral-400 font-medium">
            Authenticate to access management dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errorMsg && (
            <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-4 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-200">{errorMsg}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="admin@example.com"
                className={`w-full px-4 py-2 bg-neutral-900 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-neutral-600 focus:ring-neutral-400'} rounded-lg focus:outline-none focus:ring-2 text-white placeholder-neutral-500 transition-colors`}
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-2 bg-neutral-900 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-neutral-600 focus:ring-neutral-400'} rounded-lg focus:outline-none focus:ring-2 text-white placeholder-neutral-500 transition-colors`}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
