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
                { id: 28, codigo: '1028', nome_completo: 'Marta Vieira da Silva Souza de Oliveira', plano: 'Mensal Básico', score_ia: 95, status: 'Ativo' },
                { id: 29, codigo: '1029', nome_completo: 'Rogério Ceni Mücke Muller', plano: 'VIP Anual', score_ia: 82, status: 'Experimental' },
                { id: 30, codigo: '1030', nome_completo: 'Rebeca Rodrigues de Andrade', plano: 'VIP Anual', score_ia: 96, status: 'Ativo' },
                { id: 31, codigo: '1031', nome_completo: 'Gabriel Medina de Queiroz', plano: 'Mensal Básico', score_ia: 65, status: 'Prospect' },
                { id: 32, codigo: '1032', nome_completo: 'Ítalo Ferreira do Nascimento', plano: 'Pro Semestral', score_ia: 74, status: 'Experimental' },
                { id: 33, codigo: '1033', nome_completo: 'Ana Marcela de Jesus Soares da Cunha', plano: 'VIP Anual', score_ia: 87, status: 'Ativo' },
                { id: 34, codigo: '1034', nome_completo: 'Paula Renata Pequeno de Oliveira', plano: 'Mensal Básico', score_ia: 52, status: 'Em Risco' },
                { id: 35, codigo: '1035', nome_completo: 'Sérgio Dutra dos Santos (Escadinha)', plano: 'Pro Semestral', score_ia: 90, status: 'Ativo' },
                { id: 36, codigo: '1036', nome_completo: 'Hélia Souza (Fofão) da Silva', plano: 'VIP Anual', score_ia: 88, status: 'Ativo' },
                { id: 37, codigo: '1037', nome_completo: 'Dante Guimarães Santos do Amaral', plano: 'Mensal Básico', score_ia: 40, status: 'Em Risco' },
                { id: 38, codigo: '1038', nome_completo: 'Murilo Endres de Castro', plano: 'Pro Semestral', score_ia: 79, status: 'Experimental' },
                { id: 39, codigo: '1039', nome_completo: 'Jaqueline Maria Pereira de Carvalho', plano: 'VIP Anual', score_ia: 93, status: 'Ativo' },
                { id: 40, codigo: '1040', nome_completo: 'Sheilla Tavares de Castro Blassioli', plano: 'Mensal Básico', score_ia: 44, status: 'Em Risco' },
                { id: 41, codigo: '1041', nome_completo: 'Thaisa Daher de Menezes', plano: 'Pro Semestral', score_ia: 85, status: 'Ativo' },
                { id: 42, codigo: '1042', nome_completo: 'Fabiana Marcelino Claudino de Oliveira', plano: 'VIP Anual', score_ia: 82, status: 'Experimental' },
                { id: 43, codigo: '1043', nome_completo: 'Walewska Moreira de Oliveira', plano: 'Mensal Básico', score_ia: 91, status: 'Ativo' },
                { id: 44, codigo: '1044', nome_completo: 'Sérgio Maurício da Silva Santos', plano: 'Pro Semestral', score_ia: 75, status: 'Prospect' },
                { id: 45, codigo: '1045', nome_completo: 'Everaldo Marques da Silva Júnior', plano: 'VIP Anual', score_ia: 88, status: 'Ativo' },
                { id: 46, codigo: '1046', nome_completo: 'Rafaela Lopes Silva de Oliveira', plano: 'Judô Pro', score_ia: 97, status: 'Ativo' },
                { id: 47, codigo: '1047', nome_completo: 'Arthur Nabarrete Zanetti Cavalcanti', plano: 'Ginástica VIP', score_ia: 99, status: 'Ativo' },
                { id: 48, codigo: '1048', nome_completo: 'Diego Matias Hypólito de Souza', plano: 'Pro Semestral', score_ia: 62, status: 'Em Risco' },
                { id: 49, codigo: '1049', nome_completo: 'Daniele Matias Hypólito de Souza', plano: 'VIP Anual', score_ia: 84, status: 'Ativo' },
                { id: 50, codigo: '1050', nome_completo: 'Caio Oliveira de Sena Bonfim', plano: 'Mensal Básico', score_ia: 71, status: 'Prospect' },
                { id: 51, codigo: '1051', nome_completo: 'Antônio Carlos (Careca) Santos', plano: 'VIP Anual', score_ia: 15, status: 'Inativo' },
                { id: 52, codigo: '1052', nome_completo: 'Tadeu Schmidt de Oliveira', plano: 'Mensal Básico', score_ia: 88, status: 'Ativo' },
                { id: 53, codigo: '1053', nome_completo: 'Maju Coutinho dos Santos', plano: 'Pro Semestral', score_ia: 94, status: 'Ativo' },
                { id: 54, codigo: '1054', nome_completo: 'William Bonner da Silva Rocha', plano: 'VIP Anual', score_ia: 72, status: 'Experimental' },
                { id: 55, codigo: '1055', nome_completo: 'Renata Vasconcellos Silva', plano: 'Mensal Básico', score_ia: 49, status: 'Em Risco' },
                { id: 56, codigo: '1056', nome_completo: 'Luciano Huck da Veiga Rocha', plano: 'Pro Semestral', score_ia: 35, status: 'Em Risco' },
                { id: 57, codigo: '1057', nome_completo: 'Angélica Ksyvickis Huck', plano: 'VIP Anual', score_ia: 90, status: 'Ativo' },
                { id: 58, codigo: '1058', nome_completo: 'Marcos Mion da Silva', plano: 'Mensal Básico', score_ia: 68, status: 'Prospect' },
                { id: 59, codigo: '1059', nome_completo: 'Ana Maria Braga Maffeis', plano: 'Pro Semestral', score_ia: 81, status: 'Ativo' },
                { id: 60, codigo: '1060', nome_completo: 'Fausto Correa da Silva (Faustão)', plano: 'VIP Anual', score_ia: 12, status: 'Inativo' }
            ];
        },

        async save(id, payload) {
            if (!window.supabaseClient) return;
            const clean = PlayFitnessAPI.utils.cleanPayload(payload);
            if (id) {
                const { data, error } = await window.supabaseClient
                    .from('alunos')
                    .update(clean)
                    .eq('id', id)
                    .select();
                if (error) throw error;
                return data;
            } else {
                const nextCode = await PlayFitnessAPI.students.getNextCode();
                const { data, error } = await window.supabaseClient
                    .from('alunos')
                    .insert([{ ...clean, codigo: nextCode }])
                    .select();
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

        async getAssessmentHistory(alunoId) {
            if (!window.supabaseClient) return [];
            const { data, error } = await window.supabaseClient
                .from('avaliacoes_fisicas')
                .select('*')
                .eq('aluno_id', alunoId)
                .order('data_avaliacao', { ascending: false });
            if (error) throw error;
            return data;
        },

        async addAssessment(alunoId, weight, height) {
            if (!window.supabaseClient) return;
            const imc = (weight && height) ? (weight / (height * height)).toFixed(2) : null;
            const { data, error } = await window.supabaseClient
                .from('avaliacoes_fisicas')
                .insert([{ 
                    aluno_id: alunoId, 
                    peso: weight, 
                    altura: height, 
                    imc: imc,
                    data_avaliacao: new Date().toISOString().substring(0, 10)
                }]);
            if (error) throw error;
            return data;
        },

        async getLastVisit(alunoId) {
            try {
                if (!window.supabaseClient) return null;
                const { data, error } = await window.supabaseClient
                    .from('catraca_logs')
                    .select('data_hora_entrada')
                    .eq('aluno_id', alunoId)
                    .order('data_hora_entrada', { ascending: false })
                    .limit(1);
                if (error || !data || data.length === 0) return null;
                return data[0].data_hora_entrada;
            } catch (e) {
                return null;
            }
        },

        async getReferralRanking() {
            try {
                if (!window.supabaseClient) return this.getFallbackRanking();
                const { data, error } = await window.supabaseClient
                    .from('alunos')
                    .select('id, indicado_por, nome_completo, status');
                if (error) throw error;

                const counts = {};
                data.forEach(m => {
                    if (m.indicado_por) {
                        const name = m.indicado_por;
                        counts[name] = (counts[name] || 0) + 1;
                    }
                });

                const ranking = await Promise.all(Object.entries(counts)
                    .map(async ([name, count]) => {
                        const member = data.find(m => m.nome_completo === name);
                        const fidelity = member ? await PlayFitnessAPI.students.getFidelityScore(member.id) : 85;
                        return {
                            name: name,
                            count: count,
                            fidelity: fidelity,
                            foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff`
                        };
                    }));

                return ranking.sort((a, b) => b.count - a.count);
            } catch (e) {
                return this.getFallbackRanking();
            }
        },

        async getFidelityScore(alunoId) {
            try {
                if (!window.supabaseClient) return 85;
                
                // 1. Calcular frequência (logs nos últimos 30 dias)
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                
                const { data: logs, error: lErr } = await window.supabaseClient
                    .from('catraca_logs')
                    .select('id')
                    .eq('aluno_id', alunoId)
                    .gte('data_hora_entrada', thirtyDaysAgo.toISOString());
                
                const freq = (logs ? logs.length : 0);
                const freqScore = Math.min((freq / 12) * 100, 100); // 12 visitas = meta (3x semana)

                // 2. Calcular tempo de casa (anos)
                const { data: aluno, error: aErr } = await window.supabaseClient
                    .from('alunos')
                    .select('data_matricula')
                    .eq('id', alunoId)
                    .single();
                
                let tenureScore = 0;
                if(aluno && aluno.data_matricula) {
                    const days = (new Date() - new Date(aluno.data_matricula)) / (1000 * 60 * 60 * 24);
                    tenureScore = Math.min((days / 365) * 100, 100); // 1 ano = 100 no tenure
                }

                // Score Final: 70% frequência atual + 30% longevidade
                return Math.round((freqScore * 0.7) + (tenureScore * 0.3));
            } catch (e) {
                return 82;
            }
        },

        getFallbackRanking() {
            return [
                { name: 'SMAYK TR', count: 12, fidelity: 98, foto: 'https://ui-avatars.com/api/?name=SMAYK+TR&background=dc2626&color=fff' },
                { name: 'Lucas Silva', count: 8, fidelity: 92, foto: 'https://ui-avatars.com/api/?name=Lucas+Silva' },
                { name: 'Ana Paula', count: 5, fidelity: 88, foto: 'https://ui-avatars.com/api/?name=Ana+Paula' }
            ];
        }
    },

    kpis: {
        async getOverview() {
            try {
                if (!window.supabaseClient) throw new Error('No Supabase Client');
                const { data: students, error } = await window.supabaseClient.from('alunos').select('status, score_ia, plano, data_matricula, data_cancelamento');
                if (error) throw error;
                
                const total = students.length;
                if (total === 0) return this.getFallbackOverview();
                
                const now = new Date();
                const lastYear = new Date();
                lastYear.setFullYear(now.getFullYear() - 1);

                let activeNow = 0;
                let activeLastYear = 0;
                let criticalNow = 0;
                let totalScoreNow = 0;

                students.forEach(s => {
                    const matDate = s.data_matricula ? new Date(s.data_matricula) : null;
                    const cancDate = s.data_cancelamento ? new Date(s.data_cancelamento) : null;

                    // Active Now
                    if (s.status === 'Ativo' || s.status === 'Em Risco' || s.status === 'Experimental') {
                        activeNow++;
                        totalScoreNow += (s.score_ia || 0);
                        if (s.status === 'Em Risco') criticalNow++;
                    }

                    // Active Last Year (Simplified logic)
                    if (matDate && matDate <= lastYear) {
                        if (!cancDate || cancDate > lastYear) {
                            activeLastYear++;
                        }
                    }
                });

                // Faturamento e Custos Reais
                const { data: transacoes, error: tErr } = await window.supabaseClient
                    .from('transacoes')
                    .select('valor, tipo, data');
                
                const revenueNow = tErr ? 0 : transacoes
                    .filter(t => t.tipo === 'Receita')
                    .reduce((acc, curr) => acc + (curr.valor || 0), 0);

                const revenueLastYear = tErr ? 0 : transacoes
                    .filter(t => {
                        if (t.tipo !== 'Receita' || !t.data) return false;
                        const tDate = new Date(t.data);
                        return tDate <= lastYear;
                    })
                    .reduce((acc, curr) => acc + (curr.valor || 0), 0);

                const avgScoreNow = activeNow > 0 ? totalScoreNow / activeNow : 0;
                const churnRateNow = activeNow > 0 ? (criticalNow / activeNow) * 100 : 0;
                
                // Mocking historical averages if data is not enough (especially for score/churn last year)
                const avgScoreLastYear = 78; // Baseline
                const churnRateLastYear = 24.2; // Baseline

                return {
                    total: activeNow,
                    totalDiff: activeLastYear > 0 ? ((activeNow - activeLastYear) / activeLastYear * 100).toFixed(1) : '+12.5',
                    critical: criticalNow,
                    avgScore: Math.round(avgScoreNow),
                    avgScoreDiff: ((avgScoreNow - avgScoreLastYear) / avgScoreLastYear * 100).toFixed(1),
                    churnRate: churnRateNow.toFixed(1),
                    churnRateDiff: ((churnRateNow - churnRateLastYear) / churnRateLastYear * 100).toFixed(1),
                    revenue: revenueNow,
                    revenueDiff: revenueLastYear > 0 ? ((revenueNow - revenueLastYear) / revenueLastYear * 100).toFixed(1) : '+18.2',
                    costs: 0,
                    ltv: activeNow > 0 ? (revenueNow / activeNow) * 12 : 0
                };
            } catch (e) {
                console.warn('PlayFitnessAPI: Sucesso limitado. Usando Modo Contingência.', e);
                return this.getFallbackOverview();
            }
        },

        getFallbackOverview() {
            return {
                total: 436,
                totalDiff: '+12.5',
                critical: 45,
                avgScore: 72,
                avgScoreDiff: '+3.1',
                churnRate: '20.9',
                churnRateDiff: '-1.4',
                revenue: 48517.40,
                revenueDiff: '+18.2',
                ltv: 1200
            };
        },

        async getPredictiveData() {
            // Deprecated: use getChurnAnalytics instead for the comprehensive dashboard
            return {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [
                    { label: 'Frequência Real', data: [65, 59, 80, 81, 56, 55, 40], color: '#e02928' },
                    { label: 'Projeção IA', data: [70, 65, 85, 90, 75, 74, 68], color: '#ff8e82' }
                ]
            };
        },

        async getChurnAnalytics() {
            try {
                if (!window.supabaseClient) throw new Error('No client');
                const { data: alunos, error } = await window.supabaseClient.from('alunos').select('status, plano, situacao_financeira, data_matricula, data_cancelamento, score_ia');
                if (error) throw error;
                
                const total = alunos.length;
                if(total === 0) return this.getFallbackChurnAnalytics();
                
                const highRisk = alunos.filter(a => a.status === 'Em Risco' || (a.score_ia && a.score_ia < 40)).length;
                const active = alunos.filter(a => ['Ativo', 'Experimental'].includes(a.status)).length;
                const inadimplentes = alunos.filter(a => a.situacao_financeira === 'inadimplente' && a.status !== 'Inativo').length;
                
                const engagedBase = active + highRisk;
                
                // Plano Predominante
                const planos = {};
                alunos.forEach(a => { if(a.plano) planos[a.plano] = (planos[a.plano] || 0) + 1; });
                const topPlan = Object.keys(planos).reduce((a, b) => planos[a] > planos[b] ? a : b, '---');
                const topPlanPerc = total > 0 && planos[topPlan] ? Math.round((planos[topPlan] / total) * 100) : 0;

                // Processar histórico real dos últimos 6 meses
                const d = new Date();
                const labels = [];
                const histMatriculas = [];
                const histCancelamentos = [];
                const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                
                for(let i = 5; i >= 0; i--) {
                    const targetMonthDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
                    const tag = `${monthNames[targetMonthDate.getMonth()]}/${targetMonthDate.getFullYear().toString().substring(2)}`;
                    labels.push(tag);
                    
                    const matNoMes = alunos.filter(a => {
                        if(!a.data_matricula) return false;
                        const matD = new Date(a.data_matricula);
                        return matD.getMonth() === targetMonthDate.getMonth() && matD.getFullYear() === targetMonthDate.getFullYear();
                    }).length;
                    
                    const cancNoMes = alunos.filter(a => {
                         if(a.status !== 'Inativo' || !a.data_cancelamento) return false;
                         const cancD = new Date(a.data_cancelamento);
                         return cancD.getMonth() === targetMonthDate.getMonth() && cancD.getFullYear() === targetMonthDate.getFullYear();
                    }).length;
                    
                    histMatriculas.push(matNoMes);
                    histCancelamentos.push(cancNoMes);
                }
                
                // Adicionando o mês de predição (próximo mês)
                labels.push(`Predição ${monthNames[(d.getMonth() + 1) % 12]}`);
                const projMatriculas = Math.round(histMatriculas.slice(-3).reduce((a, b) => a + b, 0) / 3) + 2; // Media ultimos 3 meses + tendencia
                const projCancelamentos = Math.round(highRisk * 0.4); // Predicao: 40% dos q estao em risco vao evadir

                histMatriculas.push(projMatriculas);
                histCancelamentos.push(projCancelamentos);

                return {
                    highRiskCount: highRisk,
                    retentionRate: engagedBase > 0 ? Math.round((active / engagedBase) * 100) : 0,
                    topPlan: topPlan,
                    topPlanPerc: topPlanPerc,
                    defaultRate: engagedBase > 0 ? Math.round((inadimplentes / engagedBase) * 100) : 0,
                    chart: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Novos Alunos vs. Base',
                                data: histMatriculas,
                                color: '#10b981'
                            },
                            {
                                label: 'Projeção de Evasão (Churn)',
                                data: histCancelamentos,
                                color: '#f43f5e'
                            }
                        ]
                    }
                };
            } catch (e) {
                console.warn('Analytics API error, using fallback');
                return this.getFallbackChurnAnalytics();
            }
        },

        getFallbackChurnAnalytics() {
            return {
                highRiskCount: 15,
                retentionRate: 85,
                topPlan: 'VIP Anual',
                topPlanPerc: 60,
                defaultRate: 15,
                chart: {
                    labels: ['Out/25', 'Nov/25', 'Dez/25', 'Jan/26', 'Fev/26', 'Mar/26', 'Predição Abr/26'],
                    datasets: [
                        { label: 'Ativos e Retidos', data: [200, 210, 215, 230, 250, 260, 280], color: '#10b981' },
                        { label: 'Projeção de Evasão (Churn)', data: [30, 25, 40, 50, 45, 60, 85], color: '#f43f5e' }
                    ]
                }
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

    finance: {
        async saveTransaction(payload) {
            if (!window.supabaseClient) return;
            const { data, error } = await window.supabaseClient
                .from('transacoes')
                .insert([PlayFitnessAPI.utils.cleanPayload(payload)]);
            if (error) throw error;
            return data;
        },

        async getTransactions() {
            if (!window.supabaseClient) return [];
            const { data, error } = await window.supabaseClient
                .from('transacoes')
                .select('*')
                .order('data', { ascending: false });
            if (error) throw error;
            return data;
        }
    },

    utils: {
        async getGymConfig() {
           if (!window.supabaseClient) return { nome_academia: 'Gaia Academia', cor_primaria: '#ef4444' };
           const { data, error } = await window.supabaseClient.from('configuracoes').select('*').single();
           const config = (error || !data) ? { nome_academia: 'Gaia Academia', cor_primaria: '#ef4444' } : data;
           
           // Aplica a cor tema globalmente se especificada
           if(config.cor_primaria) PlayFitnessAPI.utils.applyTheme(config.cor_primaria);
           
           return config;
        },

        applyTheme(color) {
            // Cria ou atualiza uma tag de estilo global para sobrescrever a cor primária do Tailwind
            let style = document.getElementById('playfitness-dynamic-theme');
            if (!style) {
                style = document.createElement('style');
                style.id = 'playfitness-dynamic-theme';
                document.head.appendChild(style);
            }
            // Injeta a variável CSS e sobrescreve as classes do Tailwind que usam #ef4444
            style.innerHTML = `
                :root { --primary-dynamic: ${color}; }
                .text-primary { color: ${color} !important; }
                .bg-primary { background-color: ${color} !important; }
                .border-primary { border-color: ${color} !important; }
                .ring-primary { --tw-ring-color: ${color} !important; }
                .shadow-primary\\/20 { --tw-shadow-color: ${color} !important; }
                .shadow-primary\\/30 { --tw-shadow-color: ${color} !important; }
                .text-\\[\\#ef4444\\] { color: ${color} !important; }
            `;
        },

        cleanPayload(payload) {
            const clean = {};
            for (let key in payload) {
                if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
                    clean[key] = payload[key];
                }
            }
            return clean;
        },

        exportCSV(data, fileName = 'export.csv') {
            if (!data || !data.length) return;
            const headers = Object.keys(data[0]).join(';');
            const rows = data.map(obj => Object.values(obj).map(v => typeof v === 'string' ? `"${v}"` : v).join(';'));
            const csv = [headers, ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    /**
     * Membership Plans Management
     */
    plans: {
        async list() {
            if (!window.supabaseClient) return [
                { id: 1, nome: 'VIP Anual', valor: 199.90, duracao_meses: 12, ativo: true },
                { id: 2, nome: 'Pro Semestral', valor: 149.90, duracao_meses: 6, ativo: true },
                { id: 3, nome: 'Mensal Básico', valor: 99.90, duracao_meses: 1, ativo: true }
            ];
            const { data, error } = await window.supabaseClient
                .from('planos')
                .select('*')
                .order('valor', { ascending: false });
            if (error) throw error;
            return data;
        },

        async save(id, payload) {
            if (!window.supabaseClient) return;
            const clean = PlayFitnessAPI.utils.cleanPayload(payload);
            if (id) {
                const { data, error } = await window.supabaseClient
                    .from('planos')
                    .update(clean)
                    .eq('id', id)
                    .select();
                if (error) throw error;
                return data;
            } else {
                const { data, error } = await window.supabaseClient
                    .from('planos')
                    .insert([clean])
                    .select();
                if (error) throw error;
                return data;
            }
        },

        async delete(id) {
            if (!window.supabaseClient) return;
            const { error } = await window.supabaseClient
                .from('planos')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return true;
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
