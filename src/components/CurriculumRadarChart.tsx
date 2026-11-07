import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip 
} from 'recharts';
import { AcademicBlock } from '../types';
import { Sparkles, Award, Compass, TrendingUp } from 'lucide-react';

interface CurriculumRadarChartProps {
  blocks: AcademicBlock[];
  blockScores: Record<string, { correct: number; total: number; passed: boolean; completedAt: string }>;
  overallProgress?: number;
}

export const CurriculumRadarChart: React.FC<CurriculumRadarChartProps> = ({
  blocks,
  blockScores,
  overallProgress = 0
}) => {
  // Transform blocks and student evaluation scores into radar data points
  const radarData = blocks.map((blk) => {
    const score = blockScores[blk.id];
    const correct = score ? score.correct : 0;
    const total = score ? score.total : 5;
    const percentage = score ? Math.round((correct / total) * 100) : 0;
    
    // Short clean title for the radar spokes
    const cleanTitle = blk.title
      .replace(/^Bloque\s+[IVX]+:\s*/i, '')
      .replace(/^(Fundamentos\s+de\s+|Construcción\s+de\s+)/i, '');
    
    const shortLabel = `B${blk.blockNumber}: ${cleanTitle.length > 18 ? cleanTitle.slice(0, 16) + '…' : cleanTitle}`;

    return {
      blockId: blk.id,
      blockNumber: blk.blockNumber,
      fullTitle: blk.title,
      subject: shortLabel,
      completado: percentage,
      calificacion: score ? `${correct}/${total}` : '0/5',
      estado: score?.passed ? (correct === 5 ? 'Acreditado (100%)' : 'Aprobado') : (percentage > 0 ? 'En Desarrollo' : 'Pendiente'),
      fullMark: 100
    };
  });

  // Calculate average proficiency across all modules
  const totalPercentage = radarData.reduce((acc, curr) => acc + curr.completado, 0);
  const averageProficiency = radarData.length > 0 ? Math.round(totalPercentage / radarData.length) : 0;

  // Custom Dark Obsidian + Gold Tooltip
  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0e1017]/95 border border-[#d4af37]/60 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center space-x-1.5 text-[#f5e2a3] font-bold font-serif-gold border-b border-[#c5a059]/30 pb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Bloque {data.blockNumber}</span>
          </div>
          <p className="text-white font-medium text-[11px] leading-tight">
            {data.fullTitle}
          </p>
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-zinc-400">Dominio / Progreso:</span>
            <span className="text-[#d4af37] font-bold font-mono text-sm">{data.completado}%</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-400">Reactivos Aprobados:</span>
            <span className="text-zinc-200 font-mono">{data.calificacion}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-zinc-800">
            <span className="text-zinc-400">Estado:</span>
            <span className={`font-semibold ${
              data.completado >= 80 ? 'text-emerald-400' : data.completado > 0 ? 'text-amber-400' : 'text-zinc-500'
            }`}>
              {data.estado}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-[#c5a059]/40 bg-gradient-to-b from-[#13151f] via-[#0d0e14] to-[#111219] p-4 sm:p-6 shadow-xl relative overflow-hidden">
      
      {/* Decorative ambient gold radial light */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#856524]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#c5a059]/20 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold font-serif-gold text-white flex items-center space-x-2">
              <span>Radar de Competencias Curriculares</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e2a3] font-mono">
                Recharts Radar
              </span>
            </h4>
            <p className="text-[11px] text-zinc-400 font-light">
              Proyección poligonal del nivel de maestría alcanzado en cada módulo del plan de estudios.
            </p>
          </div>
        </div>

        {/* Global Competency Badge */}
        <div className="flex items-center space-x-2 self-start sm:self-auto bg-black/60 px-3 py-1.5 rounded-xl border border-zinc-800">
          <TrendingUp className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-[11px] text-zinc-400">Dominio Promedio:</span>
          <span className="text-sm font-extrabold font-mono text-[#f5e2a3]">
            {averageProficiency}%
          </span>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Metric Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Radar Chart Stage (7 Cols) */}
        <div className="lg:col-span-7 h-[280px] sm:h-[320px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              {/* Gold Polished Polar Grid */}
              <PolarGrid stroke="#4a3f23" strokeDasharray="3 3" />
              
              {/* Polar Angle Axis (Labels for each module) */}
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#f5e2a3', fontSize: 10, fontWeight: 600, fontFamily: 'Cinzel, serif' }} 
              />
              
              {/* Polar Radius Axis (0% to 100% scale) */}
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#c5a059', fontSize: 9, fontFamily: 'monospace' }}
                stroke="#665324"
              />
              
              {/* Radar Area Polygon with Luxury Gold Fill */}
              <Radar
                name="Progreso Curricular"
                dataKey="completado"
                stroke="#d4af37"
                strokeWidth={2}
                fill="#d4af37"
                fillOpacity={0.45}
                dot={{ r: 4, fill: '#f5e2a3', stroke: '#856524', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#d4af37', strokeWidth: 2 }}
              />
              
              <Tooltip content={<CustomRadarTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Competency Breakdown & Legend Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-[#c5a059] font-mono tracking-wider block">
            Índice de Rendimiento por Bloque:
          </span>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
            {radarData.map((item) => (
              <div 
                key={item.blockId}
                className="p-2.5 rounded-xl bg-black/50 border border-zinc-800/80 hover:border-[#d4af37]/40 transition flex items-center justify-between text-xs group"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    item.completado >= 80 ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : item.completado > 0 ? 'bg-[#d4af37]' : 'bg-zinc-700'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-white font-medium text-[11px] truncate group-hover:text-[#f5e2a3] transition">
                      {item.fullTitle}
                    </p>
                    <span className="text-[9px] text-zinc-400 font-mono">
                      Aciertos: {item.calificacion}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className={`text-xs font-bold font-mono ${
                    item.completado >= 80 ? 'text-emerald-400' : item.completado > 0 ? 'text-[#d4af37]' : 'text-zinc-500'
                  }`}>
                    {item.completado}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
            <span>Escala Mínima Aprobatoria: <strong>80% (4/5)</strong></span>
            <span className="text-[#d4af37] font-semibold">100% = Distinción Honorífica</span>
          </div>

        </div>

      </div>

    </div>
  );
};
