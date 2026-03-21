/**
 * PlayFitness Team - Unified Data API
 * Handles all Supabase interactions and data structuring
 */

const PlayFitnessAPI = {
    /**
     * Students (Alunos) CRUD
     */
    students: {
        async list() {
            const { data, error } = await window.supabaseClient
                .from('alunos')
                .select('*')
                .order('codigo', { ascending: false });
            if (error) throw error;

            // Fallback for demonstration if database is empty
            if (!data || data.length === 0) {
                return [
                    { id: 1, nome_completo: 'Carlos Alberto', status: 'Ativo', indicado_por: 'SMAYK TR', foto_url: '' },
                    { id: 2, nome_completo: 'Beatriz Helena', status: 'Ativo', indicado_por: 'SMAYK TR', foto_url: '' },
                    { id: 3, nome_completo: 'João Paulo', status: 'Ativo', indicado_por: 'Lucas Silva', foto_url: '' },
                    { id: 4, nome_completo: 'Mariana Costa', status: 'Ativo', indicado_por: 'Ana Paula', foto_url: '' }
                ];
            }
            return data;
        },



        async save(id, payload) {
            if (id) {
                const clean = PlayFitnessAPI.utils.cleanPayload(payload);
                const { data, error } = await window.supabaseClient
                    .from('alunos')
                    .update(clean)
                    .eq('id', id);
                if (error) throw error;
                return data;
            } else {
                // Get next code
                const nextCode = await PlayFitnessAPI.students.getNextCode();
                const clean = PlayFitnessAPI.utils.cleanPayload(payload);
                const { data, error } = await window.supabaseClient
                    .from('alunos')
                    .insert([{ ...clean, codigo: nextCode }]);
                if (error) throw error;
                return data;
            }
        },

        async getById(id) {
            const { data, error } = await window.supabaseClient
                .from('alunos')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data;
        },

        async getNextCode() {
            const { data, error } = await window.supabaseClient
                .from('alunos')
                .select('codigo')
                .order('codigo', { ascending: false })
                .limit(1);
            if (error) return 1;
            return (data && data.length > 0) ? parseInt(data[0].codigo) + 1 : 1;
        },

        async searchReferrer(query) {
            const { data, error } = await window.supabaseClient
                .from('alunos')
                .select('nome_completo, foto_url')
                .ilike('nome_completo', `%${query}%`)
                .limit(5);
            if (error) return [];
            return data;
        },
        async getReferralRanking() {
            const { data, error } = await window.supabaseClient
                .from('alunos')
                .select('indicado_por');
            if (error) throw error;

            const counts = {};
            data.forEach(m => {
                if (m.indicado_por) {
                    counts[m.indicado_por] = (counts[m.indicado_por] || 0) + 1;
                }
            });

            // Format for ranking and get photos from existing members
            const { data: members } = await window.supabaseClient
                .from('alunos')
                .select('nome_completo, foto_url');

            const ranking = Object.entries(counts)
                .map(([name, count]) => {
                    const member = members.find(m => m.nome_completo === name);
                    return {
                        name: name,
                        count: count,
                        foto: member ? member.foto_url : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
                    };
                })
                .sort((a, b) => b.count - a.count);

            // Fallback for demonstration
            if (ranking.length === 0) {
                return [
                    { name: 'SMAYK TR', count: 12, foto: 'https://ui-avatars.com/api/?name=SMAYK+TR&background=e91e63&color=fff' },
                    { name: 'Lucas Silva', count: 8, foto: 'https://ui-avatars.com/api/?name=Lucas+Silva' },
                    { name: 'Ana Paula', count: 5, foto: 'https://ui-avatars.com/api/?name=Ana+Paula' }
                ];
            }

            return ranking;
        }
    },

    /**
     * Dashboard KPIs
     */
    kpis: {
        async getOverview() {
            const { data: students, error } = await window.supabaseClient.from('alunos').select('status, score_ia');
            if (error) {
                console.error('Erro ao obter KPIs:', error);
                return { total: 0, critical: 0, active: 0, avgScore: 0, churnRate: '0.0' };
            }
            const total = students.length;
            const critical = students.filter(s => s.status === 'Em Risco').length;
            const active = students.filter(s => s.status === 'Ativo').length;
            const avgScore = total > 0 ? students.reduce((acc, s) => acc + (s.score_ia || 0), 0) / total : 0;
            const revenue = total * 150; // Estimativa: R$ 150 por aluno
            return {
                total,
                critical,
                active,
                avgScore: Math.round(avgScore),
                churnRate: total > 0 ? ((critical / total) * 100).toFixed(1) : '0.0',
                revenue: revenue,
                ltv: total > 0 ? (revenue / total) * 12 : 0 // Estimativa LTV anual
            };
        }
    },

    /**
     * Storage (Supabase Storage)
     */
    storage: {
        async upload(file) {
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await window.supabaseClient.storage
                .from('membros')
                .upload(`fotos/${fileName}`, file);

            if (error) {
                console.error('Erro no upload:', error);
                throw error;
            }

            const { data: { publicUrl } } = window.supabaseClient.storage
                .from('membros')
                .getPublicUrl(`fotos/${fileName}`);

            return publicUrl;
        }
    },

    /**
     * Utilities
     */
    utils: {
        calculateAge(birthDate) {
            if (!birthDate) return '--';
            const today = new Date();
            const birth = new Date(birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
            return age;
        },

        cleanPayload(payload) {
            // Remove empty fields and trim strings
            const cleaned = {};
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    cleaned[key] = typeof value === 'string' ? value.trim() : value;
                }
            });
            return cleaned;
        },

        formatPhone(val) {
            if (!val) return '';
            const digits = val.replace(/\D/g, '');
            if (digits.length !== 11) return val; // fallback
            return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
    }
};

