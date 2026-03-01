import { calculateCarbonFootprint, CalculationInput } from './engine';

describe('Carbon Footprint Calculator Engine', () => {
  it('should calculate transport footprint correctly for private gasoline car', () => {
    const input: CalculationInput = {
      transport: {
        privateCar: {
          type: 'gasoline',
          size: 'medium',
          distance: 100 // km/week
        }
      },
      energy: {
        electricity: {
          amount: 0,
          region: 'nationalAvg'
        }
      },
      consumption: {
        diet: 'balanced'
      }
    };

    const result = calculateCarbonFootprint(input);
    // 100 * 0.20 * 52 = 1040
    expect(result.breakdown.transport).toBe(1040);
  });

  it('should calculate energy footprint correctly', () => {
    const input: CalculationInput = {
      transport: {
      },
      energy: {
        electricity: {
          amount: 200, // kWh/month
          region: 'nationalAvg'
        }
      },
      consumption: {
        diet: 'balanced'
      }
    };

    const result = calculateCarbonFootprint(input);
    // 200 * 0.58 * 12 = 1392
    expect(result.breakdown.energy).toBe(1392);
  });

  it('should calculate consumption footprint correctly', () => {
    const input: CalculationInput = {
      transport: {
      },
      energy: {
        electricity: {
          amount: 0,
          region: 'nationalAvg'
        }
      },
      consumption: {
        diet: 'balanced'
      }
    };

    const result = calculateCarbonFootprint(input);
    // 4.5 * 365 = 1642.5 -> 1643
    expect(result.breakdown.consumption).toBe(1643);
  });

  it('should calculate total footprint correctly', () => {
    const input: CalculationInput = {
      transport: {
        privateCar: {
          type: 'gasoline',
          size: 'medium',
          distance: 100
        }
      },
      energy: {
        electricity: {
          amount: 200,
          region: 'nationalAvg'
        }
      },
      consumption: {
        diet: 'balanced'
      }
    };

    const result = calculateCarbonFootprint(input);
    // Transport: 1040
    // Energy: 1392
    // Consumption: 1642.5
    // Total: 4074.5 -> 4075
    expect(result.total).toBe(4075);
    expect(result.breakdown.transport).toBe(1040);
    expect(result.breakdown.energy).toBe(1392);
    expect(result.breakdown.consumption).toBe(1643);
  });

  it('should handle complex transport scenarios (flight + public + car)', () => {
    const input: CalculationInput = {
      transport: {
        privateCar: {
          type: 'electric',
          size: 'sedan',
          distance: 50
        },
        public: {
          subway: 100,
          bus: 50,
          taxi: 10
        },
        flight: {
          short: 2,
          medium: 1,
          long: 0,
          class: 'economy'
        }
      },
      energy: {
        electricity: { amount: 0, region: 'nationalAvg' }
      },
      consumption: { diet: 'balanced' }
    };

    const result = calculateCarbonFootprint(input);
    
    // Private Car (Electric Sedan): 50 * 0.08 * 52 = 208
    // Public:
    // Subway: 100 * 0.04 * 52 = 208
    // Bus: 50 * 0.08 * 52 = 208
    // Taxi: 10 * 0.25 * 52 = 130
    // Flight:
    // Short: 2 * 300 * 0.25 = 150
    // Medium: 1 * 1000 * 0.18 = 180
    
    // Total Transport: 208 + 208 + 208 + 130 + 150 + 180 = 1084
    
    expect(result.breakdown.transport).toBe(1084);
  });
});
