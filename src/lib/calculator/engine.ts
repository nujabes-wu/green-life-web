import { CARBON_FACTORS, Region, CarType, CarSize, FlightClass } from '@/data/carbon-factors';

export interface CalculationInput {
  // 交通
  transport: {
    privateCar?: {
      type: CarType;
      size?: CarSize; // 燃油车
      distance: number; // km/week
    };
    public?: {
      subway: number; // km/week
      bus: number; // km/week
      taxi: number; // km/week
    };
    flight?: {
      short: number; // 次/年
      medium: number; // 次/年
      long: number; // 次/年
      class: FlightClass;
    };
  };
  // 能源
  energy: {
    electricity: {
      amount: number; // kWh/month
      region: Region;
    };
    gas?: {
      naturalGas: number; // m3/month
    };
  };
  // 消费
  consumption: {
    diet: 'meatHeavy' | 'balanced' | 'vegetarian';
  };
}

export interface CarbonResult {
  total: number;
  breakdown: {
    transport: number;
    energy: number;
    consumption: number;
  };
}

export function calculateCarbonFootprint(input: CalculationInput): CarbonResult {
  let total = 0;
  const breakdown = {
    transport: 0,
    energy: 0,
    consumption: 0
  };

  // 1. 交通计算 (转换为年度)
  // 私家车
  if (input.transport.privateCar) {
    const { type, size, distance } = input.transport.privateCar;
    let factor = 0;
    if (type === 'electric') {
      factor = CARBON_FACTORS.transport.electricCar.sedan; // 默认轿车
    } else if (type === 'gasoline' && size) {
      factor = CARBON_FACTORS.transport.fuelCar.gasoline[size];
    } else if (type === 'diesel' && size) {
      factor = CARBON_FACTORS.transport.fuelCar.diesel[size];
    }
    breakdown.transport += distance * factor * 52;
  }

  // 公共交通
  if (input.transport.public) {
    const { subway, bus, taxi } = input.transport.public;
    breakdown.transport += (
      subway * CARBON_FACTORS.transport.public.subway +
      bus * CARBON_FACTORS.transport.public.bus.diesel + // 默认传统公交
      taxi * CARBON_FACTORS.transport.public.taxi
    ) * 52;
  }

  // 航空出行
  if (input.transport.flight) {
    const { short, medium, long, class: cabinClass } = input.transport.flight;
    // 估算平均距离: 短途300km, 中途1000km, 长途5000km
    breakdown.transport += 
      short * 300 * CARBON_FACTORS.transport.flight.short[cabinClass] +
      medium * 1000 * CARBON_FACTORS.transport.flight.medium[cabinClass] +
      long * 5000 * CARBON_FACTORS.transport.flight.long[cabinClass];
  }

  // 2. 能源计算 (转换为年度)
  // 电力
  if (input.energy.electricity) {
    const { amount, region } = input.energy.electricity;
    const factor = CARBON_FACTORS.energy.electricity[region];
    breakdown.energy += amount * factor * 12;
  }
  // 燃气
  if (input.energy.gas) {
    const { naturalGas } = input.energy.gas;
    breakdown.energy += naturalGas * CARBON_FACTORS.energy.gas.naturalGas * 12;
  }

  // 3. 消费计算 (转换为年度)
  const dietFactor = CARBON_FACTORS.consumption.diet[input.consumption.diet];
  breakdown.consumption += dietFactor * 365;

  total = Math.round(breakdown.transport + breakdown.energy + breakdown.consumption);
  
  return {
    total,
    breakdown: {
      transport: Math.round(breakdown.transport),
      energy: Math.round(breakdown.energy),
      consumption: Math.round(breakdown.consumption)
    }
  };
}
