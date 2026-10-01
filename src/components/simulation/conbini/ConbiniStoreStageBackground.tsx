// src/components/simulation/conbini/ConbiniStoreStageBackground.tsx
import React from 'react';
import { ConbiniBrandConfig } from '../../../data/conbiniBrands';
import { Store, ShieldCheck, Clock, Camera } from 'lucide-react';

interface ConbiniStoreStageBackgroundProps {
  brand: ConbiniBrandConfig;
  children: React.ReactNode;
}

export const ConbiniStoreStageBackground: React.FC<ConbiniStoreStageBackgroundProps> = ({
  brand,
  children
}) => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl">
      {/* 1. Overhead Store Canopy & Brand Fascia Stripes */}
      <div className="relative border-b-4 border-slate-900 overflow-hidden shadow-lg select-none">
        {/* Brand Tri-Color Striping Bar */}
        <div className="flex h-3 w-full">
          {brand.fasciaStripe.map((color, idx) => (
            <div
              key={idx}
              className="flex-1 h-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Store Signboard Ribbon */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* Brand Logo Silhouette Pill */}
            <div
              className="px-3 py-1 rounded-xl text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md flex items-center gap-1.5"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <Store className="w-4 h-4" />
              <span>{brand.nameJa}</span>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs font-black text-slate-100 flex items-center gap-2">
                <span>{brand.storeLocationJa}</span>
                <span className="text-[10px] font-mono text-amber-400 bg-black/60 px-1.5 py-0.2 rounded border border-slate-700">
                  {brand.storeCode}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {brand.storeLocationBn} • レジカウンター 01番
              </div>
            </div>
          </div>

          {/* Store Ambient Readouts: Surveillance, Clock, Cleanliness */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1 text-emerald-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>防犯カメラ作動中</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-300 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>24時間営業</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Convenience Store Background Ambiance (Gondola Shelves & Cooler Section) */}
      <div className="relative bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950">
        {/* Fluorescent Ceiling Light Panels Simulation */}
        <div className="absolute top-0 left-0 right-0 h-10 flex justify-around pointer-events-none opacity-40">
          <div className="w-48 h-3 bg-gradient-to-b from-white/80 to-transparent blur-xs rounded-full"></div>
          <div className="w-48 h-3 bg-gradient-to-b from-white/80 to-transparent blur-xs rounded-full"></div>
          <div className="w-48 h-3 bg-gradient-to-b from-white/80 to-transparent blur-xs rounded-full"></div>
        </div>

        {/* Realistic Gondola Store Shelves Illustration in Soft Focus Background */}
        <div className="px-4 pt-3 pb-1 border-b border-slate-800/80 bg-slate-950/70 select-none overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5 px-1">
            <span className="flex items-center gap-1">
              <span>🏪</span>
              <span>店内陳列棚 (Store Shelves & Walk-in Drink Coolers)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              お〜いお茶 • 午後の紅茶 • サンドイッチ • おにぎり
            </span>
          </div>

          {/* Shelves Items Row */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 opacity-85">
            {/* Onigiri Rack */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center shadow-xs">
              <span className="text-xl">🍙</span>
              <span className="text-[10px] font-bold text-slate-200 mt-0.5">鮭おにぎり</span>
              <span className="text-[9px] font-mono text-amber-400">¥160</span>
            </div>

            {/* Tuna Mayo */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center shadow-xs">
              <span className="text-xl">🍙</span>
              <span className="text-[10px] font-bold text-slate-200 mt-0.5">ツナマヨ</span>
              <span className="text-[9px] font-mono text-amber-400">¥150</span>
            </div>

            {/* Sandwich */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center shadow-xs">
              <span className="text-xl">🥪</span>
              <span className="text-[10px] font-bold text-slate-200 mt-0.5">たまごサンド</span>
              <span className="text-[9px] font-mono text-amber-400">¥298</span>
            </div>

            {/* Bento */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center shadow-xs">
              <span className="text-xl">🍱</span>
              <span className="text-[10px] font-bold text-slate-200 mt-0.5">から揚げ弁当</span>
              <span className="text-[9px] font-mono text-amber-400">¥590</span>
            </div>

            {/* Green Tea */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center shadow-xs">
              <span className="text-xl">🍵</span>
              <span className="text-[10px] font-bold text-slate-200 mt-0.5">綾鷹 緑茶</span>
              <span className="text-[9px] font-mono text-emerald-400">¥160</span>
            </div>

            {/* Milk Tea */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center shadow-xs">
              <span className="text-xl">🧋</span>
              <span className="text-[10px] font-bold text-slate-200 mt-0.5">午後の紅茶</span>
              <span className="text-[9px] font-mono text-emerald-400">¥170</span>
            </div>

            {/* Boss Coffee */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center shadow-xs">
              <span className="text-xl">☕</span>
              <span className="text-[10px] font-bold text-slate-200 mt-0.5">BOSS 贅沢微糖</span>
              <span className="text-[9px] font-mono text-amber-400">¥140</span>
            </div>

            {/* Dessert / Sweets */}
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center shadow-xs">
              <span className="text-xl">🧁</span>
              <span className="text-[10px] font-bold text-slate-200 mt-0.5">シュークリーム</span>
              <span className="text-[9px] font-mono text-amber-400">¥150</span>
            </div>
          </div>
        </div>

        {/* 3. The Countertop Perspective Workspace Area (Children Layer) */}
        <div className="p-4 sm:p-6 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
