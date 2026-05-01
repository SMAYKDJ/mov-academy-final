/**
 * Utilitário para gerar mensagens e links do WhatsApp para os alunos.
 */

export function formatPhoneForWhatsApp(phone: string): string {
  // Remover todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Se for um número típico do Brasil (10 ou 11 dígitos) sem código de país, adicionar 55
  if (cleaned.length === 10 || cleaned.length === 11) {
    return `55${cleaned}`;
  }
  
  return cleaned;
}

export type WAMessageType = 'lembrete' | 'cobranca' | 'boas_vindas' | 'inatividade' | 'custom' | 'pagamento_confirmado' | 'aviso_gestor';

export const generateWAMessage = (tipo: WAMessageType, nome: string, valor?: string | number, vencimento?: string) => {
  const saudar = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formattedValor = typeof valor === 'number' ? valor.toFixed(2).replace('.', ',') : valor;

  const templates = {
    lembrete: `Olá, *${nome}*! 👋 ${saudar()}! Passando para lembrar que sua mensalidade na *Moviment Academy* no valor de *R$ ${formattedValor}* vence no dia *${vencimento}*. Se precisar do código PIX, é só pedir aqui! 🏋️‍♂️`,
    cobranca: `Olá, *${nome}*! 👋 ${saudar()}! Vimos aqui que sua mensalidade do dia *${vencimento}* ainda consta em aberto. Tudo bem? Se precisar de ajuda com o pagamento, estamos à disposição! 🚀`,
    boas_vindas: `Seja muito bem-vindo(a), *${nome}*! 🎉 Ficamos felizes em ter você na equipe *Moviment Academy*. Seu plano já está ativo e seu treino já está no app! Vamos pra cima? 💪`,
    inatividade: `Oi, *${nome}*! 👋 Sentimos sua falta essa semana na academia. Está tudo bem? Lembra que a constância é o segredo do resultado! Te esperamos amanhã? 🔥`,
    pagamento_confirmado: `Olá, *${nome}*! 👋 ${saudar()}! Recebemos seu pagamento no valor de *R$ ${formattedValor}*. Sua mensalidade já está em dia! Obrigado por treinar conosco na *Moviment Academy*! 🏋️‍♂️💪`,
    aviso_gestor: `🚨 *NOVA RECEITA!* 💸\nO aluno *${nome}* acaba de realizar o pagamento de *R$ ${formattedValor}*. O sistema já atualizou o status para pago! ✅`,
    custom: `Olá, *${nome}*! 👋 ${saudar()}!`,
  };

  return templates[tipo] || templates.custom;
};

export const getWALink = (phone: string, message: string) => {
  const finalPhone = formatPhoneForWhatsApp(phone);
  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
};

export const openWhatsApp = (phone: string, message?: string) => {
  const url = message ? getWALink(phone, message) : `https://wa.me/${formatPhoneForWhatsApp(phone)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Envia uma notificação para o gestor da academia.
 * Em um aplicativo real, este telefone viria das configurações do sistema.
 */
export const notifyManager = (nomeAluno: string, valor: number | string) => {
  const MANAGER_PHONE = '5591983457028'; // Telefone real do gestor
  const msg = generateWAMessage('aviso_gestor', nomeAluno, valor);
  openWhatsApp(MANAGER_PHONE, msg);
};
