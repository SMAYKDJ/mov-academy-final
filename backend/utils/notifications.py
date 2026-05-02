import os
from fpdf import FPDF
from datetime import datetime

def generate_closure_pdf(report_data, operator_name):
    """Gera um PDF formatado com os dados do fechamento de caixa."""
    pdf = FPDF()
    pdf.add_page()
    
    # Header
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(0, 10, "MOVIMENT ACADEMY - RELATORIO DE FECHAMENTO", ln=True, align='C')
    pdf.set_font("Arial", '', 10)
    pdf.cell(0, 10, f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", ln=True, align='C')
    pdf.ln(10)
    
    # Operador
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, f"Operador: {operator_name.upper()}", ln=True)
    pdf.ln(5)
    
    # Financeiro
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, "RESUMO FINANCEIRO", ln=True)
    pdf.set_font("Arial", '', 11)
    pdf.cell(100, 10, "Abertura de Caixa:")
    pdf.cell(0, 10, f"R$ {report_data['opening_balance']:.2f}", ln=True, align='R')
    
    pdf.cell(100, 10, "Total PIX:")
    pdf.cell(0, 10, f"R$ {report_data['totals_by_method']['pix']:.2f}", ln=True, align='R')
    
    pdf.cell(100, 10, "Total Cartao:")
    pdf.cell(0, 10, f"R$ {report_data['totals_by_method']['cartao']:.2f}", ln=True, align='R')
    
    pdf.set_font("Arial", 'B', 11)
    pdf.cell(100, 10, "FECHAMENTO INFORMADO:")
    pdf.cell(0, 10, f"R$ {report_data['closing_balance']:.2f}", ln=True, align='R')
    
    # Saude
    diff = report_data['difference']
    color = (0, 150, 0) if report_data['is_healthy'] else (200, 0, 0)
    pdf.set_text_color(*color)
    pdf.cell(100, 10, "DIFERENCA DE CAIXA:")
    pdf.cell(0, 10, f"R$ {diff:.2f}", ln=True, align='R')
    pdf.set_text_color(0, 0, 0)
    
    # Operacional
    pdf.ln(10)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, "RESUMO OPERACIONAL", ln=True)
    pdf.set_font("Arial", '', 11)
    pdf.cell(100, 10, "Itens Vendidos:")
    pdf.cell(0, 10, f"{report_data['products_sold']} unidades", ln=True, align='R')
    pdf.cell(100, 10, "Total Sangrias:")
    pdf.cell(0, 10, f"R$ {report_data['sangria_total']:.2f}", ln=True, align='R')
    
    # Rodapé
    pdf.ln(20)
    pdf.set_font("Arial", 'I', 8)
    pdf.cell(0, 10, "Relatorio gerado automaticamente pelo ERP Moviment Academy.", align='C')
    
    file_path = f"closure_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    pdf.output(file_path)
    return file_path

def send_closure_notification(report_data, operator_name):
    """
    Simula o envio de notificação via Email/WhatsApp.
    Em um cenário real, usaria bibliotecas como 'resend' ou 'twilio'.
    """
    pdf_path = generate_closure_pdf(report_data, operator_name)
    
    # Simulação de log
    print(f"NOTIFICACAO: Relatorio {pdf_path} enviado para o proprietário.")
    
    # Aqui entraria a lógica do Resend ou WhatsApp API
    # Por segurança, vamos apenas registrar no console e salvar o PDF localmente
    return pdf_path
