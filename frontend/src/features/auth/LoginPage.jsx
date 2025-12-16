import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import api from '../../lib/api';
import { Button, Input, Logo } from '../../components/ui';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data) => {
    try {
      setError('');
      const response = await api.post('/auth/login', data);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-smoke font-secondary">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-3xl shadow-sm border border-neutral-light">
        <div className="flex flex-col items-center">
          <Logo size="xl" />
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Input
            id="email"
            type="email"
            label="EMAIL"
            placeholder="exemple@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            id="password"
            type="password"
            label="MOT DE PASSE"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <Button type="submit" disabled={isSubmitting} className="w-full" variant="primary">
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
        
        <div className="text-center space-y-4">
          <Link
            to="/forgot-password"
            className="block text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Mot de passe oublié ?
          </Link>
          <p className="text-sm text-secondary">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
