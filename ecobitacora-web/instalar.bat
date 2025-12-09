@echo off
echo ========================================
echo Instalando Ecobitacora Web
echo ========================================
echo.

echo [1/4] Instalando dependencias raiz...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudo instalar dependencias raiz
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Instalando dependencias del frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudo instalar dependencias del frontend
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [3/4] Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudo instalar dependencias del backend
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ========================================
echo Instalacion completada exitosamente!
echo ========================================
echo.
echo Para iniciar la aplicacion ejecuta: iniciar.bat
echo.
pause
