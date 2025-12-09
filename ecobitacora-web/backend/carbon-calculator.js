// Calculadora de carbono en JavaScript (equivalente al C++)
// Para usar el C++, necesitarías compilarlo con node-gyp

const EMISSION_FACTORS = {
  // Transporte (kg CO2 por km)
  car_gasoline: 0.192,
  car_diesel: 0.171,
  car_electric: 0.053,
  bus: 0.089,
  train: 0.041,
  metro: 0.028,
  bicycle: 0.0,
  walking: 0.0,
  motorcycle: 0.113,
  
  // Reciclaje (kg CO2 ahorrado por kg de material)
  plastic: 1.5,
  paper: 0.9,
  glass: 0.3,
  metal: 2.1,
  cardboard: 0.7,
  organic: 0.5,
  
  // Energía (kg CO2 por kWh)
  electricity: 0.4,
  natural_gas: 0.2,
  led_bulb: 0.04,
  incandescent_bulb: 0.15,
  appliance_standby: 0.02,
  
  // Agua (kg CO2 por litro)
  water_heating: 0.12,
  water_cold: 0.0003,
  shower_5min: 0.6,
  bath: 1.2
};

class CarbonCalculator {
  // Calcular CO2 de transporte
  calculateTransport(vehicleType, distance) {
    const factor = EMISSION_FACTORS[vehicleType] || 0;
    return Math.round(distance * factor * 100) / 100;
  }
  
  // Calcular CO2 ahorrado por reciclaje
  calculateRecycling(material, weight) {
    const factor = EMISSION_FACTORS[material] || 0;
    return Math.round(weight * factor * 100) / 100;
  }
  
  // Calcular CO2 de energía
  calculateEnergy(energyType, amount) {
    const factor = EMISSION_FACTORS[energyType] || 0;
    return Math.round(amount * factor * 100) / 100;
  }
  
  // Calcular CO2 de agua
  calculateWater(waterType, amount) {
    const factor = EMISSION_FACTORS[waterType] || 0;
    return Math.round(amount * factor * 100) / 100;
  }
  
  // Calcular equivalencias
  getEquivalences(co2kg) {
    return {
      trees: Math.round(co2kg / 22.0 * 100) / 100,
      carKm: Math.round(co2kg / 0.192 * 100) / 100,
      showers: Math.round(co2kg / 0.6 * 100) / 100,
      ledHours: Math.round(co2kg / 0.04 * 100) / 100,
      phoneCharges: Math.round(co2kg / 0.008 * 100) / 100,
      meals: Math.round(co2kg / 2.5 * 100) / 100,
    };
  }
  
  // Calcular impacto anual proyectado
  projectAnnualImpact(dailyAverage) {
    return Math.round(dailyAverage * 365 * 100) / 100;
  }
  
  // Calcular tendencia (porcentaje de cambio)
  calculateTrend(currentPeriod, previousPeriod) {
    if (previousPeriod === 0) return 0;
    const change = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
    return Math.round(change * 100) / 100;
  }
  
  // Calcular promedio móvil (para suavizar gráficos)
  calculateMovingAverage(data, windowSize = 7) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
      result.push(Math.round(avg * 100) / 100);
    }
    return result;
  }
  
  // Calcular score ecológico (0-100)
  calculateEcoScore(totalCO2, totalActions, streak, daysActive) {
    const co2Score = Math.min(totalCO2 / 10, 40); // Max 40 puntos
    const actionScore = Math.min(totalActions / 2, 30); // Max 30 puntos
    const streakScore = Math.min(streak * 2, 20); // Max 20 puntos
    const consistencyScore = Math.min((totalActions / daysActive) * 5, 10); // Max 10 puntos
    
    return Math.round(co2Score + actionScore + streakScore + consistencyScore);
  }
}

export default CarbonCalculator;
