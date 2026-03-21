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
            if (!window.supabaseClient) return this.getFallbackData();
            const { data, error } = await window.supabaseClient
                .from('alunos')
                .select('*')
                .order('codigo', { ascending: false });
            if (error) throw error;

            if (!data || data.length === 0) return this.getFallbackData();
            return data;
        },

        getFallbackData() {
            return [
                { id: 1, nome_completo: 'Carlos Alberto', status: 'Ativo', indicado_por: 'SMAYK TR', foto_url: '', plano: 'VIP Anual', score_ia: 92 },
                { id: 2, nome_completo: 'Beatriz Helena', status: 'Em Risco', indicado_por: 'SMAYK TR', foto_url: '', plano: 'Mensal Básico', score_ia: 42 },
                { id: 3, nome_completo: 'João Paulo', status: 'Ativo', indicado_por: 'Lucas Silva', foto_url: '', plano: 'Pro Semestral', score_ia: 85 },
                { id: 4, nome_completo: 'Mariana Costa', status: 'Inativo', indicado_por: 'Ana Paula', foto_url: '', plano: 'Experimental', score_ia: 15 }
            ];
        },

        async save(id, payload) {
            if (!window.supabaseClient) return;
            if (id) {
                const clean = PlayFitnessAPI.utils.cleanPayload(payload);
                const { data, error } = await window.supabaseClient
                    .from('alunos')
                    .update(clean)
                    .eq('id', id);
                if (error) throw error;
                return data;
            } else {
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
            if (!window.supabaseClient) return null;
            const { data, error } = await window.supabaseClient
                .from('alunos')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data;
        },

        async getNextCode() {
            if (!window.supabaseClient) return 1;
            const { data, error } = await window.supabaseClient
                .from('alunos')
                .select('codigo')
                .order('codigo', { ascending: false })
                .limit(1);
            if (error) return 1;
            return (data && data.length > 0) ? parseInt(data[0].codigo) + 1 : 1;
        },

        async getReferralRanking() {
            if (!window.supabaseClient) return this.getFallbackRanking();
            const { data, error } = await window.supabaseClient
                .from('alunos')
                .select('indicado_por');
            if (error) throw error;

            const counts = {};
            data.forEach(m => {
                if (m.indicado_por) counts[m.indicado_por] = (counts[m.indicado_por] || 0) + 1;
            });

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

            return ranking.length > 0 ? ranking : this.getFallbackRanking();
        },

        getFallbackRanking() {
            return [
                { name: 'SMAYK TR', count: 12, foto: 'https://ui-avatars.com/api/?name=SMAYK+TR&background=dc2626&color=fff' },
                { name: 'Lucas Silva', count: 8, foto: 'https://ui-avatars.com/api/?name=Lucas+Silva' },
                { name: 'Ana Paula', count: 5, foto: 'https://ui-avatars.com/api/?name=Ana+Paula' }
            ];
        }
    },

    kpis: {
        async getOverview() {
            if (!window.supabaseClient) return { total: 4, critical: 1, active: 3, avgScore: 78, churnRate: '25.0', revenue: 15600, ltv: 18000 };
            const { data: students, error } = await window.supabaseClient.from('alunos').select('status, score_ia');
            if (error) return { total: 0, critical: 0, active: 0, avgScore: 0, churnRate: '0.0', revenue: 0, ltv: 0 };
            
            const total = students.length;
            const critical = students.filter(s => s.status === 'Em Risco').length;
            const avgScore = total > 0 ? students.reduce((acc, s) => acc + (s.score_ia || 0), 0) / total : 0;
            const revenue = total * 185; 
            
            return {
                total,
                critical,
                avgScore: Math.round(avgScore),
                churnRate: total > 0 ? ((critical / total) * 100).toFixed(1) : '0.0',
                revenue: revenue,
                ltv: total > 0 ? (revenue / total) * 14 : 0
            };
        },

        async getPredictiveData() {
            // Mock data for the Fluxo Preditivo Digital chart
            return {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [
                    {
                        label: 'Frequência Real',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        color: '#e02928'
                    },
                    {
                        label: 'Projeção IA',
                        data: [70, 65, 85, 90, 75, 70, 60],
                        color: '#ff8e82'
                    }
                ]
            };
        }
    },

    storage: {
        async upload(file) {
            if (!window.supabaseClient) return '';
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await window.supabaseClient.storage
                .from('membros')
                .upload(`fotos/${fileName}`, file);
            if (error) throw error;
            const { data: { publicUrl } } = window.supabaseClient.storage
                .from('membros')
                .getPublicUrl(`fotos/${fileName}`);
            return publicUrl;
        }
    },

    utils: {
        cleanPayload(payload) {
            const cleaned = {};
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    cleaned[key] = typeof value === 'string' ? value.trim() : value;
                }
            });
            return cleaned;
        }
    }
};

const PlayFitnessUI = {
    toast(message, iconName = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'glass-card border border-white/10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in fixed bottom-8 right-8 z-[1000] bg-surface/90 backdrop-blur-xl';
        toast.style.transform = 'translateY(100px)';
        toast.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        toast.innerHTML = `
            <span class="material-symbols-outlined text-primary">${iconName}</span>
            <span class="text-sm font-bold uppercase tracking-wider">${message}</span>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.style.transform = 'translateY(0)', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    },

    initHeader(activeLink = '') {
        // Updated to be a no-op as the new dashboard has a hardcoded sidebar/header for better control
        // But we keep it for potential integration on sub-pages
        console.log('PlayFitnessUI: Header logic migrated to component-based architecture');
    }
};

window.PlayFitnessAPI = PlayFitnessAPI;
window.PlayFitnessUI = PlayFitnessUI;
