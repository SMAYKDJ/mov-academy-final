'use client';

import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';

interface StripePaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripePayment({ amount, onSuccess, onCancel }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Certifique-se de mudar isso para sua página de conclusão de pagamento
        return_url: `${window.location.origin}/financeiro/pagamento/sucesso`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Ocorreu um erro na validação.");
    } else {
      setMessage("Ocorreu um erro inesperado.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-[#0f1117] p-6 rounded-2xl border border-gray-100 dark:border-[#1e2235] shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-50 dark:border-gray-800/50">
          <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Pagamento Seguro</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Processado via Stripe</p>
          </div>
          <div className="ml-auto text-right">
            <span className="text-xs text-gray-400 dark:text-gray-500 block">Total a pagar</span>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount / 100)}
            </span>
          </div>
        </div>

        <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

        {message && (
          <div id="payment-message" className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium animate-shake">
            {message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Confirmar Pagamento
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Cancelar e Voltar
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
        <ShieldCheck className="w-3 h-3" />
        Ambiente Seguro e Criptografado
      </div>
    </form>
  );
}
