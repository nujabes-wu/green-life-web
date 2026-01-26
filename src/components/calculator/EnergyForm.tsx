'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Zap, Flame } from 'lucide-react';
import { CalculationInput } from '@/lib/calculator/engine';

interface EnergyFormProps {
  data: CalculationInput['energy'];
  onChange: (category: keyof CalculationInput, subCategory: string, field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function EnergyForm({ data, onChange, onNext, onPrev }: EnergyFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
         <h3 className="font-semibold flex items-center"><Zap className="h-4 w-4 mr-2 text-primary" /> 电力消耗</h3>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <Label>所在区域</Label>
               <Select 
                 value={data.electricity.region}
                 onChange={(e) => onChange('energy', 'electricity', 'region', e.target.value)}
               >
                  <option value="nationalAvg">全国平均</option>
                  <option value="northChina">华北区域</option>
                  <option value="eastChina">华东区域</option>
                  <option value="southChina">南方区域</option>
               </Select>
               <p className="text-xs text-muted-foreground mt-1">不同区域电网排放因子不同</p>
            </div>
            <div>
               <Label>月度用电 (kWh)</Label>
               <Input 
                 type="number" 
                 value={data.electricity.amount || ''}
                 onChange={(e) => onChange('energy', 'electricity', 'amount', Number(e.target.value))}
               />
            </div>
         </div>
      </div>

      <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
         <h3 className="font-semibold flex items-center"><Flame className="h-4 w-4 mr-2 text-primary" /> 燃气消耗</h3>
         <div>
            <Label>天然气 (立方米/月)</Label>
            <Input 
              type="number"
              value={data.gas?.naturalGas || ''}
              onChange={(e) => onChange('energy', 'gas', 'naturalGas', Number(e.target.value))}
            />
         </div>
      </div>

      <div className="flex gap-3">
         <Button variant="outline" className="flex-1" onClick={onPrev}>上一步</Button>
         <Button className="flex-1" onClick={onNext}>下一步：生活消费</Button>
      </div>
    </div>
  );
}
