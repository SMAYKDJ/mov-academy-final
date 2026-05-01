'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import type { MuscleGroup, MuscleData } from '@/types/treinos';

interface BodyProgressProps {
  muscleData: MuscleData[];
  onMuscleClick?: (muscle: MuscleData) => void;
}

/**
 * Label map for Portuguese display.
 */
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

/**
 * Returns a color based on muscle intensity (0-100).
 */
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

/**
 * Hotspot zones mapped to percentage positions on the body-muscles.png image.
 * Each zone is positioned relative to the full image as (left%, top%, width%, height%).
 * 
 * The image has two figures:
 *   FRONT VIEW (left ~0-48% of image)
 *   BACK VIEW  (right ~52-100% of image)
 */
interface HotspotZone {
  grupo: MuscleGroup;
  label: string;
  view: 'front' | 'back';
  // Coordenadas % relativas ao contêiner de imagem completo
  left: number;
  top: number;
  width: number;
  height: number;
}

const hotspotZones: HotspotZone[] = [
  // ====== FRONT VIEW ======
  // Trapézio (front — upper shoulders/neck)
  { grupo: 'trapezio', label: 'Trapézio', view: 'front', left: 12, top: 12, width: 8, height: 8 },
  { grupo: 'trapezio', label: 'Trapézio', view: 'front', left: 28, top: 12, width: 8, height: 8 },

  // Ombros (front deltoids)
  { grupo: 'ombros', label: 'Ombros', view: 'front', left: 6, top: 18, width: 7, height: 10 },
  { grupo: 'ombros', label: 'Ombros', view: 'front', left: 34, top: 18, width: 7, height: 10 },

  // Peito
  { grupo: 'peito', label: 'Peito', view: 'front', left: 13, top: 18, width: 22, height: 11 },

  // Bíceps
  { grupo: 'biceps', label: 'Bíceps', view: 'front', left: 3, top: 28, width: 7, height: 12 },
  { grupo: 'biceps', label: 'Bíceps', view: 'front', left: 37, top: 28, width: 7, height: 12 },

  // Abdômen
  { grupo: 'abdomen', label: 'Abdômen', view: 'front', left: 15, top: 30, width: 18, height: 16 },

  // Antebraço (front)
  { grupo: 'antebraco', label: 'Antebraço', view: 'front', left: 1, top: 38, width: 6, height: 12 },
  { grupo: 'antebraco', label: 'Antebraço', view: 'front', left: 40, top: 38, width: 6, height: 12 },

  // Quadríceps
  { grupo: 'quadriceps', label: 'Quadríceps', view: 'front', left: 10, top: 50, width: 12, height: 22 },
  { grupo: 'quadriceps', label: 'Quadríceps', view: 'front', left: 26, top: 50, width: 12, height: 22 },

  // Panturrilha (front — shins/calves)
  { grupo: 'panturrilha', label: 'Panturrilha', view: 'front', left: 10, top: 74, width: 10, height: 16 },
  { grupo: 'panturrilha', label: 'Panturrilha', view: 'front', left: 28, top: 74, width: 10, height: 16 },

  // ====== BACK VIEW ======
  // Trapézio (back — upper back/neck)
  { grupo: 'trapezio', label: 'Trapézio', view: 'back', left: 60, top: 12, width: 8, height: 8 },
  { grupo: 'trapezio', label: 'Trapézio', view: 'back', left: 76, top: 12, width: 8, height: 8 },

  // Ombros (rear deltoids)
  { grupo: 'ombros', label: 'Ombros', view: 'back', left: 54, top: 18, width: 7, height: 10 },
  { grupo: 'ombros', label: 'Ombros', view: 'back', left: 83, top: 18, width: 7, height: 10 },

  // Costas (upper + lower)
  { grupo: 'costas', label: 'Costas', view: 'back', left: 61, top: 18, width: 22, height: 22 },

  // Tríceps (back of arms)
  { grupo: 'triceps', label: 'Tríceps', view: 'back', left: 52, top: 28, width: 7, height: 12 },
  { grupo: 'triceps', label: 'Tríceps', view: 'back', left: 85, top: 28, width: 7, height: 12 },

  // Antebraço (back)
  { grupo: 'antebraco', label: 'Antebraço', view: 'back', left: 49, top: 38, width: 6, height: 12 },
  { grupo: 'antebraco', label: 'Antebraço', view: 'back', left: 89, top: 38, width: 6, height: 12 },

  // Glúteos
  { grupo: 'gluteos', label: 'Glúteos', view: 'back', left: 61, top: 44, width: 22, height: 10 },

  // Posterior (hamstrings)
  { grupo: 'posterior', label: 'Posterior', view: 'back', left: 58, top: 54, width: 12, height: 18 },
  { grupo: 'posterior', label: 'Posterior', view: 'back', left: 74, top: 54, width: 12, height: 18 },

  // Panturrilha (back — calves)
  { grupo: 'panturrilha', label: 'Panturrilha', view: 'back', left: 58, top: 74, width: 10, height: 16 },
  { grupo: 'panturrilha', label: 'Panturrilha', view: 'back', left: 76, top: 74, width: 10, height: 16 },
];

