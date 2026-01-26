// 碳排放因子数据库
// 单位说明：
// 距离: km
// 质量: kg
// 体积: L
// 能量: kWh
// 排放因子单位: kg CO2e / [unit]

export const CARBON_FACTORS = {
  // 1. 交通出行
  transport: {
    // 燃油车 (kg CO2e / km)
    fuelCar: {
      gasoline: {
        small: 0.15,   // < 1.6L
        medium: 0.20,  // 1.6-2.0L
        large: 0.28    // > 2.0L
      },
      diesel: {
        small: 0.14,
        medium: 0.18,
        large: 0.25
      }
    },
    // 电动车 (kg CO2e / km) - 考虑电网平均排放
    electricCar: {
      sedan: 0.08,    // 轿车
      suv: 0.10       // SUV
    },
    // 公共交通 (kg CO2e / km / person)
    public: {
      subway: 0.04,   // 地铁/轻轨
      bus: {
        diesel: 0.08, // 传统公交
        electric: 0.03 // 新能源公交
      },
      taxi: 0.25      // 出租车/网约车 (含空驶)
    },
    // 航空出行 (kg CO2e / km / person)
    flight: {
      short: { // < 500km
        economy: 0.25,
        business: 0.38,
        first: 0.50
      },
      medium: { // 500-1500km
        economy: 0.18,
        business: 0.27,
        first: 0.36
      },
      long: { // > 1500km
        economy: 0.15,
        business: 0.23,
        first: 0.30
      }
    }
  },

  // 2. 家庭能源
  energy: {
    // 电力 (kg CO2e / kWh) - 区域电网平均
    electricity: {
      northChina: 0.88, // 华北 (火电占比高)
      eastChina: 0.70,  // 华东
      southChina: 0.65, // 南方
      nationalAvg: 0.58 // 全国平均
    },
    // 燃气
    gas: {
      naturalGas: 2.16, // 天然气 (kg CO2e / m3)
      lpg: 3.00         // 液化石油气 (kg CO2e / kg)
    }
  },

  // 3. 生活消费
  consumption: {
    // 饮食 (kg CO2e / day)
    diet: {
      meatHeavy: 7.2, // 肉食为主
      balanced: 4.5,  // 均衡饮食
      vegetarian: 2.8 // 素食为主
    }
  }
};

export type Region = 'northChina' | 'eastChina' | 'southChina' | 'nationalAvg';
export type CarType = 'gasoline' | 'diesel' | 'electric';
export type CarSize = 'small' | 'medium' | 'large';
export type FlightClass = 'economy' | 'business' | 'first';
