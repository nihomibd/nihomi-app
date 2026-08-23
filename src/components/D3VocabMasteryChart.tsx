import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Sparkles, BookOpen, Layers, Award } from 'lucide-react';

interface CategoryData {
  category: string;
  categoryJa: string;
  mastered: number;
  total: number;
  color: string;
}

interface D3VocabMasteryChartProps {
  completedLessonsCount?: number;
  learnedKanjiCount?: number;
}

export const D3VocabMasteryChart: React.FC<D3VocabMasteryChartProps> = ({
  completedLessonsCount = 1,
  learnedKanjiCount = 12
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryData | null>(null);

  const baseMultiplier = Math.max(1, completedLessonsCount);

  const data: CategoryData[] = [
    {
      category: 'Core Nouns (বিশেষ্য)',
      categoryJa: '名詞',
      mastered: Math.min(180, 24 * baseMultiplier + 15),
      total: 180,
      color: '#DC2626' // Crimson
    },
    {
      category: 'Verbs & Te-Forms (ক্রিয়া)',
      categoryJa: '動詞',
      mastered: Math.min(120, 16 * baseMultiplier + 8),
      total: 120,
      color: '#F59E0B' // Tokyo Gold
    },
    {
      category: 'i/na Adjectives (বিশেষণ)',
      categoryJa: '形容詞',
      mastered: Math.min(75, 12 * baseMultiplier + 6),
      total: 75,
      color: '#10B981' // Emerald
    },
    {
      category: 'Particles & Structure (অনুসর্গ)',
      categoryJa: '助詞',
      mastered: Math.min(45, 8 * baseMultiplier + 10),
      total: 45,
      color: '#3B82F6' // Azure
    },
    {
      category: 'Essential Kanji Bank (কাঞ্জি)',
      categoryJa: '漢字',
      mastered: Math.min(120, Math.max(learnedKanjiCount, 14 * baseMultiplier)),
      total: 120,
      color: '#8B5CF6' // Royal Purple
    },
    {
      category: 'Daily Expressions (বাচনভঙ্গি)',
      categoryJa: '日常表現',
      mastered: Math.min(60, 10 * baseMultiplier + 8),
      total: 60,
      color: '#EC4899' // Sakura Pink
    }
  ];

  const totalMastered = data.reduce((acc, curr) => acc + curr.mastered, 0);
  const totalItems = data.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = Math.round((totalMastered / totalItems) * 100);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 550;
    const height = 280;
    const margin = { top: 20, right: 30, bottom: 40, left: 140 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X and Y scales
    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, innerHeight])
      .padding(0.28);

    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);

    // Background track bars
    g.selectAll('.track-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'track-bar')
      .attr('y', (d) => yScale(d.category) || 0)
      .attr('x', 0)
      .attr('height', yScale.bandwidth())
      .attr('width', innerWidth)
      .attr('rx', 6)
      .attr('fill', '#F3F4F6');

    // Gradient definitions
    const defs = svg.append('defs');
    data.forEach((d, idx) => {
      const gradient = defs
        .append('linearGradient')
        .attr('id', `grad-${idx}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d.color)
        .attr('stop-opacity', 0.75);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d.color)
        .attr('stop-opacity', 1);
    });

    // Animated fill bars
    g.selectAll('.fill-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'fill-bar')
      .attr('y', (d) => yScale(d.category) || 0)
      .attr('x', 0)
      .attr('height', yScale.bandwidth())
      .attr('rx', 6)
      .attr('fill', (_, idx) => `url(#grad-${idx})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => setHoveredCategory(d))
      .on('mouseleave', () => setHoveredCategory(null))
      .attr('width', 0)
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => xScale((d.mastered / d.total) * 100));

    // Category labels (Y-Axis)
    g.selectAll('.category-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'category-label')
      .attr('y', (d) => (yScale(d.category) || 0) + yScale.bandwidth() / 2 + 4)
      .attr('x', -10)
      .attr('text-anchor', 'end')
      .attr('fill', '#374151')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text((d) => d.category);

    // Percentage value text at the end of each bar
    g.selectAll('.pct-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'pct-label')
      .attr('y', (d) => (yScale(d.category) || 0) + yScale.bandwidth() / 2 + 4)
      .attr('x', (d) => Math.max(xScale((d.mastered / d.total) * 100) + 8, 12))
      .attr('fill', '#1F2937')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .text((d) => `${Math.round((d.mastered / d.total) * 100)}% (${d.mastered}/${d.total})`);

  }, [completedLessonsCount, learnedKanjiCount]);

  return (
    <div
      id="nihomi-d3-vocab-mastery-chart"
      ref={containerRef}
      className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>D3.js Data Engine</span>
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Minna no Nihongo & JLPT Vocabulary Tracking
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-stone-900">
            Vocabulary & Kanji Retention Breakdown (শব্দভাণ্ডার ডিস্ট্রিবিউশন)
          </h2>
        </div>

        {/* Global Mastery Stat Card */}
        <div className="flex items-center gap-3 bg-stone-50 px-4 py-2 rounded-2xl border border-stone-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Overall Mastery</span>
            <span className="text-base font-extrabold text-red-600 font-mono">{overallPercentage}%</span>
          </div>
          <div className="w-px h-7 bg-stone-200" />
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Words Learned</span>
            <span className="text-base font-extrabold text-stone-800 font-mono">{totalMastered}/{totalItems}</span>
          </div>
        </div>
      </div>

      {/* D3 Render Area */}
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} className="w-full h-auto max-w-full block" />
      </div>

      {/* Hover Insight Drawer */}
      {hoveredCategory && (
        <div className="p-3.5 rounded-2xl bg-stone-900 text-white text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: hoveredCategory.color }}
            />
            <span className="font-bold">{hoveredCategory.category}</span>
            <span className="font-serif text-stone-300">({hoveredCategory.categoryJa})</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-amber-400 font-bold">
              {Math.round((hoveredCategory.mastered / hoveredCategory.total) * 100)}% Mastered
            </span>
            <span className="text-stone-400">
              {hoveredCategory.mastered} of {hoveredCategory.total} items
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
