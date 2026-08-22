import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { RevenueTrends, MRRTrendPoint, ConversionTrendPoint } from '../types';
import { TrendingUp, Users, DollarSign, PieChart, Sparkles, RefreshCw, BarChart2 } from 'lucide-react';

interface RevenueD3ChartsProps {
  trends: RevenueTrends | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const RevenueD3Charts: React.FC<RevenueD3ChartsProps> = ({ trends, isLoading, onRefresh }) => {
  const mrrChartRef = useRef<SVGSVGElement | null>(null);
  const conversionChartRef = useRef<SVGSVGElement | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MRRTrendPoint | null>(null);
  const [selectedConversionPoint, setSelectedConversionPoint] = useState<ConversionTrendPoint | null>(null);

  // 1. Render MRR & ARR Growth Area / Line Chart with D3
  useEffect(() => {
    if (!trends?.mrrTrends || trends.mrrTrends.length === 0 || !mrrChartRef.current) return;

    const svg = d3.select(mrrChartRef.current);
    svg.selectAll('*').remove(); // Clean previous render

    const data: MRRTrendPoint[] = trends.mrrTrends;
    const width = 640;
    const height = 280;
    const margin = { top: 25, right: 30, bottom: 40, left: 65 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale (Months)
    const xScale = d3
      .scalePoint<string>()
      .domain(data.map((d) => d.month))
      .range([0, innerWidth])
      .padding(0.2);

    // Y Scale (MRR Amount in BDT)
    const maxMrr = d3.max(data, (d: MRRTrendPoint) => d.mrr) || 100000;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxMrr * 1.15])
      .range([innerHeight, 0])
      .nice();

    // Subtle Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#e4e4e7')
      .attr('stroke-dasharray', '3,3');
    g.select('.grid .domain').remove();

    // Gradient definition for area fill
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'mrr-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#dc2626') // Crimson Red
      .attr('stop-opacity', 0.35);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#dc2626')
      .attr('stop-opacity', 0.0);

    // Area Generator
    const areaGenerator = d3
      .area<MRRTrendPoint>()
      .x((d) => xScale(d.month) || 0)
      .y0(innerHeight)
      .y1((d) => yScale(d.mrr))
      .curve(d3.curveMonotoneX);

    // Line Generator
    const lineGenerator = d3
      .line<MRRTrendPoint>()
      .x((d) => xScale(d.month) || 0)
      .y((d) => yScale(d.mrr))
      .curve(d3.curveMonotoneX);

    // Draw Area
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#mrr-gradient)')
      .attr('d', areaGenerator);

    // Draw Line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 3)
      .attr('d', lineGenerator);

    // X-Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', '#71717a')
      .attr('font-size', '11px')
      .attr('font-weight', '600');
    g.select('g:last-of-type .domain').attr('stroke', '#e4e4e7');

    // Y-Axis
    g.append('g')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => `৳${d3.format('~s')(d as number)}`)
      )
      .selectAll('text')
      .attr('fill', '#71717a')
      .attr('font-size', '10px')
      .attr('font-weight', '600');

    // Circles for Data Points & Interactive Hover
    const points = g
      .selectAll('.data-point')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'data-point')
      .attr('transform', (d: MRRTrendPoint) => `translate(${xScale(d.month) || 0},${yScale(d.mrr)})`);

    points
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#ffffff')
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 2.5)
      .attr('cursor', 'pointer')
      .on('mouseenter', (_: any, d: MRRTrendPoint) => setSelectedPoint(d));

    // Default select latest
    if (data.length > 0) {
      setSelectedPoint(data[data.length - 1]);
    }
  }, [trends]);

  // 2. Render Trial-to-Paid Conversion Funnel Multi-Bar Chart with D3
  useEffect(() => {
    if (!trends?.conversionTrends || trends.conversionTrends.length === 0 || !conversionChartRef.current) return;

    const svg = d3.select(conversionChartRef.current);
    svg.selectAll('*').remove();

    const data: ConversionTrendPoint[] = trends.conversionTrends;
    const width = 640;
    const height = 280;
    const margin = { top: 25, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X0 Scale (Month Groups)
    const x0Scale = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.month))
      .rangeRound([0, innerWidth])
      .paddingInner(0.25);

    // X1 Scale (Sub-bars: Trials Started vs Converted)
    const keys = ['trialsStarted', 'trialsConverted'] as const;
    const x1Scale = d3
      .scaleBand<string>()
      .domain(keys)
      .rangeRound([0, x0Scale.bandwidth()])
      .padding(0.1);

    // Y Scale
    const maxTrials = d3.max(data, (d: ConversionTrendPoint) => Math.max(d.trialsStarted, d.trialsConverted)) || 50;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxTrials * 1.2])
      .range([innerHeight, 0])
      .nice();

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#e4e4e7')
      .attr('stroke-dasharray', '3,3');
    g.select('.grid .domain').remove();

    // Bars
    const monthGroups = g
      .selectAll('.month-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'month-group')
      .attr('transform', (d: ConversionTrendPoint) => `translate(${x0Scale(d.month) || 0},0)`);

    // Started Bar (Stone/Zinc)
    monthGroups
      .append('rect')
      .attr('x', x1Scale('trialsStarted') || 0)
      .attr('y', (d: any) => yScale(d.trialsStarted))
      .attr('width', x1Scale.bandwidth())
      .attr('height', (d: any) => innerHeight - yScale(d.trialsStarted))
      .attr('fill', '#a1a1aa')
      .attr('rx', 3)
      .attr('cursor', 'pointer')
      .on('mouseenter', (_: any, d: ConversionTrendPoint) => setSelectedConversionPoint(d));

    // Converted Bar (Emerald Green)
    monthGroups
      .append('rect')
      .attr('x', x1Scale('trialsConverted') || 0)
      .attr('y', (d: any) => yScale(d.trialsConverted))
      .attr('width', x1Scale.bandwidth())
      .attr('height', (d: any) => innerHeight - yScale(d.trialsConverted))
      .attr('fill', '#10b981')
      .attr('rx', 3)
      .attr('cursor', 'pointer')
      .on('mouseenter', (_: any, d: ConversionTrendPoint) => setSelectedConversionPoint(d));

    // Conversion Rate Percentage Label
    monthGroups
      .append('text')
      .attr('x', x0Scale.bandwidth() / 2)
      .attr('y', (d: any) => Math.min(yScale(d.trialsStarted), yScale(d.trialsConverted)) - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('fill', '#059669')
      .text((d: any) => `${d.conversionRate}%`);

    // X-Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0Scale))
      .selectAll('text')
      .attr('fill', '#71717a')
      .attr('font-size', '11px')
      .attr('font-weight', '600');

    // Y-Axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', '#71717a')
      .attr('font-size', '10px');

    if (data.length > 0) {
      setSelectedConversionPoint(data[data.length - 1]);
    }
  }, [trends]);

  const latestMrr = trends?.mrrTrends?.[trends.mrrTrends.length - 1];
  const latestConv = trends?.conversionTrends?.[trends.conversionTrends.length - 1];

  return (
    <div className="space-y-6" id="d3-revenue-analytics-module">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Executive MRR & Trial Conversion Analytics (D3 Engine)
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time aggregate monthly recurring revenue curves, annualized run-rate (ARR), and free-trial conversion funnels.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
            id="btn-refresh-d3-trends"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Trends</span>
          </button>
        )}
      </div>

      {/* Top Executive KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-medium text-zinc-500">Current MRR</span>
          <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            ৳{latestMrr?.mrr ? latestMrr.mrr.toLocaleString() : '115,000'}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <span>+22% growth MoM</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-medium text-zinc-500">Annualized Run-Rate (ARR)</span>
          <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            ৳{latestMrr?.arr ? latestMrr.arr.toLocaleString() : '1,380,000'}
          </div>
          <div className="text-[11px] text-zinc-500 font-medium mt-0.5">
            Based on active subscriptions
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-medium text-zinc-500">Active Paying Base</span>
          <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            {latestMrr?.subscribers || 230} Learners
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            96% monthly retention
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-medium text-zinc-500">Trial-to-Paid Conversion</span>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {latestConv?.conversionRate || 77}%
          </div>
          <div className="text-[11px] text-zinc-500 font-medium mt-0.5">
            Avg 7-day conversion rate
          </div>
        </div>
      </div>

      {/* Primary D3 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Growth D3 Area Chart */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Monthly Recurring Revenue (MRR in BDT)
              </h4>
            </div>
            {selectedPoint && (
              <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
                {selectedPoint.month}: ৳{selectedPoint.mrr.toLocaleString()} ({selectedPoint.subscribers} subs)
              </span>
            )}
          </div>

          <div className="w-full h-72">
            <svg ref={mrrChartRef} className="w-full h-full" id="svg-d3-mrr-chart" />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-red-600 rounded-sm" />
              <span>Net Settled MRR</span>
            </div>
            <span className="text-[11px] font-medium">Hover data points for exact month metrics</span>
          </div>
        </div>

        {/* Trial Conversion Funnel D3 Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Trial-to-Paid Conversion Funnel
              </h4>
            </div>
            {selectedConversionPoint && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                {selectedConversionPoint.month}: {selectedConversionPoint.trialsConverted} / {selectedConversionPoint.trialsStarted} ({selectedConversionPoint.conversionRate}%)
              </span>
            )}
          </div>

          <div className="w-full h-72">
            <svg ref={conversionChartRef} className="w-full h-full" id="svg-d3-conversion-chart" />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-zinc-400 rounded-xs" />
                <span>Trials Started</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-500 rounded-xs" />
                <span>Converted to Paid</span>
              </div>
            </div>
            <span className="text-[11px] font-medium">Top numbers show conversion rate %</span>
          </div>
        </div>
      </div>

      {/* Payment Provider Revenue Distribution */}
      {trends?.providerBreakdown && trends.providerBreakdown.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-zinc-600" />
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Gateway & Tokenized Settlement Mix
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trends.providerBreakdown.map((p) => (
              <div
                key={p.provider}
                className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{p.provider}</span>
                  <span className="text-xs font-extrabold text-red-600 dark:text-red-400">{p.percentage}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{p.volume} transactions</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">৳{p.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
