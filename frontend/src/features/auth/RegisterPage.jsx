import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import { Button, Input, Logo } from '../../components/ui';
import { CheckCircle } from 'lucide-react';

const registerSchema = z
  .object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Minimum 6 caractères'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'Prénom requis'),
    lastName: z.string().min(2, 'Nom requis'),
    company: z.string().min(2, "Nom d'entreprise requis"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  
  const onSubmit = async (data) => {
    try {
      setError('');
      const { confirmPassword, ...payload } = data;
      await api.post('/auth/register', payload);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-smoke font-secondary">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-neutral-light text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-primary font-primary mb-2">
            Inscription réussie !
          </h2>
          <p className="text-secondary">Redirection vers la connexion...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-smoke font-secondary py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-3xl shadow-sm border border-neutral-light">
        <div className="flex flex-col items-center">
          <Logo size="xl" />
          <p className="mt-3 text-center text-sm text-secondary font-secondary uppercase tracking-widest">
            Créer un compte gratuitement
          </p>
          <p className="mt-2 text-center text-xs text-success font-bold flex items-center gap-1">
            <CheckCircle size={12} /> 14 jours d'essai gratuit - Sans carte bancaire
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <Input
            id="email"
            type="email"
            label="EMAIL PROFESSIONNEL"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              type="text"
              label="PRÉNOM"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            
            <Input
              id="lastName"
              type="text"
              label="NOM"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
          
          <Input
            id="company"
            type="text"
            label="NOM DE L'ENTREPRISE"
            error={errors.company?.message}
            {...register('company')}
          />
          
          <Input
            id="password"
            type="password"
            label="MOT DE PASSE"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            id="confirmPassword"
            type="password"
            label="CONFIRMER LE MOT DE PASSE"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <Button type="submit" disabled={isSubmitting} className="w-full" variant="primary">
            {isSubmitting ? 'Inscription...' : "S'inscrire gratuitement"}
          </Button>
        </form>
        
        <p className="text-center text-sm text-secondary">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
