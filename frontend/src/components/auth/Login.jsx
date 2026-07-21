import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import API from '../../services/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      const res = await API.post('/auth/login', data);
      localStorage.setItem('access_token', res.data.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      alert('Login successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <input {...register('email')} placeholder="Email" className="w-full p-2 border rounded mb-1" />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}
        
        <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border rounded mb-1" />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}
        
        <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;