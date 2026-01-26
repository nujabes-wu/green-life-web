'use client';

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Utensils } from 'lucide-react';
import { CalculationInput } from '@/lib/calculator/engine';

interface ConsumptionFormProps {
  data: CalculationInput['consumption'];
  // Simplified onChange for consumption since it's flatter
  onDietChange: (value: any) => void;
  onPrev: () => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

export function ConsumptionForm({ data, onDietChange, onPrev, onCalculate, isCalculating }: ConsumptionFormProps) {
  return (
    <div className="space-y-6">
       <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
          <h3 className="font-semibold flex items-center"><Utensils className="h-4 w-4 mr-2 text-primary" /> 饮食习惯</h3>
          <RadioGroup 
             value={data.diet} 
             onValueChange={onDietChange}
          >
             <div className="flex items-center space-x-2">
                <RadioGroupItem value="meatHeavy" id="meat" />
                <Label htmlFor="meat">肉食为主 (高碳排)</Label>
             </div>
             <div className="flex items-center space-x-2">
                <RadioGroupItem value="balanced" id="balanced" />
                <Label htmlFor="balanced">均衡饮食 (中碳排)</Label>
             </div>
             <div className="flex items-center space-x-2">
                <RadioGroupItem value="vegetarian" id="veg" />
                <Label htmlFor="veg">素食为主 (低碳排)</Label>
             </div>
          </RadioGroup>
       </div>

       <div className="flex gap-3">
         <Button variant="outline" className="flex-1" onClick={onPrev}>上一步</Button>
         <Button className="flex-1" size="lg" onClick={onCalculate} disabled={isCalculating}>
            {isCalculating ? '计算中...' : '生成分析报告'}
         </Button>
      </div>
    </div>
  );
}
