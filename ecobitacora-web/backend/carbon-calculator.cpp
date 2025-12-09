#include <iostream>
#include <string>
#include <map>
#include <cmath>

using namespace std;

// Factores de emisión de CO2 (kg CO2 por unidad)
const map<string, double> EMISSION_FACTORS = {
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
private:
    double totalCO2;
    
public:
    CarbonCalculator() : totalCO2(0.0) {}
    
    // Calcular CO2 de transporte
    double calculateTransport(string vehicleType, double distance) {
        if (EMISSION_FACTORS.find(vehicleType) != EMISSION_FACTORS.end()) {
            double co2 = distance * EMISSION_FACTORS.at(vehicleType);
            return round(co2 * 100) / 100; // Redondear a 2 decimales
        }
        return 0.0;
    }
    
    // Calcular CO2 ahorrado por reciclaje
    double calculateRecycling(string material, double weight) {
        if (EMISSION_FACTORS.find(material) != EMISSION_FACTORS.end()) {
            double co2 = weight * EMISSION_FACTORS.at(material);
            return round(co2 * 100) / 100;
        }
        return 0.0;
    }
    
    // Calcular CO2 de energía
    double calculateEnergy(string energyType, double amount) {
        if (EMISSION_FACTORS.find(energyType) != EMISSION_FACTORS.end()) {
            double co2 = amount * EMISSION_FACTORS.at(energyType);
            return round(co2 * 100) / 100;
        }
        return 0.0;
    }
    
    // Calcular CO2 de agua
    double calculateWater(string waterType, double amount) {
        if (EMISSION_FACTORS.find(waterType) != EMISSION_FACTORS.end()) {
            double co2 = amount * EMISSION_FACTORS.at(waterType);
            return round(co2 * 100) / 100;
        }
        return 0.0;
    }
    
    // Calcular equivalencias
    void printEquivalences(double co2kg) {
        cout << "\n=== Equivalencias de " << co2kg << " kg CO2 ===" << endl;
        cout << "🌳 Árboles plantados: " << round(co2kg / 22.0 * 100) / 100 << endl;
        cout << "🚗 Km en auto evitados: " << round(co2kg / 0.192 * 100) / 100 << endl;
        cout << "🚿 Duchas ahorradas: " << round(co2kg / 0.6 * 100) / 100 << endl;
        cout << "💡 Horas de luz LED: " << round(co2kg / 0.04 * 100) / 100 << endl;
        cout << "📱 Cargas de smartphone: " << round(co2kg / 0.008 * 100) / 100 << endl;
    }
    
    // Calcular impacto anual proyectado
    double projectAnnualImpact(double dailyAverage) {
        return round(dailyAverage * 365 * 100) / 100;
    }
    
    // Calcular tendencia (porcentaje de cambio)
    double calculateTrend(double currentPeriod, double previousPeriod) {
        if (previousPeriod == 0) return 0.0;
        double change = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
        return round(change * 100) / 100;
    }
};

// Función principal para pruebas
int main() {
    CarbonCalculator calc;
    
    cout << "🌱 CALCULADORA DE CARBONO ECOBITACORA 🌱\n" << endl;
    
    // Ejemplos de cálculos
    double carCO2 = calc.calculateTransport("car_gasoline", 10.0);
    cout << "🚗 Auto gasolina 10km: " << carCO2 << " kg CO2" << endl;
    
    double bicycleCO2 = calc.calculateTransport("bicycle", 10.0);
    cout << "🚴 Bicicleta 10km: " << bicycleCO2 << " kg CO2 (¡Ahorrado: " << carCO2 << " kg!)" << endl;
    
    double plasticCO2 = calc.calculateRecycling("plastic", 2.0);
    cout << "\n♻️ Reciclaje 2kg plástico: " << plasticCO2 << " kg CO2 ahorrado" << endl;
    
    double showerCO2 = calc.calculateWater("shower_5min", 1.0);
    cout << "🚿 Ducha 5min: " << showerCO2 << " kg CO2" << endl;
    
    double totalSaved = carCO2 + plasticCO2;
    calc.printEquivalences(totalSaved);
    
    cout << "\n📊 Proyección anual (si ahorras " << totalSaved << " kg diarios):" << endl;
    cout << "   " << calc.projectAnnualImpact(totalSaved) << " kg CO2/año" << endl;
    
    cout << "\n📈 Tendencia: ";
    double trend = calc.calculateTrend(150.0, 100.0);
    cout << (trend > 0 ? "+" : "") << trend << "% vs período anterior" << endl;
    
    return 0;
}
