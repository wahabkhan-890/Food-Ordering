import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import API from '../../services/api';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password
      };

      const res = await API.post('/auth/register', payload);
      alert(res.data?.message || 'Registration successful');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input {...register('name')} placeholder="Name" className="w-full p-2 border rounded mb-1" />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>}

        <input {...register('email')} placeholder="Email" className="w-full p-2 border rounded mb-1" />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

        <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border rounded mb-1" />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

        <input {...register('confirmPassword')} type="password" placeholder="Confirm Password" className="w-full p-2 border rounded mb-1" />
        {errors.confirmPassword && <p className="text-red-500 text-sm mb-2">{errors.confirmPassword.message}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;