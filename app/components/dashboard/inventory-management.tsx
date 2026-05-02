'use client';

import React, { useState, useEffect } from 'react';
import { Package, Truck, Plus, ArrowUpCircle, ArrowDownCircle, AlertTriangle, Search, Filter, MoreVertical, FileText, ShoppingCart, Receipt } from 'lucide-react';
import { cn } from "@/utils/cn";
import { useToast } from "@/components/ui/toast";

const mockProducts = [
  { id: '1', name: 'Detergente Multiuso 5L', category: 'Limpeza', stock: 12, min_stock: 5, price: 45.00, supplier: 'Brilho Total' },
  { id: '2', name: 'Papel Toalha (Fardo)', category: 'Higiene', stock: 3, min_stock: 10, price: 120.00, supplier: 'Distribuidora Central' },
  { id: '3', name: 'Cabo de Aço Revestido', category: 'Manutenção', stock: 15, min_stock: 5, price: 85.00, supplier: 'Metalúrgica Silva' },
  { id: '4', name: 'Álcool em Gel 70% 1L', category: 'Limpeza', stock: 25, min_stock: 10, price: 18.00, supplier: 'Química Norte' },
];

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'produtos' | 'compras'>('produtos');
  const { showToast } = useToast();

  const mockPurchases = [
    { id: 'OC-001', supplier: 'Brilho Total', status: 'Recebido', date: '2026-05-01', total: 450.00 },
    { id: 'OC-002', supplier: 'Metalúrgica Silva', status: 'Pendente', date: '2026-05-02', total: 1250.00 },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navegação de Estoque */}
      <div className="flex gap-4 border-b border-gray-100 dark:border-white/5 pb-1">
        <button 
          onClick={() => setActiveSubTab('produtos')}
          className={cn(
            "pb-3 px-2 text-xs font-black uppercase tracking-widest transition-all relative",
            activeSubTab === 'produtos' ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
          )}
        >
          Lista de Produtos
          {activeSubTab === 'produtos' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveSubTab('compras')}
          className={cn(
            "pb-3 px-2 text-xs font-black uppercase tracking-widest transition-all relative",
            activeSubTab === 'compras' ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
          )}
        >
          Compras & Notas
          {activeSubTab === 'compras' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full" />}
        </button>
      </div>

      {/* KPIs de Estoque */}
      {activeSubTab === 'produtos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="p-6 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total de Itens</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">452 unidades</p>
            </div>
          </div>
          
          <div className="p-6 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Abaixo do Mínimo</p>
              <p className="text-xl font-black text-red-600">8 produtos</p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fornecedores Ativos</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">12 parceiros</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabela Dinâmica */}
      <div className="bg-white dark:bg-[#0f1117] rounded-[32px] border border-gray-100 dark:border-[#1e2235] shadow-xl overflow-hidden animate-slide-up">
        <div className="p-8 border-b border-gray-100 dark:border-[#1e2235] bg-gray-50/50 dark:bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-[#1a1c26] rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10">
              {activeSubTab === 'produtos' ? <Package className="w-6 h-6 text-primary-600" /> : <ShoppingCart className="w-6 h-6 text-primary-600" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                {activeSubTab === 'produtos' ? 'Gestão de Insumos' : 'Ordens de Compra'}
              </h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {activeSubTab === 'produtos' ? 'Produtos de Limpeza & Manutenção' : 'Controle de Pedidos e Notas Fiscais'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={activeSubTab === 'produtos' ? "Buscar produto ou SKU..." : "Buscar ordem ou NF..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
            <button className="px-5 py-3 bg-primary-600 text-white rounded-xl text-xs font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {activeSubTab === 'produtos' ? 'Cadastrar' : 'Nova Compra'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeSubTab === 'produtos' ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/30 dark:bg-white/[0.02] border-b border-gray-100 dark:border-[#1e2235]">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto / Fornecedor</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Estoque</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço Unit.</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1e2235]">
                {mockProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{product.supplier}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all",
                              product.stock <= product.min_stock ? "bg-red-500" : "bg-emerald-500"
                            )}
                            style={{ width: `${Math.min((product.stock / (product.min_stock * 2)) * 100, 100)}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-xs font-black",
                          product.stock <= product.min_stock ? "text-red-600" : "text-gray-900 dark:text-white"
                        )}>
                          {product.stock} un
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 rounded-lg transition-colors" title="Dar Entrada">
                          <ArrowUpCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors" title="Dar Saída">
                          <ArrowDownCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/30 dark:bg-white/[0.02] border-b border-gray-100 dark:border-[#1e2235]">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Ordem / Fornecedor</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Pedido</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1e2235]">
                {mockPurchases.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{order.id}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{order.supplier}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest",
                        order.status === 'Recebido' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-gray-500">{new Date(order.date).toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-gray-900 dark:text-white">R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary-600 hover:text-white transition-all flex items-center gap-2">
                          <Receipt className="w-3.5 h-3.5" />
                          Lançar NF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-8 bg-gray-50/30 dark:bg-white/[0.02] border-t border-gray-100 dark:border-[#1e2235] flex justify-between items-center">
          <p className="text-xs font-bold text-gray-400">
            Dica: Utilize a coluna de ações para registrar entradas de notas fiscais rapidamente.
          </p>
          <button className="flex items-center gap-2 text-xs font-black text-primary-600 hover:gap-3 transition-all">
            Ver Todos os Fornecedores
            <Truck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
