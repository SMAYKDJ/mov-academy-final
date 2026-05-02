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
import { User, Building2, Shield, Users, Plug, Settings2, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SettingsTab } from '@/types/configuracoes';
import { useAuth } from '@/hooks/use-auth';

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const renderContent = () => {
    if (!user) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

    switch (activeTab) {
      case 'perfil': return <ProfileForm profile={user as any} />;
      case 'academia': return <GymForm settings={gymSettingsData} />;
      case 'seguranca': return <SecuritySettings userEmail={user.email} />;
      case 'usuarios': return <UserManagement users={systemUsersData} />;
      case 'integracoes': return <Integrations integrations={integrationsData} />;
      case 'preferencias': return <PreferencesSettings />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#080a0f]">
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
        onCollapse={setIsSidebarCollapsed}
      />

      <div className={cn(
        "flex-1 w-full min-w-0 transition-all duration-300",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="px-4 md:px-8 py-8 w-full max-w-full overflow-x-hidden space-y-8">
          {!user ? (
            <div className="flex items-center justify-center h-[60vh]">
              <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            </div>
          ) : (user.role !== 'admin' && user.role !== 'ceo') ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center max-w-sm bg-white dark:bg-[#0f1117] p-8 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-xl animate-scale-in">
                <Shield className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Acesso Restrito</h2>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">Sua conta atual não possui permissões administrativas para acessar as configurações críticas do sistema.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Page Header */}
              <div className="mb-10 animate-fade-in space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                    Sistema v2.0
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  Configurações
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl">
                  Central de gerenciamento para perfil, dados da academia, segurança avançada e integrações de sistema.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Internal Sidebar */}
                <div className="lg:w-72 shrink-0">
                  {/* Mobile: horizontal scroll tabs with improved UI */}
                  <div className="flex lg:hidden gap-3 overflow-x-auto pb-6 scroll-hide -mx-4 px-4 mask-fade-right">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 border shadow-sm",
                          activeTab === tab.id
                            ? "bg-primary-600 text-white border-primary-600 shadow-xl shadow-primary-500/30 scale-105"
                            : "bg-white dark:bg-[#0f1117] text-gray-500 dark:text-gray-400 border-gray-100 dark:border-[#1e2235] hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-white" : "text-gray-400")} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Desktop: vertical sidebar - Sticky and premium look */}
                  <nav className="hidden lg:block bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] p-3 space-y-1.5 sticky top-28 shadow-sm">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300",
                          activeTab === tab.id
                            ? "bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 border-l-4 border-primary-600 pl-4"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1d27] border-l-4 border-transparent pl-4"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          activeTab === tab.id ? "bg-primary-100 dark:bg-primary-900/30" : "bg-gray-50 dark:bg-gray-800/50"
                        )}>
                          <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-primary-600 dark:text-primary-400" : "text-gray-400")} />
                        </div>
                        <div>
                          <p className="text-sm font-bold tracking-tight">{tab.label}</p>
                          <p className="text-[10px] text-gray-400 leading-tight mt-0.5 uppercase tracking-wider">{tab.description}</p>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content Area - Premium Card */}
                <div className="flex-1 min-w-0 bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] p-6 sm:p-10 shadow-sm animate-slide-up">
                  {renderContent()}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
