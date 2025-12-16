import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Button, Input, Logo } from '../../components/ui';
import { Mail, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });
  
  const onSubmit = async (data) => {
    try {
      setError('');
      await api.post('/auth/forgot-password', data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-smoke font-secondary">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-sm border border-neutral-light text-center">
          <div className="flex justify-center mb-4">
            <Mail size={64} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary font-primary mb-2">
            Email envoyé !
          </h2>
          <p className="text-secondary font-secondary mb-6">
            Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
          </p>
          <Link
            to="/login"
            className="text-primary hover:text-primary-dark font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} /> Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-smoke font-secondary">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-3xl shadow-sm border border-neutral-light">
        <div className="flex flex-col items-center">
          <Logo size="xl" />
          <h1 className="mt-6 text-2xl font-bold text-center text-primary font-primary">
            Mot de passe oublié
          </h1>
          <p className="mt-2 text-center text-sm text-secondary font-secondary">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Input
            id="email"
            type="email"
            label="EMAIL"
            error={errors.email?.message}
            {...register('email')}
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <Button type="submit" disabled={isSubmitting} className="w-full" variant="primary">
            {isSubmitting ? 'Envoi...' : 'Envoyer le lien'}
          </Button>
        </form>
        
        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2 font-secondary"
          >
            <ArrowLeft size={16} /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