/**
 * PlayFitness UI - User Interface Management
 * Handles global components like Headers, Toasts and Modals
 */
const PlayFitnessUI = {
    config: {
        activePage: '',
        user: {
            name: 'Admin',
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
        }
    },

    /**
     * Initializes the common header in the page
     * @param {string} activeLink - The ID of the current active navigation link
     */
    initHeader(activeLink = '') {
        const header = document.querySelector('header');
        if (!header) return;

        const navLinks = [
            { id: 'dashboard', label: 'Painel', href: 'dashboard.html' },
            { id: 'membros', label: 'Membros', href: 'membros.html' },
            { id: 'campanhas', label: 'Campanhas', href: 'campanhas.html' },
            { id: 'financeiro', label: 'Financeiro', href: 'financeiro.html' },
            { id: 'config', label: 'Configurações', href: '#' }
        ];

        const navHtml = navLinks.map(link => {
            const isActive = link.id === activeLink;
            const baseClass = "px-2 py-1 text-sm font-medium transition-colors rounded";
            const activeClass = isActive
                ? "text-white bg-white/10 border border-white/5"
                : "text-text-muted hover:text-white hover:bg-white/5";
            return `<a class="${baseClass} ${activeClass}" href="${link.href}">${link.label}</a>`;
        }).join('');

        header.innerHTML = `
            <div class="max-w-full px-4 min-h-[44px] h-auto flex flex-wrap items-center justify-between gap-3 py-2 md:py-0">
                <div class="flex items-center gap-2 min-w-fit">
                    <div class="w-8 h-8 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-surface-dark shadow-lg shadow-red-500/20">
                        <img src="logo.png" alt="CT Olimpo Lago" class="w-full h-full object-cover scale-125">
                    </div>
                    <h1 class="text-sm md:text-base font-bold tracking-tight text-white uppercase italic">CT<span class="text-red-600"> OLIMPO</span></h1>
                    <div class="h-4 w-[1px] bg-border-dark mx-1.5 hidden sm:block"></div>
                    <nav class="hidden md:flex items-center gap-0.5">
                        ${navHtml}
                    </nav>
                </div>
                
                <!-- Mobile Nav Toggle/Menu could go here if needed, but let's at least fix layout -->
                <nav class="flex md:hidden items-center gap-1 w-full order-3 justify-center border-t border-border-dark mt-2 pt-2">
                    ${navHtml}
                </nav>

                <div class="flex items-center gap-2 flex-1 justify-end md:flex-initial">
                    <div class="relative w-full max-w-[150px] sm:max-w-[200px]">
                        <span class="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-text-muted text-[14px]">search</span>
                        <input class="w-full h-7 bg-surface-dark border border-border-dark rounded text-[11px] pl-7 pr-2 text-white placeholder-text-muted focus:ring-1 focus:ring-red-500 transition-all" placeholder="Buscar..." type="text" />
                    </div>
                    <button onclick="PlayFitnessUI.toast('Funcionalidade em desenvolvimento', 'info')" class="h-7 px-2 bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs font-bold rounded flex items-center gap-1 transition-colors shadow-lg shadow-red-900/20 whitespace-nowrap">
                        <span class="material-symbols-outlined text-[14px]">add</span>
                        <span>Nova</span>
                    </button>
                    <div class="h-7 w-7 rounded-full bg-slate-700 border border-border-dark overflow-hidden cursor-pointer min-w-[28px]">
                        <img alt="User Profile" class="w-full h-full object-cover" src="${this.config.user.avatar}" />
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Show a global toast notification
     */
    toast(message, iconName = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="material-symbols-outlined text-red-400">${iconName}</span>
            <span class="text-sm font-medium">${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

window.PlayFitnessAPI = PlayFitnessAPI;
window.PlayFitnessUI = PlayFitnessUI;
