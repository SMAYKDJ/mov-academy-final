/**
 * Utility to generate WhatsApp messages for students.
 */

export const generateWAMessage = (tipo: 'lembrete' | 'cobrança' | 'boas_vindas' | 'inatividade', nome: string, valor?: string, vencimento?: string) => {
  const saudar = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const templates = {
    lembrete: `Olá, *${nome}*! 👋 ${saudar()}! Passando para lembrar que sua mensalidade na *Moviment Academy* no valor de *R$ ${valor}* vence no dia *${vencimento}*. Se precisar do código PIX, é só pedir aqui! 🏋️‍♂️`,
    cobrança: `Olá, *${nome}*! 👋 ${saudar()}! Vimos aqui que sua mensalidade do dia *${vencimento}* ainda consta em aberto. Tudo bem? Se precisar de ajuda com o pagamento, estamos à disposição! 🚀`,
    boas_vindas: `Seja muito bem-vindo(a), *${nome}*! 🎉 Ficamos felizes em ter você na equipe *Moviment Academy*. Seu plano já está ativo e seu treino já está no app! Vamos pra cima? 💪`,
    inatividade: `Oi, *${nome}*! 👋 Sentimos sua falta essa semana na academia. Está tudo bem? Lembra que a constância é o segredo do resultado! Te esperamos amanhã? 🔥`,
  };

  return templates[tipo];
};

export const getWALink = (phone: string, message: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const finalPhone = cleanPhone.length === 11 ? `55${cleanPhone}` : cleanPhone;
  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
};
