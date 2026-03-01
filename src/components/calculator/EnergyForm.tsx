'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Zap, Flame } from 'lucide-react';
import { CalculationInput } from '@/lib/calculator/engine';

interface EnergyFormProps {
  data: CalculationInput['energy'];
  onChange: (category: keyof CalculationInput, subCategory: string, field: string, value: string | number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function EnergyForm({ data, onChange, onNext, onPrev }: EnergyFormProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-4 border-0 p-6 rounded-[2rem] bg-slate-50/80 dark:bg-slate-800/40 transition-all hover:shadow-xl hover:shadow-primary/5 border border-white/60 shadow-inner group">
         <h3 className="font-black flex items-center text-lg text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
            <div className="bg-primary/10 p-1.5 rounded-lg mr-3 group-hover:bg-primary group-hover:text-white transition-all">
              <Zap className="h-5 w-5" />
            </div>
            家庭电力消耗
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label className="font-black text-xs uppercase tracking-widest text-slate-500 ml-1">所在电网区域</Label>
               <Select 
                 value={data.electricity.region}
                 onChange={(e) => onChange('energy', 'electricity', 'region', e.target.value)}
                 className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
               >
                  <option value="nationalAvg">🌏 全国平均水平</option>
                  <option value="northChina">🏛️ 华北区域电网</option>
                  <option value="eastChina">🏙️ 华东区域电网</option>
                  <option value="southChina">🌴 南方区域电网</option>
               </Select>
               <p className="text-[10px] font-bold text-primary/70 mt-1 ml-1">💡 不同区域的清洁能源占比影响排放因子</p>
            </div>
            <div className="space-y-2">
               <Label className="font-black text-xs uppercase tracking-widest text-slate-500 ml-1">月均用电量 (kWh)</Label>
               <div className="relative">
                 <Input 
                   type="number" 
                   placeholder="0"
                   value={data.electricity.amount || ''}
                   onChange={(e) => onChange('energy', 'electricity', 'amount', Number(e.target.value))}
                   className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-black text-lg pl-5"
                 />
                 <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">度</div>
               </div>
            </div>
         </div>
      </div>

      <div className="space-y-4 border-0 p-6 rounded-[2rem] bg-slate-50/80 dark:bg-slate-800/40 transition-all hover:shadow-xl hover:shadow-primary/5 border border-white/60 shadow-inner group">
         <h3 className="font-black flex items-center text-lg text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
            <div className="bg-primary/10 p-1.5 rounded-lg mr-3 group-hover:bg-primary group-hover:text-white transition-all">
              <Flame className="h-5 w-5" />
            </div>
            燃气/燃料消耗
         </h3>
         <div className="space-y-2">
            <Label className="font-black text-xs uppercase tracking-widest text-slate-500 ml-1">天然气使用量 (立方米/月)</Label>
            <div className="relative">
              <Input 
                type="number"
                placeholder="0"
                value={data.gas?.naturalGas || ''}
                onChange={(e) => onChange('energy', 'gas', 'naturalGas', Number(e.target.value))}
                className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-black text-lg pl-5"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">m³</div>
            </div>
         </div>
      </div>

      <div className="flex gap-4">
         <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black border-slate-200 hover:bg-slate-50 transition-all text-slate-600" onClick={onPrev}>上一步</Button>
         <Button className="flex-[2] h-14 rounded-2xl text-lg font-black shadow-[0_20px_40px_-10px_rgba(127,191,95,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(127,191,95,0.5)] hover:-translate-y-1 transition-all duration-300" onClick={onNext}>
            继续：生活消费偏好 <Zap className="ml-2 h-5 w-5" />
         </Button>
      </div>
    </div>
  );
}
