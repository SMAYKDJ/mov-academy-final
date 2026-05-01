'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import type { MuscleGroup, MuscleData } from '@/types/treinos';

interface BodyProgressProps {
  muscleData: MuscleData[];
  onMuscleClick?: (muscle: MuscleData) => void;
}

const labelMap: Record<MuscleGroup, string> = {
  peito: 'Peito',
  costas: 'Costas',
  ombros: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  abdomen: 'Abdômen',
  quadriceps: 'Quadríceps',
  posterior: 'Posterior',
  panturrilha: 'Panturrilha',
  gluteos: 'Glúteos',
  antebraco: 'Antebraço',
  trapezio: 'Trapézio',
};

const getIntensityColor = (value: number): string => {
  if (value >= 80) return '#ef4444';
  if (value >= 60) return '#f97316';
  if (value >= 40) return '#22c55e';
  if (value >= 20) return '#3b82f6';
  return '#d1d5db';
};

const getIntensityLabel = (value: number): string => {
  if (value >= 80) return 'Sobrecarga';
  if (value >= 60) return 'Intenso';
  if (value >= 40) return 'Moderado';
  if (value >= 20) return 'Leve';
  return 'Não treinado';
};

interface HotspotZone {
  grupo: MuscleGroup;
  label: string;
  view: 'front' | 'back';
  d: string;
}

/**
 * Refined Organic Muscle Paths
 * ViewBox: 660 x 700
 */
const hotspotZones: HotspotZone[] = [
  // FRONT VIEW
  {
    grupo: 'trapezio',
    label: 'Trapézio',
    view: 'front',
    d: 'M142,102 C150,90 180,90 188,102 L188,125 C180,115 150,115 142,125 Z M202,102 C210,90 240,90 248,102 L248,125 C240,115 210,115 202,125 Z',
  },
  {
    grupo: 'ombros',
    label: 'Ombros',
    view: 'front',
    d: 'M110,140 C100,160 100,190 115,200 L135,190 C145,170 145,150 135,135 Z M280,140 C290,160 290,190 275,200 L255,190 C245,170 245,150 255,135 Z',
  },
  {
    grupo: 'peito',
    label: 'Peito',
    view: 'front',
    d: 'M145,140 Q195,130 245,140 L245,210 Q195,230 145,210 Z',
  },
  {
    grupo: 'biceps',
    label: 'Bíceps',
    view: 'front',
    d: 'M95,205 Q85,245 100,285 L125,280 Q135,240 125,205 Z M295,205 Q305,245 290,285 L265,280 Q255,240 265,205 Z',
  },
  {
    grupo: 'abdomen',
    label: 'Abdômen',
    view: 'front',
    d: 'M158,225 C185,220 205,220 232,225 L232,340 C205,350 185,350 158,340 Z',
  },
  {
    grupo: 'antebraco',
    label: 'Antebraço',
    view: 'front',
    d: 'M80,300 Q70,350 85,400 L110,390 Q120,340 110,295 Z M310,300 Q320,350 305,400 L280,390 Q270,340 280,295 Z',
  },
  {
    grupo: 'quadriceps',
    label: 'Quadríceps',
    view: 'front',
    d: 'M148,365 C135,450 145,520 160,550 L190,540 C205,480 200,420 192,365 Z M242,365 C255,450 245,520 230,550 L200,540 C185,480 190,420 198,365 Z',
  },
  {
    grupo: 'panturrilha',
    label: 'Panturrilha',
    view: 'front',
    d: 'M155,570 Q145,620 160,670 L185,660 Q195,610 185,565 Z M235,570 Q245,620 230,670 L205,660 Q195,610 205,565 Z',
  },

  // BACK VIEW
  {
    grupo: 'trapezio',
    label: 'Trapézio',
    view: 'back',
    d: 'M442,102 C450,90 480,90 488,102 L488,125 C480,115 450,115 442,125 Z M502,102 C510,90 540,90 548,102 L548,125 C540,115 510,115 502,125 Z',
  },
  {
    grupo: 'ombros',
    label: 'Ombros',
    view: 'back',
    d: 'M410,140 C400,160 400,190 415,200 L435,190 C445,170 445,150 435,135 Z M580,140 C590,160 590,190 575,200 L555,190 C545,170 545,150 555,135 Z',
  },
  {
    grupo: 'costas',
    label: 'Costas',
    view: 'back',
    d: 'M445,140 Q495,120 545,140 L545,310 Q495,330 445,310 Z',
  },
  {
    grupo: 'triceps',
    label: 'Tríceps',
    view: 'back',
    d: 'M395,205 Q385,245 400,285 L425,280 Q435,240 425,205 Z M595,205 Q605,245 590,285 L565,280 Q555,240 565,205 Z',
  },
  {
    grupo: 'gluteos',
    label: 'Glúteos',
    view: 'back',
    d: 'M445,325 Q495,310 545,325 L545,410 Q495,430 445,410 Z',
  },
  {
    grupo: 'posterior',
    label: 'Posterior',
    view: 'back',
    d: 'M448,425 C435,490 445,540 460,560 L490,550 C505,500 500,450 492,425 Z M542,425 C555,490 545,540 530,560 L500,550 C485,500 490,450 498,425 Z',
  },
  {
    grupo: 'panturrilha',
    label: 'Panturrilha',
    view: 'back',
    d: 'M455,570 Q445,620 460,670 L485,660 Q495,610 485,565 Z M535,570 Q545,620 530,670 L505,660 Q495,610 505,565 Z',
  },
  {
    grupo: 'antebraco',
    label: 'Antebraço',
    view: 'back',
    d: 'M380,300 Q370,350 385,400 L410,390 Q420,340 410,295 Z M610,300 Q620,350 605,400 L580,390 Q570,340 580,295 Z',
  },
];

