#include <emscripten/bind.h>
#include <string>
#include <map>
#include <cmath>

using namespace emscripten;

// Factores de emisión de CO2 (kg CO2 por unidad)
const std::map<std::string, double> EMISSION_FACTORS = {
    // Transporte (kg CO2 por km)
    {"car_gasoline", 0.192},
    {"car_diesel", 0.171},
    {"car_electric", 0.053},
    {"bus", 0.089},
    {"train", 0.041},
    {"metro", 0.028},
    {"bicycle", 0.0},
    {"walking", 0.0},
    {"motorcycle", 0.113},
    
    // Reciclaje (kg CO2 ahorrado por kg de material)
    {"plastic", 1.5},
    {"paper", 0.9},
    {"glass", 0.3},
    {"metal", 2.1},
    {"cardboard", 0.7},
    {"organic", 0.5},
    
    // Energía (kg CO2 por kWh)
    {"electricity", 0.4},
    {"natural_gas", 0.2},
    {"led_bulb", 0.04},
    {"incandescent_bulb", 0.15},
    {"appliance_standby", 0.02},
    
    // Agua (kg CO2 por litro)
    {"water_heating", 0.12},
    {"water_cold", 0.0003},
    {"shower_5min", 0.6},
    {"bath", 1.2}
};

class CarbonCalculator {
public:
    // Calcular CO2 de transporte
    double calculateTransport(std::string vehicleType, double distance) {
        auto it = EMISSION_FACTORS.find(vehicleType);
        if (it != EMISSION_FACTORS.end()) {
            return std::round(distance * it->second * 100) / 100;
        }
        return 0.0;
    }
    
    // Calcular CO2 ahorrado por reciclaje
    double calculateRecycling(std::string material, double weight) {
        auto it = EMISSION_FACTORS.find(material);
        if (it != EMISSION_FACTORS.end()) {
            return std::round(weight * it->second * 100) / 100;
        }
        return 0.0;
    }
    
    // Calcular CO2 de energía
    double calculateEnergy(std::string energyType, double amount) {
        auto it = EMISSION_FACTORS.find(energyType);
        if (it != EMISSION_FACTORS.end()) {
            return std::round(amount * it->second * 100) / 100;
        }
        return 0.0;
    }
    
    // Calcular CO2 de agua
    double calculateWater(std::string waterType, double amount) {
        auto it = EMISSION_FACTORS.find(waterType);
        if (it != EMISSION_FACTORS.end()) {
            return std::round(amount * it->second * 100) / 100;
        }
        return 0.0;
    }
    
    // Equivalencias - árboles plantados
    double getTreesEquivalent(double co2kg) {
        return std::round(co2kg / 22.0 * 100) / 100;
    }
    
    // Equivalencias - km en auto evitados
    double getCarKmEquivalent(double co2kg) {
        return std::round(co2kg / 0.192 * 100) / 100;
    }
    
    // Equivalencias - duchas ahorradas
    double getShowersEquivalent(double co2kg) {
        return std::round(co2kg / 0.6 * 100) / 100;
    }
    
    // Equivalencias - horas de luz LED
    double getLedHoursEquivalent(double co2kg) {
        return std::round(co2kg / 0.04 * 100) / 100;
    }
    
    // Equivalencias - cargas de smartphone
    double getPhoneChargesEquivalent(double co2kg) {
        return std::round(co2kg / 0.008 * 100) / 100;
    }
    
    // Proyección anual
    double projectAnnualImpact(double dailyAverage) {
        return std::round(dailyAverage * 365 * 100) / 100;
    }
    
    // Calcular tendencia (porcentaje de cambio)
    double calculateTrend(double current, double previous) {
        if (previous == 0) return 0.0;
        double change = ((current - previous) / previous) * 100;
        return std::round(change * 100) / 100;
    }
    
    // Score ecológico (0-100)
    int calculateEcoScore(double totalCO2, int totalActions, int streak, int daysActive) {
        double co2Score = std::min(totalCO2 / 10.0, 40.0);
        double actionScore = std::min(totalActions / 2.0, 30.0);
        double streakScore = std::min(streak * 2.0, 20.0);
        double consistencyScore = daysActive > 0 ? 
            std::min((totalActions / (double)daysActive) * 5.0, 10.0) : 0.0;
        
        return (int)std::round(co2Score + actionScore + streakScore + consistencyScore);
    }
};

// Exponer la clase a JavaScript usando Embind
EMSCRIPTEN_BINDINGS(carbon_calculator) {
    class_<CarbonCalculator>("CarbonCalculator")
        .constructor<>()
        .function("calculateTransport", &CarbonCalculator::calculateTransport)
        .function("calculateRecycling", &CarbonCalculator::calculateRecycling)
        .function("calculateEnergy", &CarbonCalculator::calculateEnergy)
        .function("calculateWater", &CarbonCalculator::calculateWater)
        .function("getTreesEquivalent", &CarbonCalculator::getTreesEquivalent)
        .function("getCarKmEquivalent", &CarbonCalculator::getCarKmEquivalent)
        .function("getShowersEquivalent", &CarbonCalculator::getShowersEquivalent)
        .function("getLedHoursEquivalent", &CarbonCalculator::getLedHoursEquivalent)
        .function("getPhoneChargesEquivalent", &CarbonCalculator::getPhoneChargesEquivalent)
        .function("projectAnnualImpact", &CarbonCalculator::projectAnnualImpact)
        .function("calculateTrend", &CarbonCalculator::calculateTrend)
        .function("calculateEcoScore", &CarbonCalculator::calculateEcoScore);
}
