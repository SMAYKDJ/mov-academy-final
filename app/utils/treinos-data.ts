import type { MuscleData, WorkoutPlan, TreinosKPIData } from '@/types/treinos';

/**
 * Mock data for the Treinos module.
 * Deterministic data for SSR hydration safety.
 */

export const treinosKPIData: TreinosKPIData = {
  totalTreinos: 248,
  frequenciaSemanal: 4.2,
  musculoMaisTreinado: 'Peito',
  evolucao: 18.5,
  xpTotal: 12450,
  nivel: 24,
};

export const muscleMapData: MuscleData[] = [
  {
    grupo: 'peito',
    intensidade: 85,
    ultimoTreino: '12/04/2026',
    volumeSemanal: 18,
    exerciciosRelacionados: ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Cross-over'],
  },
  {
    grupo: 'costas',
    intensidade: 70,
    ultimoTreino: '11/04/2026',
    volumeSemanal: 16,
    exerciciosRelacionados: ['Puxada Frontal', 'Remada Curvada', 'Remada Cavalinho', 'Pulldown'],
  },
  {
    grupo: 'ombros',
    intensidade: 55,
    ultimoTreino: '10/04/2026',
    volumeSemanal: 12,
    exerciciosRelacionados: ['Desenvolvimento', 'Elevação Lateral', 'Elevação Frontal', 'Face Pull'],
  },
  {
    grupo: 'biceps',
    intensidade: 45,
    ultimoTreino: '11/04/2026',
    volumeSemanal: 9,
    exerciciosRelacionados: ['Rosca Direta', 'Rosca Alternada', 'Rosca Martelo', 'Rosca Scott'],
  },
  {
    grupo: 'triceps',
    intensidade: 40,
    ultimoTreino: '12/04/2026',
    volumeSemanal: 10,
    exerciciosRelacionados: ['Tríceps Polia', 'Tríceps Testa', 'Mergulho', 'Kickback'],
  },
  {
    grupo: 'abdomen',
    intensidade: 60,
    ultimoTreino: '13/04/2026',
    volumeSemanal: 15,
    exerciciosRelacionados: ['Abdominal Crunch', 'Prancha', 'Leg Raise', 'Oblíquo'],
  },
  {
    grupo: 'quadriceps',
    intensidade: 90,
    ultimoTreino: '09/04/2026',
    volumeSemanal: 20,
    exerciciosRelacionados: ['Agachamento', 'Leg Press', 'Cadeira Extensora', 'Hack Squat'],
  },
  {
    grupo: 'posterior',
    intensidade: 75,
    ultimoTreino: '09/04/2026',
    volumeSemanal: 14,
    exerciciosRelacionados: ['Stiff', 'Mesa Flexora', 'Cadeira Flexora', 'Good Morning'],
  },
  {
    grupo: 'panturrilha',
    intensidade: 25,
    ultimoTreino: '09/04/2026',
    volumeSemanal: 6,
    exerciciosRelacionados: ['Panturrilha em Pé', 'Panturrilha Sentado', 'Donkey Calf'],
  },
  {
    grupo: 'gluteos',
    intensidade: 65,
    ultimoTreino: '09/04/2026',
    volumeSemanal: 12,
    exerciciosRelacionados: ['Hip Thrust', 'Elevação Pélvica', 'Abdução', 'Bulgarian Split'],
  },
  {
    grupo: 'trapezio',
    intensidade: 35,
    ultimoTreino: '11/04/2026',
    volumeSemanal: 6,
    exerciciosRelacionados: ['Encolhimento', 'Remada Alta', 'Face Pull'],
  },
  {
    grupo: 'antebraco',
    intensidade: 20,
    ultimoTreino: '11/04/2026',
    volumeSemanal: 4,
    exerciciosRelacionados: ['Rosca Punho', 'Reverse Curl', 'Farmer Walk'],
  },
];

