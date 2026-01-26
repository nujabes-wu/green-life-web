'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Car, Bus, Plane } from 'lucide-react';
import { CalculationInput } from '@/lib/calculator/engine';

interface TransportFormProps {
  data: CalculationInput['transport'];
  onChange: (category: keyof CalculationInput, subCategory: string, field: string, value: any) => void;
  onNext: () => void;
}

export function TransportForm({ data, onChange, onNext }: TransportFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
        <h3 className="font-semibold flex items-center"><Car className="h-4 w-4 mr-2 text-primary" /> 私家车 (每周)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>车辆类型</Label>
            <Select 
              value={data.privateCar?.type} 
              onChange={(e) => onChange('transport', 'privateCar', 'type', e.target.value)}
            >
              <option value="gasoline">汽油车</option>
              <option value="diesel">柴油车</option>
              <option value="electric">电动车</option>
            </Select>
          </div>
          {data.privateCar?.type !== 'electric' && (
            <div>
              <Label>排量大小</Label>
              <Select 
                 value={data.privateCar?.size}
                 onChange={(e) => onChange('transport', 'privateCar', 'size', e.target.value)}
              >
                <option value="small">1.6L 以下</option>
                <option value="medium">1.6 - 2.0L</option>
                <option value="large">2.0L 以上</option>
              </Select>
            </div>
          )}
          <div className="col-span-2">
            <Label>行驶里程 (km/周)</Label>
            <Input 
              type="number" 
              value={data.privateCar?.distance || ''}
              onChange={(e) => onChange('transport', 'privateCar', 'distance', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
        <h3 className="font-semibold flex items-center"><Bus className="h-4 w-4 mr-2 text-primary" /> 公共交通 (每周)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>地铁/轻轨 (km)</Label>
            <Input 
              type="number" 
              value={data.public?.subway || ''}
              onChange={(e) => onChange('transport', 'public', 'subway', Number(e.target.value))}
            />
          </div>
          <div>
            <Label>公交车 (km)</Label>
            <Input 
              type="number" 
              value={data.public?.bus || ''}
              onChange={(e) => onChange('transport', 'public', 'bus', Number(e.target.value))}
            />
          </div>
          <div>
            <Label>出租/网约车 (km)</Label>
            <Input 
              type="number" 
              value={data.public?.taxi || ''}
              onChange={(e) => onChange('transport', 'public', 'taxi', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
        <h3 className="font-semibold flex items-center"><Plane className="h-4 w-4 mr-2 text-primary" /> 航空出行 (每年)</h3>
        <div className="grid grid-cols-2 gap-4">
           <div>
              <Label>舱位等级</Label>
              <Select 
                 value={data.flight?.class}
                 onChange={(e) => onChange('transport', 'flight', 'class', e.target.value)}
              >
                 <option value="economy">经济舱</option>
                 <option value="business">商务舱</option>
                 <option value="first">头等舱</option>
              </Select>
           </div>
           <div className="col-span-2 grid grid-cols-3 gap-2">
              <div>
                 <Label className="text-xs">短途 (&lt;500km)</Label>
                 <Input type="number" placeholder="次" 
                    value={data.flight?.short || ''}
                    onChange={(e) => onChange('transport', 'flight', 'short', Number(e.target.value))}
                 />
              </div>
              <div>
                 <Label className="text-xs">中途 (500-1500)</Label>
                 <Input type="number" placeholder="次"
                    value={data.flight?.medium || ''}
                    onChange={(e) => onChange('transport', 'flight', 'medium', Number(e.target.value))}
                 />
              </div>
              <div>
                 <Label className="text-xs">长途 (&gt;1500km)</Label>
                 <Input type="number" placeholder="次"
                    value={data.flight?.long || ''}
                    onChange={(e) => onChange('transport', 'flight', 'long', Number(e.target.value))}
                 />
              </div>
           </div>
        </div>
      </div>
      
      <Button className="w-full" onClick={onNext}>下一步：家庭能源</Button>
    </div>
  );
}
