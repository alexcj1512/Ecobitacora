@echo off
echo.
echo ========================================
echo   Compilando C++ a WebAssembly
echo ========================================
echo.

emcc carbon-calculator-wasm.cpp ^
  -o ../frontend/public/carbon-calculator.js ^
  -s WASM=1 ^
  -s MODULARIZE=1 ^
  -s EXPORT_NAME="createCarbonCalculator" ^
  -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" ^
  --bind ^
  -O3

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Compilacion completada exitosamente!
    echo ========================================
    echo.
    echo Archivos generados:
    echo   - frontend/public/carbon-calculator.js
    echo   - frontend/public/carbon-calculator.wasm
    echo.
    echo Ahora puedes usar WebAssembly en tu app!
    echo.
) else (
    echo.
    echo ========================================
    echo   Error en la compilacion
    echo ========================================
    echo.
    echo Verifica que Emscripten este instalado:
    echo   1. Descarga: https://emscripten.org/
    echo   2. Instala: emsdk install latest
    echo   3. Activa: emsdk activate latest
    echo   4. Configura: emsdk_env.bat
    echo.
)

pause
