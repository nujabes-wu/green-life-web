'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Car, Bus, Plane } from 'lucide-react';
import { CalculationInput } from '@/lib/calculator/engine';

interface TransportFormProps {
  data: CalculationInput['transport'];
  onChange: (category: keyof CalculationInput, subCategory: string, field: string, value: string | number) => void;
  onNext: () => void;
}

export function TransportForm({ data, onChange, onNext }: TransportFormProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-4 border-0 p-6 rounded-[2rem] bg-slate-50/80 dark:bg-slate-800/40 transition-all hover:shadow-xl hover:shadow-primary/5 border border-white/60 shadow-inner group">
        <h3 className="font-black flex items-center text-lg text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
          <div className="bg-primary/10 p-1.5 rounded-lg mr-3 group-hover:bg-primary group-hover:text-white transition-all">
            <Car className="h-5 w-5" />
          </div>
          私家车出行 (每周)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-black text-xs uppercase tracking-widest text-slate-500 ml-1">车辆能源类型</Label>
            <Select 
              value={data.privateCar?.type} 
              onChange={(e) => onChange('transport', 'privateCar', 'type', e.target.value)}
              className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
            >
              <option value="gasoline">⛽ 汽油车</option>
              <option value="diesel">🚜 柴油车</option>
              <option value="electric">⚡ 电动车</option>
            </Select>
          </div>
          {data.privateCar?.type !== 'electric' && (
            <div className="space-y-2">
              <Label className="font-black text-xs uppercase tracking-widest text-slate-500 ml-1">排量规格</Label>
              <Select 
                 value={data.privateCar?.size}
                 onChange={(e) => onChange('transport', 'privateCar', 'size', e.target.value)}
                 className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
              >
                <option value="small">🚗 1.6L 以下 (小型)</option>
                <option value="medium">🚙 1.6 - 2.0L (中型)</option>
                <option value="large">🏎️ 2.0L 以上 (大型)</option>
              </Select>
            </div>
          )}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label className="font-black text-xs uppercase tracking-widest text-slate-500 ml-1">预计行驶里程 (km/周)</Label>
            <div className="relative">
              <Input 
                type="number" 
                placeholder="输入具体数值"
                value={data.privateCar?.distance || ''}
                onChange={(e) => onChange('transport', 'privateCar', 'distance', Number(e.target.value))}
                className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-black text-lg pl-5"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">km</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-0 p-6 rounded-[2rem] bg-slate-50/80 dark:bg-slate-800/40 transition-all hover:shadow-xl hover:shadow-primary/5 border border-white/60 shadow-inner group">
        <h3 className="font-black flex items-center text-lg text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
          <div className="bg-primary/10 p-1.5 rounded-lg mr-3 group-hover:bg-primary group-hover:text-white transition-all">
            <Bus className="h-5 w-5" />
          </div>
          公共交通工具 (每周)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="font-black text-xs uppercase tracking-widest text-slate-500 ml-1">地铁/轻轨 (km)</Label>
            <Input 
              type="number" 
              placeholder="0"
              value={data.public?.subway || ''}
              onChange={(e) => onChange('transport', 'public', 'subway', Number(e.target.value))}
              className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-black text-base"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black text-xs uppercase tracking-widest text-slate-500 ml-1">公交车 (km)</Label>
            <Input 
              type="number" 
              placeholder="0"
              value={data.public?.bus || ''}
              onChange={(e) => onChange('transport', 'public', 'bus', Number(e.target.value))}
              className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-black text-base"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black text-xs uppercase tracking-widest text-slate-500 ml-1">出租/网约车 (km)</Label>
            <Input 
              type="number" 
              placeholder="0"
              value={data.public?.taxi || ''}
              onChange={(e) => onChange('transport', 'public', 'taxi', Number(e.target.value))}
              className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-black text-base"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 border-0 p-6 rounded-[2rem] bg-slate-50/80 dark:bg-slate-800/40 transition-all hover:shadow-xl hover:shadow-primary/5 border border-white/60 shadow-inner group">
        <h3 className="font-black flex items-center text-lg text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
          <div className="bg-primary/10 p-1.5 rounded-lg mr-3 group-hover:bg-primary group-hover:text-white transition-all">
            <Plane className="h-5 w-5" />
          </div>
          长途航空出行 (每年)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
              <Label className="font-black text-xs uppercase tracking-widest text-slate-500 ml-1">首选舱位等级</Label>
              <Select 
                 value={data.flight?.class}
                 onChange={(e) => onChange('transport', 'flight', 'class', e.target.value)}
                 className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
              >
                 <option value="economy">🎫 经济舱</option>
                 <option value="business">💼 商务舱</option>
                 <option value="first">👑 头等舱</option>
              </Select>
           </div>
           <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-3">
              <div className="space-y-2">
                 <Label className="font-black text-[9px] sm:text-[10px] uppercase tracking-tighter text-slate-500 ml-1">短途 (&lt;500km)</Label>
                 <Input type="number" placeholder="次" 
                    value={data.flight?.short || ''}
                    onChange={(e) => onChange('transport', 'flight', 'short', Number(e.target.value))}
                    className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-black text-base"
                 />
              </div>
              <div className="space-y-2">
                 <Label className="font-black text-[9px] sm:text-[10px] uppercase tracking-tighter text-slate-500 ml-1">中途 (500-1500)</Label>
                 <Input type="number" placeholder="次"
                    value={data.flight?.medium || ''}
                    onChange={(e) => onChange('transport', 'flight', 'medium', Number(e.target.value))}
                    className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-black text-base"
                 />
              </div>
              <div className="space-y-2">
                 <Label className="font-black text-[9px] sm:text-[10px] uppercase tracking-tighter text-slate-500 ml-1">长途 (&gt;1500km)</Label>
                 <Input type="number" placeholder="次"
                    value={data.flight?.long || ''}
                    onChange={(e) => onChange('transport', 'flight', 'long', Number(e.target.value))}
                    className="rounded-xl h-12 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-black text-base"
                 />
              </div>
           </div>
        </div>
      </div>
      
      <Button className="w-full h-14 rounded-2xl text-lg font-black shadow-[0_20px_40px_-10px_rgba(127,191,95,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(127,191,95,0.5)] hover:-translate-y-1 transition-all duration-300" onClick={onNext}>
        继续：家庭能源分析 <Car className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
