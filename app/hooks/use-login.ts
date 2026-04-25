import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useLogin = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<{ email?: string; password?: string }>({});

  const resolveEmailFromPhone = async (phone: string): Promise<string> => {
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      throw new Error('Informe um telefone com DDD ou um e‑mail válido.');
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .like('telefone', `%${phoneDigits}%`)
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Nenhuma conta encontrada com este número de telefone.');
    return data[0].email;
  };

  const login = async (loginId: string, password: string) => {
    setLoading(true);
    setFieldError({});
    try {
      let finalEmail = loginId.trim();
      if (!finalEmail.includes('@')) {
        finalEmail = await resolveEmailFromPhone(finalEmail);
      }
      const { error, data } = await supabase.auth.signInWithPassword({ email: finalEmail, password });
      if (error) throw error;
      if (data?.user) {
        showToast('Login realizado com sucesso!', 'success');
        router.push('/');
      }
    } catch (err: any) {
      const msg = err?.message ?? 'Falha ao realizar login.';
      showToast(msg, 'error');
      if (msg.toLowerCase().includes('email')) setFieldError({ email: msg });
      if (msg.toLowerCase().includes('senha') || msg.toLowerCase().includes('password'))
        setFieldError({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, fieldError };
};
