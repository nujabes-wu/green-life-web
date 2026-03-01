'use client';

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BarChart, Utensils } from 'lucide-react';
import { CalculationInput } from '@/lib/calculator/engine';

interface ConsumptionFormProps {
  data: CalculationInput['consumption'];
  // Simplified onChange for consumption since it's flatter
  onDietChange: (value: string) => void;
  onPrev: () => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

export function ConsumptionForm({ data, onDietChange, onPrev, onCalculate, isCalculating }: ConsumptionFormProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-6 border-0 p-6 rounded-[2rem] bg-slate-50/80 dark:bg-slate-800/40 transition-all hover:shadow-xl hover:shadow-primary/5 border border-white/60 shadow-inner group">
          <h3 className="font-black flex items-center text-lg text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
            <div className="bg-primary/10 p-1.5 rounded-lg mr-3 group-hover:bg-primary group-hover:text-white transition-all">
              <Utensils className="h-5 w-5" />
            </div>
            个人饮食习惯
          </h3>
          <RadioGroup 
             value={data.diet} 
             onValueChange={onDietChange}
             className="grid grid-cols-1 gap-4"
          >
             <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/90 border border-slate-100 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group/item relative overflow-hidden">
                <RadioGroupItem value="meatHeavy" id="meat" className="border-2 text-primary focus:ring-4 focus:ring-primary/10 w-5 h-5" />
                <Label htmlFor="meat" className="flex-1 font-black text-base text-slate-700 cursor-pointer flex justify-between items-center">
                   <span>🥩 肉食为主</span>
                   <span className="text-[10px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full uppercase tracking-widest">高碳排</span>
                </Label>
                <div className="absolute inset-0 bg-orange-500/0 group-hover/item:bg-orange-500/[0.02] transition-colors pointer-events-none" />
             </div>
             <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/90 border border-slate-100 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group/item relative overflow-hidden">
                <RadioGroupItem value="balanced" id="balanced" className="border-2 text-primary focus:ring-4 focus:ring-primary/10 w-5 h-5" />
                <Label htmlFor="balanced" className="flex-1 font-black text-base text-slate-700 cursor-pointer flex justify-between items-center">
                   <span>🥗 均衡饮食</span>
                   <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-widest">中等碳排</span>
                </Label>
                <div className="absolute inset-0 bg-blue-500/0 group-hover/item:bg-blue-500/[0.02] transition-colors pointer-events-none" />
             </div>
             <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/90 border border-slate-100 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group/item relative overflow-hidden">
                <RadioGroupItem value="vegetarian" id="veg" className="border-2 text-primary focus:ring-4 focus:ring-primary/10 w-5 h-5" />
                <Label htmlFor="veg" className="flex-1 font-black text-base text-slate-700 cursor-pointer flex justify-between items-center">
                   <span>🥦 素食为主</span>
                   <span className="text-[10px] font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-widest">低碳排</span>
                </Label>
                <div className="absolute inset-0 bg-green-500/0 group-hover/item:bg-green-500/[0.02] transition-colors pointer-events-none" />
             </div>
          </RadioGroup>
          <p className="text-[10px] font-bold text-muted-foreground/60 text-center italic mt-3">
            * 饮食选择对个人碳足迹有显著影响，畜牧业是全球主要的温室气体来源之一。
          </p>
       </div>

       <div className="flex gap-4">
         <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black border-slate-200 hover:bg-slate-50 transition-all text-slate-600" onClick={onPrev}>上一步</Button>
         <Button className="flex-[2] h-14 rounded-2xl text-lg font-black shadow-[0_20px_40px_-10px_rgba(127,191,95,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(127,191,95,0.5)] hover:-translate-y-1 transition-all duration-300" onClick={onCalculate} disabled={isCalculating}>
            {isCalculating ? (
              <span className="flex items-center">
                <BarChart className="animate-spin h-5 w-5 mr-2" /> 计算中...
              </span>
            ) : (
              <span className="flex items-center">
                生成报告 <Utensils className="ml-2 h-5 w-5" />
              </span>
            )}
         </Button>
      </div>
    </div>
  );
}
