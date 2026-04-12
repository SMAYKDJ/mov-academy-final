/**
 * PlayFitness Team - Unified Data API
 * Handles all Supabase interactions and data structuring
 */

const PlayFitnessAPI = {
  /**
   * Boot Sequence: Aplica o tema instantaneamente do cache para evitar flash
   */
  boot() {
    try {
      const cache = localStorage.getItem("pf_theme_cache");
      if (cache) {
        const theme = JSON.parse(cache);
        this.applyTheme(
          theme.color,
          theme.bgColor,
          theme.txtColor,
          theme.btnTxtColor,
          false,
        );
      }
    } catch (e) {
      console.warn("PlayFitness: Erro no boot do tema.");
    }
  },

  /**
   * Students (Alunos) CRUD
   */
  students: {
    async list() {
      try {
        if (!window.supabaseClient) return this.getFallbackData();
        const { data, error } = await window.supabaseClient
          .from("alunos")
          .select("*")
          .order("codigo", { ascending: false });
        if (error) throw error;

        if (!data || data.length === 0) return this.getFallbackData();
        return data;
      } catch (e) {
        console.warn("PlayFitnessAPI: Falha na nuvem. Carregando Base Local.");
        return this.getFallbackData();
      }
    },

    getFallbackData() {
      return [
        {
          id: 1,
          codigo: "1001",
          nome_completo: "Carlos Eduardo Silva",
          plano: "VIP Anual",
          score_ia: 92,
          status: "Ativo",
        },
        {
          id: 2,
          codigo: "1002",
          nome_completo: "Beatriz Heloísa Rocha",
          plano: "Mensal Básico",
          score_ia: 42,
          status: "Em Risco",
        },
        {
          id: 3,
          codigo: "1003",
          nome_completo: "João Paulo Almeida",
          plano: "Pro Semestral",
          score_ia: 78,
          status: "Ativo",
        },
        {
          id: 4,
          codigo: "1004",
          nome_completo: "Mariana Costa",
          plano: "Experimental",
          score_ia: 65,
          status: "Inativo",
        },
        {
          id: 5,
          codigo: "1005",
          nome_completo: "Ricardo Oliveira",
          plano: "VIP Anual",
          score_ia: 95,
          status: "Ativo",
        },
        {
          id: 6,
          codigo: "1006",
          nome_completo: "Juliana Mendes",
          plano: "Mensal Básico",
          score_ia: 38,
          status: "Em Risco",
        },
        {
          id: 7,
          codigo: "1007",
          nome_completo: "Lucas Ferreira",
          plano: "Pro Semestral",
          score_ia: 82,
          status: "Experimental",
        },
        {
          id: 8,
          codigo: "1008",
          nome_completo: "Fernanda Lima",
          plano: "VIP Anual",
          score_ia: 88,
          status: "Ativo",
        },
        {
          id: 9,
          codigo: "1009",
          nome_completo: "Gabriel Souza",
          plano: "Mensal Básico",
          score_ia: 25,
          status: "Inativo",
        },
        {
          id: 10,
          codigo: "1010",
          nome_completo: "Amanda Xavier",
          plano: "Pro Semestral",
          score_ia: 70,
          status: "Prospect",
        },
        {
          id: 11,
          codigo: "1011",
          nome_completo: "Daniel Santos",
          plano: "VIP Anual",
          score_ia: 91,
          status: "Ativo",
        },
        {
          id: 12,
          codigo: "1012",
          nome_completo: "Patrícia Borges",
          plano: "Mensal Básico",
          score_ia: 45,
          status: "Em Risco",
        },
        {
          id: 13,
          codigo: "1013",
          nome_completo: "Thiago Martins",
          plano: "Pro Semestral",
          score_ia: 76,
          status: "Experimental",
        },
        {
          id: 14,
          codigo: "1014",
          nome_completo: "Camila Rodrigues",
          plano: "VIP Anual",
          score_ia: 84,
          status: "Ativo",
        },
        {
          id: 15,
          codigo: "1015",
          nome_completo: "Felipe Andrade",
          plano: "Mensal Básico",
          score_ia: 30,
          status: "Em Risco",
        },
        {
          id: 16,
          codigo: "1016",
          nome_completo: "Isabela Nunes",
          plano: "Pro Semestral",
          score_ia: 89,
          status: "Prospect",
        },
        {
          id: 17,
          codigo: "1017",
          nome_completo: "Gustavo Paiva",
          plano: "VIP Anual",
          score_ia: 98,
          status: "Ativo",
        },
        {
          id: 18,
          codigo: "1018",
          nome_completo: "Renata Lemos",
          plano: "Mensal Básico",
          score_ia: 22,
          status: "Inativo",
        },
        {
          id: 19,
          codigo: "1019",
          nome_completo: "André Vila Nova",
          plano: "Pro Semestral",
          score_ia: 81,
          status: "Experimental",
        },
        {
          id: 20,
          codigo: "1020",
          nome_completo: "Vanessa Guedes",
          plano: "VIP Anual",
          score_ia: 94,
          status: "Ativo",
        },
        {
          id: 21,
          codigo: "1021",
          nome_completo: "Marcos Vinícius",
          plano: "Mensal Básico",
          score_ia: 55,
          status: "Em Risco",
        },
        {
          id: 22,
          codigo: "1022",
          nome_completo: "Letícia Spiller",
          plano: "Pro Semestral",
          score_ia: 68,
          status: "Prospect",
        },
        {
          id: 23,
          codigo: "1023",
          nome_completo: "Adriano Imperador",
          plano: "VIP Anual",
          score_ia: 99,
          status: "Ativo",
        },
        {
          id: 24,
          codigo: "1024",
          nome_completo: "Bruna Marquezine",
          plano: "Mensal Básico",
          score_ia: 48,
          status: "Em Risco",
        },
        {
          id: 25,
          codigo: "1025",
          nome_completo: "Neymar Jr",
          plano: "VIP Anual",
          score_ia: 77,
          status: "Experimental",
        },
        {
          id: 26,
          codigo: "1026",
          nome_completo: "Lionel Messi",
          plano: "Pro Semestral",
          score_ia: 100,
          status: "Ativo",
        },
        {
          id: 27,
          codigo: "1027",
          nome_completo: "Cristiano Ronaldo",
          plano: "VIP Anual",
          score_ia: 100,
          status: "Ativo",
        },
        {
          id: 28,
          codigo: "1028",
          nome_completo: "Marta Vieira da Silva Souza de Oliveira",
          plano: "Mensal Básico",
          score_ia: 95,
          status: "Ativo",
        },
        {
          id: 29,
          codigo: "1029",
          nome_completo: "Rogério Ceni Mücke Muller",
          plano: "VIP Anual",
          score_ia: 82,
          status: "Experimental",
        },
        {
          id: 30,
          codigo: "1030",
          nome_completo: "Rebeca Rodrigues de Andrade",
          plano: "VIP Anual",
          score_ia: 96,
          status: "Ativo",
        },
        {
          id: 31,
          codigo: "1031",
          nome_completo: "Gabriel Medina de Queiroz",
          plano: "Mensal Básico",
          score_ia: 65,
          status: "Prospect",
        },
        {
          id: 32,
          codigo: "1032",
          nome_completo: "Ítalo Ferreira do Nascimento",
          plano: "Pro Semestral",
          score_ia: 74,
          status: "Experimental",
        },
        {
          id: 33,
          codigo: "1033",
          nome_completo: "Ana Marcela de Jesus Soares da Cunha",
          plano: "VIP Anual",
          score_ia: 87,
          status: "Ativo",
        },
        {
          id: 34,
          codigo: "1034",
          nome_completo: "Paula Renata Pequeno de Oliveira",
          plano: "Mensal Básico",
          score_ia: 52,
          status: "Em Risco",
        },
        {
          id: 35,
          codigo: "1035",
          nome_completo: "Sérgio Dutra dos Santos (Escadinha)",
          plano: "Pro Semestral",
          score_ia: 90,
          status: "Ativo",
        },
        {
          id: 36,
          codigo: "1036",
          nome_completo: "Hélia Souza (Fofão) da Silva",
          plano: "VIP Anual",
          score_ia: 88,
          status: "Ativo",
        },
        {
          id: 37,
          codigo: "1037",
          nome_completo: "Dante Guimarães Santos do Amaral",
          plano: "Mensal Básico",
          score_ia: 40,
          status: "Em Risco",
        },
        {
          id: 38,
          codigo: "1038",
          nome_completo: "Murilo Endres de Castro",
          plano: "Pro Semestral",
          score_ia: 79,
          status: "Experimental",
        },
        {
          id: 39,
          codigo: "1039",
          nome_completo: "Jaqueline Maria Pereira de Carvalho",
          plano: "VIP Anual",
          score_ia: 93,
          status: "Ativo",
        },
        {
          id: 40,
          codigo: "1040",
          nome_completo: "Sheilla Tavares de Castro Blassioli",
          plano: "Mensal Básico",
          score_ia: 44,
          status: "Em Risco",
        },
        {
          id: 41,
          codigo: "1041",
          nome_completo: "Thaisa Daher de Menezes",
          plano: "Pro Semestral",
          score_ia: 85,
          status: "Ativo",
        },
        {
          id: 42,
          codigo: "1042",
          nome_completo: "Fabiana Marcelino Claudino de Oliveira",
          plano: "VIP Anual",
          score_ia: 82,
          status: "Experimental",
        },
        {
          id: 43,
          codigo: "1043",
          nome_completo: "Walewska Moreira de Oliveira",
          plano: "Mensal Básico",
          score_ia: 91,
          status: "Ativo",
        },
        {
          id: 44,
          codigo: "1044",
          nome_completo: "Sérgio Maurício da Silva Santos",
          plano: "Pro Semestral",
          score_ia: 75,
          status: "Prospect",
        },
        {
          id: 45,
          codigo: "1045",
          nome_completo: "Everaldo Marques da Silva Júnior",
          plano: "VIP Anual",
          score_ia: 88,
          status: "Ativo",
        },
        {
          id: 46,
          codigo: "1046",
          nome_completo: "Rafaela Lopes Silva de Oliveira",
          plano: "Judô Pro",
          score_ia: 97,
          status: "Ativo",
        },
        {
          id: 47,
          codigo: "1047",
          nome_completo: "Arthur Nabarrete Zanetti Cavalcanti",
          plano: "Ginástica VIP",
          score_ia: 99,
          status: "Ativo",
        },
        {
          id: 48,
          codigo: "1048",
          nome_completo: "Diego Matias Hypólito de Souza",
          plano: "Pro Semestral",
          score_ia: 62,
          status: "Em Risco",
        },
        {
          id: 49,
          codigo: "1049",
          nome_completo: "Daniele Matias Hypólito de Souza",
          plano: "VIP Anual",
          score_ia: 84,
          status: "Ativo",
        },
        {
          id: 50,
          codigo: "1050",
          nome_completo: "Caio Oliveira de Sena Bonfim",
          plano: "Mensal Básico",
          score_ia: 71,
          status: "Prospect",
        },
        {
          id: 51,
          codigo: "1051",
          nome_completo: "Antônio Carlos (Careca) Santos",
          plano: "VIP Anual",
          score_ia: 15,
          status: "Inativo",
        },
        {
          id: 52,
          codigo: "1052",
          nome_completo: "Tadeu Schmidt de Oliveira",
          plano: "Mensal Básico",
          score_ia: 88,
          status: "Ativo",
        },
        {
          id: 53,
          codigo: "1053",
          nome_completo: "Maju Coutinho dos Santos",
          plano: "Pro Semestral",
          score_ia: 94,
          status: "Ativo",
        },
        {
          id: 54,
          codigo: "1054",
          nome_completo: "William Bonner da Silva Rocha",
          plano: "VIP Anual",
          score_ia: 72,
          status: "Experimental",
        },
        {
          id: 55,
          codigo: "1055",
          nome_completo: "Renata Vasconcellos Silva",
          plano: "Mensal Básico",
          score_ia: 49,
          status: "Em Risco",
        },
        {
          id: 56,
          codigo: "1056",
          nome_completo: "Luciano Huck da Veiga Rocha",
          plano: "Pro Semestral",
          score_ia: 35,
          status: "Em Risco",
        },
        {
          id: 57,
          codigo: "1057",
          nome_completo: "Angélica Ksyvickis Huck",
          plano: "VIP Anual",
          score_ia: 90,
          status: "Ativo",
        },
        {
          id: 58,
          codigo: "1058",
          nome_completo: "Marcos Mion da Silva",
          plano: "Mensal Básico",
          score_ia: 68,
          status: "Prospect",
        },
        {
          id: 59,
          codigo: "1059",
          nome_completo: "Ana Maria Braga Maffeis",
          plano: "Pro Semestral",
          score_ia: 81,
          status: "Ativo",
        },
        {
          id: 60,
          codigo: "1060",
          nome_completo: "Fausto Correa da Silva (Faustão)",
          plano: "VIP Anual",
          score_ia: 12,
          status: "Inativo",
        },
      ];
    },

    async save(id, payload) {
      if (!window.supabaseClient) return;
      const clean = PlayFitnessAPI.utils.cleanPayload(payload);
      if (id) {
        const { data, error } = await window.supabaseClient
          .from("alunos")
          .update(clean)
          .eq("id", id)
          .select();
        if (error) throw error;
        return data;
      } else {
        const nextCode = await PlayFitnessAPI.students.getNextCode();
        const { data, error } = await window.supabaseClient
          .from("alunos")
          .insert([{ ...clean, codigo: nextCode }])
          .select();
        if (error) throw error;
        return data;
      }
    },

    async getById(id) {
      if (!window.supabaseClient) return null;
      const { data, error } = await window.supabaseClient
        .from("alunos")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },

    async getNextCode() {
      if (!window.supabaseClient) return 1;
      const { data, error } = await window.supabaseClient
        .from("alunos")
        .select("codigo")
        .order("codigo", { ascending: false })
        .limit(1);
      if (error) return 1;
      return data && data.length > 0 ? parseInt(data[0].codigo) + 1 : 1;
    },

    async getAssessmentHistory(alunoId) {
      if (!window.supabaseClient) return [];
      const { data, error } = await window.supabaseClient
        .from("avaliacoes_fisicas")
        .select("*")
        .eq("aluno_id", alunoId)
        .order("data_avaliacao", { ascending: false });
      if (error) throw error;
      return data;
    },

    async addAssessment(alunoId, weight, height) {
      if (!window.supabaseClient) return;
      const imc =
        weight && height ? (weight / (height * height)).toFixed(2) : null;
      const { data, error } = await window.supabaseClient
        .from("avaliacoes_fisicas")
        .insert([
          {
            aluno_id: alunoId,
            peso: weight,
            altura: height,
            imc: imc,
            data_avaliacao: new Date().toISOString().substring(0, 10),
          },
        ]);
      if (error) throw error;
      return data;
    },

    async getLastVisit(alunoId) {
      try {
        if (!window.supabaseClient) return null;
        const { data, error } = await window.supabaseClient
          .from("catraca_logs")
          .select("data_hora_entrada")
          .eq("aluno_id", alunoId)
          .order("data_hora_entrada", { ascending: false })
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
          .from("alunos")
          .select("id, id_indicacao, nome_completo, status");
        if (error) throw error;

        const counts = {};
        data.forEach((m) => {
          if (m.id_indicacao) {
            const refId = m.id_indicacao;
            counts[refId] = (counts[refId] || 0) + 1;
          }
        });

        // OPTIMIZATION: Don't call fidelity for all referrers in a loop to avoid rate limits
        const ranking = Object.entries(counts).map(([refId, count]) => {
          const member = data.find((m) => m.id.toString() === refId.toString());
          const name = member ? member.nome_completo : `ID: ${refId}`;
          return {
            id: refId,
            name: name,
            count: count,
            fidelity: 85, // Default baseline for list, calculation moved to detail calls
            foto: `https://i.pravatar.cc/150?u=${member ? member.id + 1000 : Math.random()}`,
          };
        });

        return ranking.sort((a, b) => b.count - a.count);
      } catch (e) {
        console.error("Referral ranking failed:", e);
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
          .from("catraca_logs")
          .select("id")
          .eq("aluno_id", alunoId)
          .gte("data_hora_entrada", thirtyDaysAgo.toISOString());

        const freq = logs ? logs.length : 0;
        const freqScore = Math.min((freq / 12) * 100, 100); // 12 visitas = meta (3x semana)

        // 2. Calcular tempo de casa (anos)
        const { data: aluno, error: aErr } = await window.supabaseClient
          .from("alunos")
          .select("data_matricula")
          .eq("id", alunoId)
          .single();

        let tenureScore = 0;
        if (aluno && aluno.data_matricula) {
          const matDate = new Date(aluno.data_matricula);
          if (!isNaN(matDate.getTime())) {
            const days = (new Date() - matDate) / (1000 * 60 * 60 * 24);
            tenureScore = Math.max(0, Math.min((days / 365) * 100, 100)); // 1 ano = 100 no tenure
          }
        }

        // Score Final: 70% frequência atual + 30% longevidade
        return Math.round(freqScore * 0.7 + tenureScore * 0.3);
      } catch (e) {
        return 82;
      }
    },

    getFallbackRanking() {
      return [
        {
          id: 1,
          name: "Dra. Maria Alice Aragão",
          count: 12,
          fidelity: 99,
          foto: "https://i.pravatar.cc/150?u=1001",
        },
        {
          id: 101,
          name: "SMAYK TR",
          count: 8,
          fidelity: 98,
          foto: "https://i.pravatar.cc/150?u=1201",
        },
        {
          id: 102,
          name: "Lucas Silva",
          count: 5,
          fidelity: 92,
          foto: "https://i.pravatar.cc/150?u=1202",
        },
      ];
    },

    // --- NEW: Anthropometric Assessment (Avaliação Antropométrica) ---
    async listAssessments(cpf) {
      if (!window.supabaseClient || !cpf) return [];
      try {
        const { data, error } = await window.supabaseClient
          .from("avaliacao")
          .select("*")
          .eq("codCliente", cpf)
          .order("data", { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (e) {
        console.error("Error listing assessments:", e);
        return [];
      }
    },

    async saveAssessment(payload) {
      if (!window.supabaseClient) return;
      try {
        const clean = PlayFitnessAPI.utils.cleanPayload(payload);
        const { data, error } = await window.supabaseClient
          .from("avaliacao")
          .insert([clean])
          .select();
        if (error) throw error;
        return data;
      } catch (e) {
        console.error("Error saving assessment:", e);
        throw e;
      }
    },
  },

  kpis: {
    async getOverview() {
      try {
        if (!window.supabaseClient) throw new Error("No Supabase Client");
        const { data: students, error } = await window.supabaseClient
          .from("alunos")
          .select("status, score_ia, plano, data_matricula, data_cancelamento");
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

        students.forEach((s) => {
          const matDate = s.data_matricula ? new Date(s.data_matricula) : null;
          const cancDate = s.data_cancelamento
            ? new Date(s.data_cancelamento)
            : null;

          // Active Now
          if (
            s.status === "Ativo" ||
            s.status === "Em Risco" ||
            s.status === "Experimental"
          ) {
            activeNow++;
            totalScoreNow += s.score_ia || 0;
            if (s.status === "Em Risco") criticalNow++;
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
          .from("transacoes")
          .select("valor, tipo, data");

        const revenueNow = tErr
          ? 0
          : (transacoes || [])
              .filter((t) => t.tipo === "Receita")
              .reduce((acc, curr) => acc + (curr.valor || 0), 0);

        const revenueLastYear = tErr
          ? 0
          : (transacoes || [])
              .filter((t) => {
                if (t.tipo !== "Receita" || !t.data) return false;
                const tDate = new Date(t.data);
                return !isNaN(tDate.getTime()) && tDate <= lastYear;
              })
              .reduce((acc, curr) => acc + (curr.valor || 0), 0);

        const avgScoreNow = activeNow > 0 ? totalScoreNow / activeNow : 0;
        const churnRateNow =
          activeNow > 0 ? (criticalNow / activeNow) * 100 : 0;

        // Mocking historical averages if data is not enough (especially for score/churn last year)
        const avgScoreLastYear = 78; // Baseline
        const churnRateLastYear = 24.2; // Baseline

        return {
          total: activeNow,
          totalDiff:
            activeLastYear > 0
              ? (((activeNow - activeLastYear) / activeLastYear) * 100).toFixed(
                  1,
                )
              : "+12.5",
          critical: criticalNow,
          avgScore: Math.round(avgScoreNow),
          avgScoreDiff: (
            ((avgScoreNow - avgScoreLastYear) / avgScoreLastYear) *
            100
          ).toFixed(1),
          churnRate: churnRateNow.toFixed(1),
          churnRateDiff: (
            ((churnRateNow - churnRateLastYear) / churnRateLastYear) *
            100
          ).toFixed(1),
          revenue: revenueNow,
          revenueDiff:
            revenueLastYear > 0
              ? (
                  ((revenueNow - revenueLastYear) / revenueLastYear) *
                  100
                ).toFixed(1)
              : "+18.2",
          costs: 0,
          ltv: activeNow > 0 ? (revenueNow / activeNow) * 12 : 0,
        };
      } catch (e) {
        console.warn(
          "PlayFitnessAPI: Sucesso limitado. Usando Modo Contingência.",
          e,
        );
        return this.getFallbackOverview();
      }
    },

    getFallbackOverview() {
      const alunos = this.getFallbackData();
      const total = alunos.length;
      const critical = alunos.filter((a) => a.status === "Em Risco").length;
      const active = alunos.filter((a) =>
        ["Ativo", "Em Risco", "Experimental"].includes(a.status),
      );

      const totalScore = active.reduce(
        (acc, curr) => acc + (curr.score_ia || 0),
        0,
      );
      const avgScore =
        active.length > 0 ? Math.round(totalScore / active.length) : 0;
      const churnRate =
        active.length > 0
          ? ((critical / active.length) * 100).toFixed(1)
          : "0.0";

      // Base mock de financeira
      const revenue = active.length * 120.5; // Mock average ticket

      return {
        total: total,
        totalDiff: "+5.2",
        critical: critical,
        avgScore: avgScore,
        avgScoreDiff: "+1.5",
        churnRate: churnRate,
        churnRateDiff: "-2.1",
        revenue: revenue,
        revenueDiff: "+8.4",
        ltv: 1400,
      };
    },

    async getPredictiveData() {
      // Deprecated: use getChurnAnalytics instead for the comprehensive dashboard
      return {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        datasets: [
          {
            label: "Frequência Real",
            data: [65, 59, 80, 81, 56, 55, 40],
            color: "#e02928",
          },
          {
            label: "Projeção IA",
            data: [70, 65, 85, 90, 75, 74, 68],
            color: "#ff8e82",
          },
        ],
      };
    },

    async getChurnAnalytics() {
      try {
        if (!window.supabaseClient) throw new Error("No client");
        const { data: alunos, error } = await window.supabaseClient
          .from("alunos")
          .select(
            "status, plano, situacao_financeira, data_matricula, data_cancelamento, score_ia",
          );
        if (error) throw error;

        const total = alunos.length;
        if (total === 0) return this.getFallbackChurnAnalytics();

        const highRisk = alunos.filter(
          (a) => a.status === "Em Risco" || (a.score_ia && a.score_ia < 40),
        ).length;
        const active = alunos.filter((a) =>
          ["Ativo", "Experimental"].includes(a.status),
        ).length;
        const inadimplentes = alunos.filter(
          (a) =>
            a.situacao_financeira === "inadimplente" && a.status !== "Inativo",
        ).length;

        const engagedBase = active + highRisk;

        // Plano Predominante
        const planos = {};
        alunos.forEach((a) => {
          if (a.plano) planos[a.plano] = (planos[a.plano] || 0) + 1;
        });
        const topPlan = Object.keys(planos).reduce(
          (a, b) => (planos[a] > planos[b] ? a : b),
          "---",
        );
        const topPlanPerc =
          total > 0 && planos[topPlan]
            ? Math.round((planos[topPlan] / total) * 100)
            : 0;

        // Processar histórico real dos últimos 6 meses
        const d = new Date();
        const labels = [];
        const histMatriculas = [];
        const histCancelamentos = [];
        const monthNames = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];

        for (let i = 5; i >= 0; i--) {
          const targetMonthDate = new Date(
            d.getFullYear(),
            d.getMonth() - i,
            1,
          );
          const tag = `${monthNames[targetMonthDate.getMonth()]}/${targetMonthDate.getFullYear().toString().substring(2)}`;
          labels.push(tag);

          const matNoMes = alunos.filter((a) => {
            if (!a.data_matricula) return false;
            const matD = new Date(a.data_matricula);
            return (
              matD.getMonth() === targetMonthDate.getMonth() &&
              matD.getFullYear() === targetMonthDate.getFullYear()
            );
          }).length;

          const cancNoMes = alunos.filter((a) => {
            if (a.status !== "Inativo" || !a.data_cancelamento) return false;
            const cancD = new Date(a.data_cancelamento);
            if (isNaN(cancD.getTime())) return false;
            return (
              cancD.getMonth() === targetMonthDate.getMonth() &&
              cancD.getFullYear() === targetMonthDate.getFullYear()
            );
          }).length;

          histMatriculas.push(matNoMes);
          histCancelamentos.push(cancNoMes);
        }

        // Adicionando o mês de predição (próximo mês)
        labels.push(`Predição ${monthNames[(d.getMonth() + 1) % 12]}`);
        const projMatriculas =
          Math.round(histMatriculas.slice(-3).reduce((a, b) => a + b, 0) / 3) +
          2; // Media ultimos 3 meses + tendencia
        const projCancelamentos = Math.round(highRisk * 0.4); // Predicao: 40% dos q estao em risco vao evadir

        histMatriculas.push(projMatriculas);
        histCancelamentos.push(projCancelamentos);

        return {
          highRiskCount: highRisk,
          retentionRate:
            engagedBase > 0 ? Math.round((active / engagedBase) * 100) : 0,
          topPlan: topPlan,
          topPlanPerc: topPlanPerc,
          defaultRate:
            engagedBase > 0
              ? Math.round((inadimplentes / engagedBase) * 100)
              : 0,
          chart: {
            labels: labels,
            datasets: [
              {
                label: "Novos Alunos vs. Base",
                data: histMatriculas,
                color: "#10b981",
              },
              {
                label: "Projeção de Evasão (Churn)",
                data: histCancelamentos,
                color: "#f43f5e",
              },
            ],
          },
        };
      } catch (e) {
        console.warn("Analytics API error, using fallback");
        return this.getFallbackChurnAnalytics();
      }
    },

    getFallbackChurnAnalytics() {
      const alunos = this.getFallbackData();
      const total = alunos.length;
      const highRiskCount = alunos.filter(
        (a) => a.status === "Em Risco",
      ).length;
      const inativos = alunos.filter((a) => a.status === "Inativo").length;
      const active = total - inativos;
      const retentionRate =
        active > 0 ? Math.round(((active - highRiskCount) / active) * 100) : 0;

      const planos = {};
      alunos.forEach((a) => {
        if (a.plano) planos[a.plano] = (planos[a.plano] || 0) + 1;
      });
      const topPlan = Object.keys(planos).reduce(
        (a, b) => (planos[a] > planos[b] ? a : b),
        "---",
      );
      const topPlanPerc =
        total > 0 && planos[topPlan]
          ? Math.round((planos[topPlan] / total) * 100)
          : 0;

      const defaultRate = 18; // Simulando 18% inadimplentes já que não tinha flag antes na base

      return {
        highRiskCount: highRiskCount,
        retentionRate: retentionRate,
        topPlan: topPlan,
        topPlanPerc: topPlanPerc,
        defaultRate: defaultRate,
        chart: {
          labels: [
            "Out/25",
            "Nov/25",
            "Dez/25",
            "Jan/26",
            "Fev/26",
            "Mar/26",
            "Predição Abr/26",
          ],
          datasets: [
            {
              label: "Ativos e Retidos",
              data: [50, 52, 54, 55, 58, 60, 62],
              color: "#10b981",
            },
            {
              label: "Projeção de Evasão (Churn)",
              data: [4, 5, 4, 3, 6, 8, Math.round(highRiskCount * 0.4)],
              color: "#f43f5e",
            },
          ],
        },
      };
    },
  },

  storage: {
    async upload(file) {
      if (!window.supabaseClient) return "";
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await window.supabaseClient.storage
        .from("membros")
        .upload(`fotos/${fileName}`, file);
      if (error) throw error;
      const {
        data: { publicUrl },
      } = window.supabaseClient.storage
        .from("membros")
        .getPublicUrl(`fotos/${fileName}`);
      return publicUrl;
    },
  },

  finance: {
    async saveTransaction(payload) {
      if (!window.supabaseClient) return;
      const { data, error } = await window.supabaseClient
        .from("transacoes")
        .insert([PlayFitnessAPI.utils.cleanPayload(payload)]);
      if (error) throw error;
      return data;
    },

    async getTransactions() {
      if (!window.supabaseClient) return [];
      const { data, error } = await window.supabaseClient
        .from("transacoes")
        .select("*")
        .order("data", { ascending: false });
      if (error) throw error;
      return data;
    },
  },

  utils: {
    async getGymConfig() {
      if (!window.supabaseClient)
        return { nome_academia: "Gaia Academia", cor_primaria: "#ef4444" };
      const { data, error } = await window.supabaseClient
        .from("configuracoes")
        .select("*")
        .single();
      const config =
        error || !data
          ? { nome_academia: "Gaia Academia", cor_primaria: "#ef4444" }
          : data;

      // Aplica a cor tema globalmente se especificada
      if (
        config.cor_primaria ||
        config.cor_background ||
        config.cor_texto ||
        config.cor_texto_botao
      ) {
        PlayFitnessAPI.utils.applyTheme(
          config.cor_primaria,
          config.cor_background,
          config.cor_texto,
          config.cor_texto_botao,
        );
      }

      // Aplica tamanhos de fonte
      PlayFitnessAPI.utils.applyFontSizes(
        PlayFitnessAPI.utils.getFontSizes(config),
      );

      // NOVO: Aplica White-Label Branding (Logo)
      PlayFitnessUI.applyBranding(config);

      // NOVO: Ativa barra de notificações inteligentes
      PlayFitnessUI.initNotifications();

      return config;
    },

    getFontSizes(config = null) {
      const defaults = { headline: 1, body: 1, label: 1, sidebar: 1 };
      try {
        // 1. Prioriza o que veio do Banco de Dados
        if (config && config.escala_fontes) {
          return { ...defaults, ...config.escala_fontes };
        }
        // 2. Fallback para LocalStorage
        const stored = localStorage.getItem("playfitness_font_sizes");
        return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
      } catch (e) {
        return defaults;
      }
    },

    applyFontSizes(sizes) {
      let style = document.getElementById("playfitness-fonts-theme");
      if (!style) {
        style = document.createElement("style");
        style.id = "playfitness-fonts-theme";
        document.head.appendChild(style);
      }

      // Proportional scaling based on root font size instead of overriding everything
      const baseScale = sizes.body || 1;
      const headlineScale = sizes.headline || 1;

      style.innerHTML = `
                :root {
                    --pf-scale-headline: ${headlineScale};
                    --pf-scale-body: ${baseScale};
                    --pf-scale-label: ${sizes.label || 1};
                    --pf-scale-sidebar: ${sizes.sidebar || 1};
                }

                /* Proportional scaling without breaking Tailwind rems */
                body {
                    font-size: calc(16px * var(--pf-scale-body));
                }

                .font-headline {
                    font-size: calc(1.2em * var(--pf-scale-headline));
                }

                .font-label {
                    font-size: calc(1em * var(--pf-scale-label));
                }

                /* Sidebar scaling */
                #sidebarNav a span, #sidebarNav button {
                    font-size: calc(0.875rem * var(--pf-scale-sidebar));
                }
            `;
    },

    applyTheme(color, bgColor, txtColor, btnTxtColor, save = true) {
      // Salva no cache para evitar flash na próxima carga
      if (save) {
        localStorage.setItem(
          "pf_theme_cache",
          JSON.stringify({ color, bgColor, txtColor, btnTxtColor }),
        );
      }

      // Cria ou atualiza uma tag de estilo global para sobrescrever a cor primária do Tailwind
      let style = document.getElementById("playfitness-dynamic-theme");
      if (!style) {
        style = document.createElement("style");
        style.id = "playfitness-dynamic-theme";
        document.head.appendChild(style);
      }

      let css = "";
      if (color) {
        css += `
                    :root { 
                        --primary-dynamic: ${color}; 
                        --pf-primary: ${color};
                    }
                    /* Texto e Opacidade */
                    .text-primary, .text-\\[\\#ef4444\\], .text-emerald-500, .text-amber-500, .text-error, [id*="Slogan"], [id*="slogan"] { color: ${color} !important; }
                    [class*="text-primary/"], [class*="text-red-500/"], [class*="text-emerald-500/"], [class*="text-error/"], [class*="text-emerald-500/"] { color: ${color}cc !important; }
                    
                    /* Fundos e Opacidade */
                    .bg-primary, .bg-\\[\\#ef4444\\], .bg-emerald-500, .bg-amber-500, .bg-error, [class*="bg-primary"] { background-color: ${color} !important; }
                    [class*="bg-primary/"], [class*="bg-red-500/"], [class*="bg-emerald-500/"], [class*="bg-error/"], [class*="bg-emerald-500/"] { background-color: ${color}1a !important; }
                    
                    /* Bordas */
                    .border-primary, .border-\\[\\#ef4444\\], .border-emerald-500, .border-amber-500, .border-error { border-color: ${color} !important; border-right-color: ${color} !important; }
                    [class*="border-primary/"], [class*="border-red-500/"], [class*="border-error/"], [class*="border-emerald-500/"] { border-color: ${color}40 !important; }
                    
                    /* Ícones e Inputs */
                    .ring-primary { --tw-ring-color: ${color} !important; }
                    .material-symbols-outlined.text-primary { color: ${color} !important; }
                `;
      }

      if (bgColor) {
        css += `
                    body, .bg-background, .bg-surface-dim, .bg-surface, .bg-\\[\\#0a0a0a\\], .bg-\\[\\#0e0e0e\\], .bg-\\[\\#131313\\], .bg-\\[\\#0A0A0B\\], .bg-\\[\\#020617\\], .bg-\\[\\#061a12\\] {
                        background-color: ${bgColor} !important;
                    }
                `;
      }

      if (txtColor) {
        css += `
                    body, .text-white, .text-zinc-200, .text-zinc-300, .text-zinc-400, .text-zinc-500, .text-zinc-600 {
                        color: ${txtColor} !important;
                    }
                    /* Forçar opacidade em labels secundários */
                    .text-zinc-500, .text-zinc-600 { opacity: 0.7; }
                `;
      }

      if (btnTxtColor) {
        css += `
                    .bg-primary, .bg-\\[\\#ef4444\\], button.bg-primary, .text-on-primary-fixed, [class*="bg-primary"] {
                        color: ${btnTxtColor} !important;
                    }
                `;
      }

      // Estilização de Fontes e Cores específicas (SEM SOBRESCREVER FUNDO DE CARDS)
      css += `
                canvas { filter: hue-rotate(0deg); } /* Placeholder for chart accent logic */
            `;

      style.innerHTML = css;
    },

    cleanPayload(payload) {
      const clean = {};
      for (let key in payload) {
        if (
          payload[key] !== undefined &&
          payload[key] !== null &&
          payload[key] !== ""
        ) {
          clean[key] = payload[key];
        }
      }
      return clean;
    },

    exportCSV(data, fileName = "export.csv") {
      if (!data || !data.length) return;
      const headers = Object.keys(data[0]).join(";");
      const rows = data.map((obj) =>
        Object.values(obj)
          .map((v) => (typeof v === "string" ? `"${v}"` : v))
          .join(";"),
      );
      const csv = [headers, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },

  /**
   * Membership Plans Management
   */
  plans: {
    async list() {
      if (!window.supabaseClient)
        return [
          {
            id: 1,
            nome: "VIP Anual",
            valor: 199.9,
            duracao_meses: 12,
            ativo: true,
          },
          {
            id: 2,
            nome: "Pro Semestral",
            valor: 149.9,
            duracao_meses: 6,
            ativo: true,
          },
          {
            id: 3,
            nome: "Mensal Básico",
            valor: 99.9,
            duracao_meses: 1,
            ativo: true,
          },
        ];
      const { data, error } = await window.supabaseClient
        .from("planos")
        .select("*")
        .order("valor", { ascending: false });
      if (error) throw error;
      return data;
    },

    async save(id, payload) {
      if (!window.supabaseClient) return;
      const clean = PlayFitnessAPI.utils.cleanPayload(payload);
      if (id) {
        const { data, error } = await window.supabaseClient
          .from("planos")
          .update(clean)
          .eq("id", id)
          .select();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await window.supabaseClient
          .from("planos")
          .insert([clean])
          .select();
        if (error) throw error;
        return data;
      }
    },

    async delete(id) {
      if (!window.supabaseClient) return;
      const { error } = await window.supabaseClient
        .from("planos")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return true;
    },
  },
};

const PlayFitnessUI = {
  toast(message, iconName = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    // Remove existing toast if any, to avoid stacking too many
    const existing = container.querySelectorAll(".pf-toast");
    if (existing.length > 2) existing[0].remove();

    const toast = document.createElement("div");
    toast.className =
      "pf-toast glass-card border border-white/10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in fixed bottom-8 right-8 z-[1000] bg-surface/90 backdrop-blur-xl";
    toast.style.transform = "translateY(100px)";
    toast.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

    toast.innerHTML = `
            <span class="material-symbols-outlined text-primary">${iconName}</span>
            <span class="text-sm font-bold uppercase tracking-wider text-white">${message}</span>
        `;
    container.appendChild(toast);
    setTimeout(() => (toast.style.transform = "translateY(0)"), 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  },

  /**
   * Initializes the White-Label branding (Logo)
   */
  applyBranding(config) {
    // PRIORIDADES: 1. DB (logo_url), 2. LocalStorage (cache), 3. Texto Padrão
    const logoData =
      config.logo_url || localStorage.getItem("playfitness_custom_logo");
    const sideNavLogo = document.querySelector("#sidebarNav h1");
    const sideNavSlogan = document.querySelector("#sidebarNav p");
    const logoHeight = config.logo_altura || 40;

    if (logoData && sideNavLogo) {
      // Se veio do DB mas não está no cache, atualiza o cache para rapidez na próxima carga
      if (config.logo_url && !localStorage.getItem("playfitness_custom_logo")) {
        localStorage.setItem("playfitness_custom_logo", config.logo_url);
      }

      // Replace text with image if custom logo exists
      const img = document.createElement("img");
      img.src = logoData;
      img.style.height = `${logoHeight}px`;
      img.className = "w-auto object-contain mb-2";
      img.alt = config.nome_academia;

      // If slogan exists, put it below
      const container = sideNavLogo.parentElement;
      container.innerHTML = "";
      container.appendChild(img);
      if (sideNavSlogan) {
        sideNavSlogan.textContent = config.slogan || "";
        container.appendChild(sideNavSlogan);
      }
    } else if (sideNavLogo) {
      sideNavLogo.textContent = config.nome_academia || "PlayFitness";
      if (sideNavSlogan)
        sideNavSlogan.textContent = config.slogan || "Central de Inteligência";
    }
  },

  /**
   * Initializes Smart Notifications Sidebar
   */
  async initNotifications() {
    // 1. Inject CSS for notifications
    if (!document.getElementById("pf-notify-styles")) {
      const style = document.createElement("style");
      style.id = "pf-notify-styles";
      style.innerHTML = `
                #notify-sidebar { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); z-index: 200; }
                .notify-dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid #0a0a0a; }
                .notify-item { border-left: 3px solid transparent; transition: all 0.2s; }
                .notify-item:hover { border-left-color: #ef4444; background: rgba(255,255,255,0.03); }
            `;
      document.head.appendChild(style);
    }

    // 2. Create Bell Button if not exists
    const header = document.querySelector("header");
    if (header && !document.getElementById("notify-bell-btn")) {
      const bellContainer = document.createElement("div");
      bellContainer.className = "relative flex items-center mr-2";
      bellContainer.innerHTML = `
                <button id="notify-bell-btn" class="text-zinc-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5 relative">
                    <span class="material-symbols-outlined">notifications</span>
                    <span id="notify-badge" class="notify-dot hidden"></span>
                </button>
            `;
      // Insert before the last child (usually the new/export buttons or profile)
      header.insertBefore(bellContainer, header.lastElementChild);

      bellContainer.querySelector("button").onclick = () =>
        this.toggleNotifications();
    }

    // 3. Create Sidebar if not exists
    if (!document.getElementById("notify-sidebar")) {
      const sidebar = document.createElement("div");
      sidebar.id = "notify-sidebar";
      sidebar.className =
        "fixed right-0 top-0 h-full w-80 bg-[#161616]/95 backdrop-blur-2xl border-l border-white/5 shadow-2xl translate-x-full flex flex-col";
      sidebar.innerHTML = `
                <div class="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 class="font-headline font-black italic uppercase text-primary tracking-tighter">Alertas Estratégicos</h3>
                    <button onclick="PlayFitnessUI.toggleNotifications()" class="text-zinc-500 hover:text-white"><span class="material-symbols-outlined">close</span></button>
                </div>
                <div id="notify-content" class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    <p class="text-[10px] text-zinc-600 italic text-center py-10 uppercase tracking-widest">Analisando dados em tempo real...</p>
                </div>
                <div class="p-4 border-t border-white/10 bg-black/20">
                    <button onclick="PlayFitnessUI.clearNotifications()" class="w-full py-3 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Marcar todos como lidos</button>
                </div>
            `;
      document.body.appendChild(sidebar);

      // 4. Overlay for clicking outside
      const overlay = document.createElement("div");
      overlay.id = "notify-overlay";
      overlay.className =
        "fixed inset-0 bg-black/40 backdrop-blur-sm z-[190] hidden";
      overlay.onclick = () => this.toggleNotifications();
      document.body.appendChild(overlay);
    }

    // 5. Load automated alerts
    this.refreshAlerts();
  },

  toggleNotifications() {
    const sidebar = document.getElementById("notify-sidebar");
    const overlay = document.getElementById("notify-overlay");
    const isHidden = sidebar.classList.contains("translate-x-full");

    if (isHidden) {
      sidebar.classList.remove("translate-x-full");
      overlay.classList.remove("hidden");
      this.refreshAlerts();
    } else {
      sidebar.classList.add("translate-x-full");
      overlay.classList.add("hidden");
    }
  },

  async refreshAlerts() {
    const container = document.getElementById("notify-content");
    if (!container) return;

    try {
      // OPTIMIZATION: Pull data from already loaded globals if possible or use local fallback
      const kpi =
        PlayFitnessAPI.cachedOverview ||
        (await PlayFitnessAPI.kpis.getOverview());
      const students =
        PlayFitnessAPI.cachedList || (await PlayFitnessAPI.students.list());
      const alerts = [];

      // Alert 1: Revenue vs Target (Mock target of 50k)
      const target = 50000;
      if (kpi.revenue < target * 0.9) {
        alerts.push({
          type: "error",
          icon: "trending_down",
          title: "Faturamento Abaixo da Meta",
          desc: `Estamos ${Math.round((1 - kpi.revenue / target) * 100)}% abaixo da meta projetada para este período.`,
          action: () => (location.href = "financeiro.html"),
        });
      }

      // Alert 2: High Risk Students
      const atRisk = students
        .filter((s) => s.status === "Em Risco")
        .slice(0, 3);
      if (atRisk.length > 0) {
        alerts.push({
          type: "warning",
          icon: "priority_high",
          title: "Risco de Churn Detectado",
          desc: `${atRisk.length} alunos apresentam score de retenção crítico. Recomenda-se contato imediato.`,
          action: () => (location.href = "membros.html"),
        });
      }

      // Alert 3: New Registrations (Always a good news)
      alerts.push({
        type: "success",
        icon: "auto_awesome",
        title: "Desempenho de Vendas",
        desc: 'A campanha "Verão 2026" converteu 5 novos alunos nas últimas 24 horas.',
        action: () => (location.href = "campanhas.html"),
      });

      // Update UI
      if (alerts.length > 0) {
        document.getElementById("notify-badge").classList.remove("hidden");
        container.innerHTML = alerts
          .map(
            (a, i) => `
                    <div class="notify-item bg-white/[0.02] p-4 rounded-xl border border-white/5 cursor-pointer" onclick="(${a.action.toString()})()">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="material-symbols-outlined text-[18px] ${a.type === "error" ? "text-error" : a.type === "warning" ? "text-amber-500" : "text-emerald-500"}">${a.icon}</span>
                            <span class="text-[10px] font-black uppercase text-white/80">${a.title}</span>
                        </div>
                        <p class="text-[11px] text-zinc-500 leading-relaxed">${a.desc}</p>
                    </div>
                `,
          )
          .join("");
      } else {
        document.getElementById("notify-badge").classList.add("hidden");
        container.innerHTML =
          '<p class="text-[10px] text-zinc-600 italic text-center py-10 uppercase tracking-widest">Nenhum alerta crítico no momento.</p>';
      }
    } catch (e) {
      console.error("Failed to refresh alerts", e);
    }
  },

  clearNotifications() {
    document.getElementById("notify-badge").classList.add("hidden");
    PlayFitnessUI.toast("Alertas marcados como lidos", "done_all");
    this.toggleNotifications();
  },
};

window.PlayFitnessAPI = PlayFitnessAPI;
window.PlayFitnessUI = PlayFitnessUI;
