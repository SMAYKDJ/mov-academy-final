/**
 * Gaia Team - Unified Data API
 * Handles all Supabase interactions and data structuring
 */

const GaiaAPI = {
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
            return data;
        },



        async save(id, payload) {
            if (id) {
                const clean = GaiaAPI.utils.cleanPayload(payload);
                const { data, error } = await window.supabaseClient
                    .from('alunos')
                    .update(clean)
                    .eq('id', id);
                if (error) throw error;
                return data;
            } else {
                // Get next code
                const nextCode = await GaiaAPI.students.getNextCode();
                const clean = GaiaAPI.utils.cleanPayload(payload);
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

window.GaiaAPI = GaiaAPI;
