'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ProfileForm } from '@/components/dashboard/configuracoes/profile-form';
import { GymForm } from '@/components/dashboard/configuracoes/gym-form';
import { SecuritySettings } from '@/components/dashboard/configuracoes/security-settings';
import { UserManagement } from '@/components/dashboard/configuracoes/user-management';
import { Integrations } from '@/components/dashboard/configuracoes/integrations';
import { PreferencesSettings } from '@/components/dashboard/configuracoes/preferences-settings';
import { currentProfile, gymSettingsData, systemUsersData, integrationsData } from '@/utils/configuracoes-data';
import { User, Building2, Shield, Users, Plug, Settings2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SettingsTab } from '@/types/configuracoes';

const tabs: { id: SettingsTab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'perfil', label: 'Perfil', icon: User, description: 'Dados pessoais' },
  { id: 'academia', label: 'Academia', icon: Building2, description: 'Dados do estabelecimento' },
  { id: 'seguranca', label: 'Segurança', icon: Shield, description: 'Senhas e autenticação' },
  { id: 'usuarios', label: 'Usuários', icon: Users, description: 'Equipe e permissões' },
  { id: 'integracoes', label: 'Integrações', icon: Plug, description: 'APIs e webhooks' },
  { id: 'preferencias', label: 'Preferências', icon: Settings2, description: 'Tema e notificações' },
];

export default function ConfiguracoesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('perfil');

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil': return <ProfileForm profile={currentProfile} />;
      case 'academia': return <GymForm settings={gymSettingsData} />;
      case 'seguranca': return <SecuritySettings />;
      case 'usuarios': return <UserManagement users={systemUsersData} />;
      case 'integracoes': return <Integrations integrations={integrationsData} />;
      case 'preferencias': return <PreferencesSettings />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                Sistema
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Configurações
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Gerencie seu perfil, academia, segurança e integrações
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Internal Sidebar */}
            <div className="lg:w-64 shrink-0">
              {/* Mobile: horizontal scroll tabs */}
              <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 scroll-hide">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                      activeTab === tab.id
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none"
                        : "bg-white dark:bg-[#0f1117] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#1e2235]"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Desktop: vertical sidebar */}
              <nav className="hidden lg:block bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-2 space-y-1 sticky top-24">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                      activeTab === tab.id
                        ? "bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1d27]"
                    )}
                  >
                    <tab.icon className={cn("w-4 h-4 shrink-0", activeTab === tab.id && "text-primary-600 dark:text-primary-400")} />
                    <div>
                      <p className="text-sm font-semibold">{tab.label}</p>
                      <p className="text-[10px] text-gray-400 leading-tight">{tab.description}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0 bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-6 md:p-8 animate-fade-in">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