export function BodyProgress({ muscleData, onMuscleClick }: BodyProgressProps) {
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleData | null>(null);

  const getMuscleData = (grupo: MuscleGroup): MuscleData | undefined => {
    return muscleData.find(m => m.grupo === grupo);
  };

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-3xl border border-gray-100 dark:border-[#1e2235] p-4 sm:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all w-full">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
        {/* Interactive SVG Body Map */}
        <div className="relative w-full max-w-[500px] xl:max-w-[600px] shrink-0 group/map">
          {/* View Labels */}
          <div className="flex justify-between px-8 mb-6">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 dark:text-gray-500">Visão</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">Frontal</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 dark:text-gray-500">Visão</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">Posterior</span>
            </div>
          </div>

          <div className="relative aspect-[660/700] w-full">
            <Image
              src="/body-muscles.png"
              alt="Body Muscle Map"
              fill
              className="object-contain pointer-events-none drop-shadow-2xl opacity-90 group-hover/map:opacity-100 transition-opacity"
              priority
            />

            {/* SVG Interaction Layer */}
            <svg
              viewBox="0 0 660 700"
              className="absolute inset-0 w-full h-full drop-shadow-sm"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.05))' }}
            >
              {hotspotZones.map((zone, idx) => {
                const data = getMuscleData(zone.grupo);
                const intensity = data?.intensidade ?? 0;
                const color = getIntensityColor(intensity);
                const isHovered = hoveredMuscle?.grupo === zone.grupo;
                const shouldGlow = intensity >= 20;

                return (
                  <path
                    key={`${zone.grupo}-${zone.view}-${idx}`}
                    d={zone.d}
                    className={cn(
                      "transition-all duration-500 cursor-pointer pointer-events-auto outline-none",
                      isHovered 
                        ? "stroke-white stroke-[3px] drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" 
                        : "stroke-transparent"
                    )}
                    style={{
                      fill: isHovered ? `${color}dd` : `${color}44`,
                      ...(shouldGlow && !isHovered && {
                        animation: `muscle-pulse ${intensity >= 80 ? '2s' : '4s'} ease-in-out infinite`,
                        opacity: 0.7 + (intensity / 300)
                      } as any),
                    }}
                    onMouseEnter={() => setHoveredMuscle(data || null)}
                    onMouseLeave={() => setHoveredMuscle(null)}
                    onClick={() => data && onMuscleClick?.(data)}
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Subtle decoration */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent rounded-full opacity-50" />
        </div>

        {/* Info Panel */}
        <div className="flex-1 w-full flex flex-col gap-8 min-w-0">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Mapa Muscular
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto lg:mx-0">
              Passe o mouse para analisar a densidade de treino e volume semanal por grupo muscular.
            </p>
          </div>

          {/* Intensity Legend */}
          <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5">
            <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500 mb-4">Escala de Volume</p>
            <div className="flex items-center gap-2">
              {[
                { color: '#d1d5db', label: 'Inativo' },
                { color: '#3b82f6', label: 'Leve' },
                { color: '#22c55e', label: 'Meta' },
                { color: '#f97316', label: 'Alta' },
                { color: '#ef4444', label: 'Pico' },
              ].map(item => (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-2.5 rounded-full shadow-inner" style={{ background: item.color }} />
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Muscle List with improved design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
            {muscleData
              .sort((a, b) => b.intensidade - a.intensidade)
              .map(muscle => (
                <button
                  key={muscle.grupo}
                  onClick={() => onMuscleClick?.(muscle)}
                  onMouseEnter={() => setHoveredMuscle(muscle)}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border text-left group",
                    hoveredMuscle?.grupo === muscle.grupo
                      ? "bg-white dark:bg-[#1a1d27] border-primary-500 shadow-xl shadow-primary-500/10 -translate-y-1 scale-[1.02]"
                      : "bg-white dark:bg-[#0f1117] border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10"
                  )}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0 ring-4 ring-offset-4 ring-white dark:ring-offset-[#0f1117] transition-transform duration-500 group-hover:scale-125"
                    style={{ background: getIntensityColor(muscle.intensidade) }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">
                      {labelMap[muscle.grupo]}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-gray-400">{muscle.volumeSemanal} sets</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="text-[10px] font-bold text-gray-400 truncate">{muscle.ultimoTreino}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black leading-none" style={{ color: getIntensityColor(muscle.intensidade) }}>
                      {muscle.intensidade}%
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes muscle-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
        }
      `}</style>
    </div>
  );
}