/**
 * BodyProgress — Interactive human body muscle heatmap using the anatomical illustration.
 * Overlay hotspots on top of the image provide hover tooltips and click-to-detail feedback.
 */
export function BodyProgress({ muscleData, onMuscleClick }: BodyProgressProps) {
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleData | null>(null);

  const getMuscleData = (grupo: MuscleGroup): MuscleData | undefined => {
    return muscleData.find(m => m.grupo === grupo);
  };

  const handleMouseEnter = (zone: HotspotZone) => {
    const data = getMuscleData(zone.grupo);
    if (data) {
      setHoveredMuscle(data);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-[#1e2235] p-6 relative">
      <div className="flex flex-col xl:flex-row items-start gap-8">
        {/* Imagem do Mapa Corporal com Pontos de Interesse */}
        <div className="body-map-container relative flex-shrink-0 w-full xl:w-auto mx-auto" style={{ maxWidth: '660px' } as React.CSSProperties}>
          {/* View Labels */}
          <div className="flex justify-between px-12 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Frontal</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Posterior</span>
          </div>

          {/* Image Container */}
          <div className="relative">
            <Image
              src="/body-muscles.png"
              alt="Mapa anatômico muscular — visão frontal e posterior"
              width={660}
              height={700}
              className="w-full h-auto object-contain select-none pointer-events-none"
              priority
            />

            {/* Hotspot overlays */}
            {hotspotZones.map((zone, idx) => {
              const data = getMuscleData(zone.grupo);
              const intensity = data?.intensidade ?? 0;
              const color = getIntensityColor(intensity);
              const isHovered = hoveredMuscle?.grupo === zone.grupo;
              const shouldGlow = intensity >= 20 && !isHovered;

              // Converter hex para rgba para efeitos de brilho
              const hexToRgba = (hex: string, alpha: number) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r},${g},${b},${alpha})`;
              };

              return (
                <button
                  key={`${zone.grupo}-${zone.view}-${idx}`}
                  className={cn(
                    "absolute rounded-lg transition-all duration-300 cursor-pointer border-2",
                    isHovered
                      ? "border-white dark:border-white shadow-lg scale-105 z-10"
                      : "border-transparent hover:border-white/60"
                  )}
                  style={{
                    left: `${zone.left}%`,
                    top: `${zone.top}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                    '--muscle-bg': isHovered ? `${color}40` : `${color}20`,
                    background: 'var(--muscle-bg)',
                    ...(shouldGlow ? {
                      '--glow-dur': intensity >= 80 ? '1.2s' : intensity >= 60 ? '1.8s' : '2.5s',
                      animation: 'muscle-glow var(--glow-dur) ease-in-out infinite',
                      '--glow-color': hexToRgba(color, 0.4),
                      '--glow-bg': hexToRgba(color, 0.12),
                      '--glow-bg-peak': hexToRgba(color, 0.35),
                    } : {}),
                  } as React.CSSProperties}
                  onMouseEnter={() => handleMouseEnter(zone)}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => {
                    if (data && onMuscleClick) onMuscleClick(data);
                  }}
                  aria-label={`${zone.label}: ${intensity}% intensidade`}
                />
              );
            })}

          </div>
        </div>

        {/* Legend + Muscle List Panel */}
        <div className="flex-1 w-full space-y-6 min-w-0">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Mapa de Condicionamento</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">Passe o mouse sobre um grupo muscular para ver detalhes</p>
          </div>

          {/* Color Legend */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Escala de Intensidade</p>
            <div className="flex items-center gap-1">
              {[
                { color: '#d1d5db', label: 'Nenhum' },
                { color: '#3b82f6', label: 'Leve' },
                { color: '#22c55e', label: 'Moderado' },
                { color: '#f97316', label: 'Intenso' },
                { color: '#ef4444', label: 'Sobrecarga' },
              ].map(item => (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-3 rounded-full" style={{ background: `var(--legend-c, ${item.color})` } as React.CSSProperties} />
                  <span className="text-[9px] font-bold text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Muscle List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Grupos Musculares</p>
            {muscleData
              .sort((a, b) => b.intensidade - a.intensidade)
              .map(muscle => (
                <button
                  key={muscle.grupo}
                  onClick={() => onMuscleClick?.(muscle)}
                  onMouseEnter={() => setHoveredMuscle(muscle)}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group text-left",
                    hoveredMuscle?.grupo === muscle.grupo
                      ? "bg-gray-100 dark:bg-[#1a1d27] shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-[#1a1d27]"
                  )}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0f1117]"
                    style={{ background: `var(--muscle-c, ${getIntensityColor(muscle.intensidade)})` } as React.CSSProperties}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{labelMap[muscle.grupo]}</p>
                    <p className="text-[10px] text-gray-400">{muscle.ultimoTreino} · {muscle.volumeSemanal} séries/sem</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: `var(--muscle-c, ${getIntensityColor(muscle.intensidade)})` } as React.CSSProperties}>
                      {muscle.intensidade}%
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{getIntensityLabel(muscle.intensidade)}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