export const workoutPlansData: WorkoutPlan[] = [
  {
    id: 'plan-A',
    nome: 'Treino A — Peito e Tríceps',
    tipo: 'A',
    objetivo: 'hipertrofia',
    diasSemana: ['Segunda', 'Quinta'],
    tempoEstimado: '55 min',
    nivel: 'Intermediário',
    ativo: true,
    exercicios: [
      { id: 'e1', nome: 'Supino Reto (Barra)', grupoMuscular: 'peito', series: 4, repeticoes: '10-12', carga: '40kg/lado', descanso: '90s' },
      { id: 'e2', nome: 'Supino Inclinado (Halteres)', grupoMuscular: 'peito', series: 3, repeticoes: '12', carga: '28kg', descanso: '60s' },
      { id: 'e3', nome: 'Crucifixo Máquina', grupoMuscular: 'peito', series: 3, repeticoes: '15', carga: '45kg', descanso: '45s' },
      { id: 'e4', nome: 'Tríceps Polia (Corda)', grupoMuscular: 'triceps', series: 4, repeticoes: '12-15', carga: '35kg', descanso: '60s' },
      { id: 'e5', nome: 'Tríceps Testa', grupoMuscular: 'triceps', series: 3, repeticoes: '10', carga: '12kg/lado', descanso: '60s' },
      { id: 'e6', nome: 'Mergulho (Banco)', grupoMuscular: 'triceps', series: 3, repeticoes: '15', carga: 'Peso corporal', descanso: '45s' },
    ],
  },
  {
    id: 'plan-B',
    nome: 'Treino B — Costas e Bíceps',
    tipo: 'B',
    objetivo: 'hipertrofia',
    diasSemana: ['Terça', 'Sexta'],
    tempoEstimado: '50 min',
    nivel: 'Intermediário',
    ativo: true,
    exercicios: [
      { id: 'e7', nome: 'Puxada Frontal', grupoMuscular: 'costas', series: 4, repeticoes: '10-12', carga: '55kg', descanso: '90s' },
      { id: 'e8', nome: 'Remada Curvada', grupoMuscular: 'costas', series: 4, repeticoes: '10', carga: '30kg/lado', descanso: '90s' },
      { id: 'e9', nome: 'Remada Cavalinho', grupoMuscular: 'costas', series: 3, repeticoes: '12', carga: '40kg', descanso: '60s' },
      { id: 'e10', nome: 'Rosca Direta (Barra W)', grupoMuscular: 'biceps', series: 3, repeticoes: '10-12', carga: '25kg', descanso: '60s' },
      { id: 'e11', nome: 'Rosca Martelo', grupoMuscular: 'biceps', series: 3, repeticoes: '12', carga: '14kg', descanso: '45s' },
      { id: 'e12', nome: 'Rosca Scott (Máquina)', grupoMuscular: 'biceps', series: 3, repeticoes: '15', carga: '20kg', descanso: '45s' },
    ],
  },
  {
    id: 'plan-C',
    nome: 'Treino C — Pernas Completo',
    tipo: 'C',
    objetivo: 'hipertrofia',
    diasSemana: ['Quarta'],
    tempoEstimado: '65 min',
    nivel: 'Avançado',
    ativo: true,
    exercicios: [
      { id: 'e13', nome: 'Agachamento Livre', grupoMuscular: 'quadriceps', series: 5, repeticoes: '8-10', carga: '60kg/lado', descanso: '120s' },
      { id: 'e14', nome: 'Leg Press 45°', grupoMuscular: 'quadriceps', series: 4, repeticoes: '12', carga: '180kg', descanso: '90s' },
      { id: 'e15', nome: 'Cadeira Extensora', grupoMuscular: 'quadriceps', series: 3, repeticoes: '15', carga: '50kg', descanso: '60s' },
      { id: 'e16', nome: 'Stiff', grupoMuscular: 'posterior', series: 4, repeticoes: '10', carga: '30kg/lado', descanso: '90s' },
      { id: 'e17', nome: 'Mesa Flexora', grupoMuscular: 'posterior', series: 3, repeticoes: '12', carga: '40kg', descanso: '60s' },
      { id: 'e18', nome: 'Panturrilha em Pé', grupoMuscular: 'panturrilha', series: 4, repeticoes: '15-20', carga: '80kg', descanso: '30s' },
    ],
  },
  {
    id: 'plan-D',
    nome: 'Treino D — Ombros e Abdômen',
    tipo: 'D',
    objetivo: 'hipertrofia',
    diasSemana: ['Sábado'],
    tempoEstimado: '45 min',
    nivel: 'Iniciante',
    ativo: false,
    exercicios: [
      { id: 'e19', nome: 'Desenvolvimento Máquina', grupoMuscular: 'ombros', series: 4, repeticoes: '10-12', carga: '35kg', descanso: '60s' },
      { id: 'e20', nome: 'Elevação Lateral', grupoMuscular: 'ombros', series: 4, repeticoes: '15', carga: '10kg', descanso: '45s' },
      { id: 'e21', nome: 'Face Pull', grupoMuscular: 'ombros', series: 3, repeticoes: '15', carga: '20kg', descanso: '45s' },
      { id: 'e22', nome: 'Abdominal Crunch', grupoMuscular: 'abdomen', series: 4, repeticoes: '20', carga: 'Peso corporal', descanso: '30s' },
      { id: 'e23', nome: 'Prancha Isométrica', grupoMuscular: 'abdomen', series: 3, repeticoes: '45s', carga: '—', descanso: '30s' },
      { id: 'e24', nome: 'Leg Raise (Barra)', grupoMuscular: 'abdomen', series: 3, repeticoes: '15', carga: 'Peso corporal', descanso: '30s' },
    ],
  },
];
