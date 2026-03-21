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
            try {
                if (!window.supabaseClient) return this.getFallbackData();
                const { data, error } = await window.supabaseClient
                    .from('alunos')
                    .select('*')
                    .order('codigo', { ascending: false });
                if (error) throw error;

                if (!data || data.length === 0) return this.getFallbackData();
                return data;
            } catch (e) {
                console.warn('PlayFitnessAPI: Falha na nuvem. Carregando Base Local.');
                return this.getFallbackData();
            }
        },

        getFallbackData() {
            return [
                { id: 1, codigo: '1001', nome_completo: 'Carlos Eduardo Silva', plano: 'VIP Anual', score_ia: 92, status: 'Ativo' },
                { id: 2, codigo: '1002', nome_completo: 'Beatriz Heloísa Rocha', plano: 'Mensal Básico', score_ia: 42, status: 'Em Risco' },
                { id: 3, codigo: '1003', nome_completo: 'João Paulo Almeida', plano: 'Pro Semestral', score_ia: 78, status: 'Ativo' },
                { id: 4, codigo: '1004', nome_completo: 'Mariana Costa', plano: 'Experimental', score_ia: 65, status: 'Inativo' },
                { id: 5, codigo: '1005', nome_completo: 'Ricardo Oliveira', plano: 'VIP Anual', score_ia: 95, status: 'Ativo' },
                { id: 6, codigo: '1006', nome_completo: 'Juliana Mendes', plano: 'Mensal Básico', score_ia: 38, status: 'Em Risco' },
                { id: 7, codigo: '1007', nome_completo: 'Lucas Ferreira', plano: 'Pro Semestral', score_ia: 82, status: 'Experimental' },
                { id: 8, codigo: '1008', nome_completo: 'Fernanda Lima', plano: 'VIP Anual', score_ia: 88, status: 'Ativo' },
                { id: 9, codigo: '1009', nome_completo: 'Gabriel Souza', plano: 'Mensal Básico', score_ia: 25, status: 'Inativo' },
                { id: 10, codigo: '1010', nome_completo: 'Amanda Xavier', plano: 'Pro Semestral', score_ia: 70, status: 'Prospect' },
                { id: 11, codigo: '1011', nome_completo: 'Daniel Santos', plano: 'VIP Anual', score_ia: 91, status: 'Ativo' },
                { id: 12, codigo: '1012', nome_completo: 'Patrícia Borges', plano: 'Mensal Básico', score_ia: 45, status: 'Em Risco' },
                { id: 13, codigo: '1013', nome_completo: 'Thiago Martins', plano: 'Pro Semestral', score_ia: 76, status: 'Experimental' },
                { id: 14, codigo: '1014', nome_completo: 'Camila Rodrigues', plano: 'VIP Anual', score_ia: 84, status: 'Ativo' },
                { id: 15, codigo: '1015', nome_completo: 'Felipe Andrade', plano: 'Mensal Básico', score_ia: 30, status: 'Em Risco' },
                { id: 16, codigo: '1016', nome_completo: 'Isabela Nunes', plano: 'Pro Semestral', score_ia: 89, status: 'Prospect' },
                { id: 17, codigo: '1017', nome_completo: 'Gustavo Paiva', plano: 'VIP Anual', score_ia: 98, status: 'Ativo' },
                { id: 18, codigo: '1018', nome_completo: 'Renata Lemos', plano: 'Mensal Básico', score_ia: 22, status: 'Inativo' },
                { id: 19, codigo: '1019', nome_completo: 'André Vila Nova', plano: 'Pro Semestral', score_ia: 81, status: 'Experimental' },
                { id: 20, codigo: '1020', nome_completo: 'Vanessa Guedes', plano: 'VIP Anual', score_ia: 94, status: 'Ativo' },
                { id: 21, codigo: '1021', nome_completo: 'Marcos Vinícius', plano: 'Mensal Básico', score_ia: 55, status: 'Em Risco' },
                { id: 22, codigo: '1022', nome_completo: 'Letícia Spiller', plano: 'Pro Semestral', score_ia: 68, status: 'Prospect' },
                { id: 23, codigo: '1023', nome_completo: 'Adriano Imperador', plano: 'VIP Anual', score_ia: 99, status: 'Ativo' },
                { id: 24, codigo: '1024', nome_completo: 'Bruna Marquezine', plano: 'Mensal Básico', score_ia: 48, status: 'Em Risco' },
                { id: 25, codigo: '1025', nome_completo: 'Neymar Jr', plano: 'VIP Anual', score_ia: 77, status: 'Experimental' },
                { id: 26, codigo: '1026', nome_completo: 'Lionel Messi', plano: 'Pro Semestral', score_ia: 100, status: 'Ativo' },
                { id: 27, codigo: '1027', nome_completo: 'Cristiano Ronaldo', plano: 'VIP Anual', score_ia: 100, status: 'Ativo' },
                { id: 28, codigo: '1028', nome_completo: 'Marta Vieira', plano: 'Mensal Básico', score_ia: 95, status: 'Ativo' },
                { id: 30, codigo: '1030', nome_completo: 'Rebeca Andrade', plano: 'VIP Anual', score_ia: 96, status: 'Ativo' },
                { id: 31, codigo: '1031', nome_completo: 'Gabriel Medina', plano: 'Mensal Básico', score_ia: 65, status: 'Prospect' },
                { id: 32, codigo: '1032', nome_completo: 'Ítalo Ferreira', plano: 'Pro Semestral', score_ia: 74, status: 'Experimental' },
                { id: 33, codigo: '1033', nome_completo: 'Ana Marcela', plano: 'VIP Anual', score_ia: 87, status: 'Ativo' },
                { id: 34, codigo: '1034', nome_completo: 'Paula Pequeno', plano: 'Mensal Básico', score_ia: 52, status: 'Em Risco' },
                { id: 35, codigo: '1035', nome_completo: 'Serginho Escadinha', plano: 'Pro Semestral', score_ia: 90, status: 'Ativo' },
                { id: 36, codigo: '1036', nome_completo: 'Fofão Venturini', plano: 'VIP Anual', score_ia: 88, status: 'Ativo' },
                { id: 37, codigo: '1037', nome_completo: 'Dante Amaral', plano: 'Mensal Básico', score_ia: 40, status: 'Em Risco' },
                { id: 38, codigo: '1038', nome_completo: 'Murilo Endres', plano: 'Pro Semestral', score_ia: 79, status: 'Experimental' },
                { id: 39, codigo: '1039', nome_completo: 'Jaqueline Carvalho', plano: 'VIP Anual', score_ia: 93, status: 'Ativo' },
                { id: 40, codigo: '1040', nome_completo: 'Sheilla Castro', plano: 'Mensal Básico', score_ia: 44, status: 'Em Risco' },
                { id: 41, codigo: '1041', nome_completo: 'Thaisa Daher', plano: 'Pro Semestral', score_ia: 85, status: 'Ativo' },
                { id: 42, codigo: '1042', nome_completo: 'Fabiana Claudino', plano: 'VIP Anual', score_ia: 82, status: 'Experimental' },
                { id: 43, codigo: '1043', nome_completo: 'Walewska Oliveira', plano: 'Mensal Básico', score_ia: 91, status: 'Ativo' },
                { id: 44, codigo: '1044', nome_completo: 'Serginho Maurício', plano: 'Pro Semestral', score_ia: 75, status: 'Prospect' },
                { id: 45, codigo: '1045', nome_completo: 'Everaldo Marques', plano: 'VIP Anual', score_ia: 88, status: 'Ativo' },
                { id: 46, codigo: '1046', nome_completo: 'Rafaela Silva', plano: 'Judô Pro', score_ia: 97, status: 'Ativo' },
                { id: 47, codigo: '1047', nome_completo: 'Arthur Zanetti', plano: 'Ginástica VIP', score_ia: 99, status: 'Ativo' },
                { id: 48, codigo: '1048', nome_completo: 'Diego Hypólito', plano: 'Pro Semestral', score_ia: 62, status: 'Em Risco' },
                { id: 49, codigo: '1049', nome_completo: 'Daniele Hypólito', plano: 'VIP Anual', score_ia: 84, status: 'Ativo' },
                { id: 50, codigo: '1050', nome_completo: 'Caio Bonfim', plano: 'Mensal Básico', score_ia: 71, status: 'Prospect' }
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
            try {
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
            } catch (e) {
                return this.getFallbackRanking();
            }
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
            try {
                if (!window.supabaseClient) throw new Error('No Supabase Client');
                const { data: students, error } = await window.supabaseClient.from('alunos').select('status, score_ia');
                if (error) throw error;
                
                const total = students.length;
                if (total === 0) return this.getFallbackOverview();
                
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
            } catch (e) {
                console.warn('PlayFitnessAPI: Sucesso limitado. Usando Modo Contingência.', e);
                return this.getFallbackOverview();
            }
        },

        getFallbackOverview() {
            return { total: 42, critical: 12, active: 30, avgScore: 84, churnRate: '28.5', revenue: 24500, ltv: 18000 };
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
                        data: [70, 65, 85, 90, 75, 74, 68],
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
