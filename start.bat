@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title Kuentas Klaras - arranque local

echo.
echo   Kuentas Klaras - entorno local
echo   ==============================
echo.

REM --- Node ---
where node >nul 2>nul
if errorlevel 1 (
  echo   [ERROR] No se encontro Node.js en el PATH.
  echo           Instalalo desde https://nodejs.org ^(version 20 o superior^).
  goto :fin
)

for /f "tokens=1 delims=." %%v in ('node -p "process.versions.node"') do set NODE_MAYOR=%%v
if !NODE_MAYOR! LSS 20 (
  echo   [ERROR] Node !NODE_MAYOR! detectado. El proyecto necesita la version 20 o superior.
  goto :fin
)
echo   [ok] Node !NODE_MAYOR!

REM --- Variables de entorno ---
if not exist ".env" (
  echo   [ERROR] Falta el archivo .env
  echo           Copia .env.example a .env y rellena los valores:
  echo             copy .env.example .env
  goto :fin
)

REM JWT_SECRET y DATABASE_URL son obligatorias: el servidor lanza una excepcion
REM al arrancar si falta cualquiera de las dos.
findstr /r /c:"^JWT_SECRET=." ".env" >nul
if errorlevel 1 (
  echo   [ERROR] JWT_SECRET esta vacia o no existe en .env
  echo           Genera una con:  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  goto :fin
)

findstr /r /c:"^DATABASE_URL=." ".env" >nul
if errorlevel 1 (
  echo   [ERROR] DATABASE_URL esta vacia o no existe en .env
  goto :fin
)
echo   [ok] .env con las variables obligatorias

REM --- La base de datos siempre es la de produccion ---
REM Se imprime solo el nombre de host: la URL completa lleva usuario y clave.
REM Node hace el parseo porque partir la URL en batch expondria la contrasena.
set "DB_HOST="
node -e "require('dotenv').config();console.log(new URL(process.env.DATABASE_URL).hostname)" > "%TEMP%\kk_dbhost.txt" 2>nul
if exist "%TEMP%\kk_dbhost.txt" set /p DB_HOST=<"%TEMP%\kk_dbhost.txt"
del "%TEMP%\kk_dbhost.txt" >nul 2>nul

if not defined DB_HOST (
  echo   [ERROR] DATABASE_URL no es una URL valida. Node no pudo leerla.
  goto :fin
)

REM Un host local significaria que se esta trabajando contra otra base. El
REM proyecto no tiene base local, asi que eso solo puede ser un error de copia.
echo !DB_HOST! | findstr /r /c:"localhost" /c:"127\.0\.0\.1" >nul
if not errorlevel 1 (
  echo   [ERROR] DATABASE_URL apunta a !DB_HOST!, no a produccion.
  echo           Este proyecto siempre trabaja contra la base remota.
  goto :fin
)
echo   [ok] Base de datos de produccion: !DB_HOST!

REM --- Dependencias ---
if not exist "node_modules" (
  echo   [..] Instalando dependencias, esto tarda un poco...
  call npm install
  if errorlevel 1 (
    echo   [ERROR] Fallo npm install
    goto :fin
  )
)
echo   [ok] Dependencias instaladas

REM --- Liberar los puertos ---
REM Si el 3000 ya esta ocupado, el backend muere con EADDRINUSE dentro de su
REM ventana y lo unico que se ve es que la app no guarda. Se cierra lo que haya.
call :liberar 3000
if errorlevel 1 goto :fin
call :liberar 5173
if errorlevel 1 goto :fin

echo.
echo   AVISO: lo que edites aqui se guarda en !DB_HOST!, la base real.
echo.
echo   Backend  http://localhost:3000   ^(datos de produccion^)
echo   Frontend http://localhost:5173   ^(codigo local^)
echo.
echo   Ctrl+C en esta ventana detiene backend y frontend a la vez.
echo.

REM Backend y Vite corren en esta misma consola, con la salida de cada uno
REM etiquetada. El runner los cierra a los dos con Ctrl+C y abre el navegador
REM cuando Vite anuncia que ya escucha, sin esperas a ciegas.
node scripts/dev.mjs

echo.
echo   Servidores detenidos.
echo.
goto :fin

REM ---------------------------------------------------------------------------
REM  :liberar ^<puerto^>
REM  Cierra el proceso que este escuchando en ese puerto. Devuelve errorlevel 1
REM  si despues de cerrarlo el puerto sigue ocupado.
REM ---------------------------------------------------------------------------
:liberar
set "PUERTO=%~1"
set "ULTIMO_PID="

for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":%PUERTO% .*LISTENING"') do (
  set "PID=%%p"
  REM Los PID 0 y 4 son Idle y System: matarlos no es posible ni deseable.
  if !PID! GTR 4 if not "!PID!"=="!ULTIMO_PID!" (
    set "ULTIMO_PID=!PID!"
    set "NOMBRE=desconocido"
    for /f "tokens=1 delims=," %%n in ('tasklist /fi "PID eq !PID!" /nh /fo csv 2^>nul') do set "NOMBRE=%%~n"
    echo   [..] Puerto %PUERTO% ocupado por !NOMBRE! ^(PID !PID!^). Cerrando...
    taskkill /PID !PID! /F /T >nul 2>nul
  )
)

if not defined ULTIMO_PID (
  echo   [ok] Puerto %PUERTO% libre
  exit /b 0
)

REM Cerrar el proceso y liberar el socket no son instantaneos.
"%SystemRoot%\System32\ping.exe" -n 3 127.0.0.1 >nul

netstat -ano | findstr /r /c:":%PUERTO% .*LISTENING" >nul
if not errorlevel 1 (
  echo   [ERROR] El puerto %PUERTO% sigue ocupado despues de cerrar el proceso.
  echo           Puede pertenecer a otro usuario o a un servicio del sistema.
  echo           Miralo con:  netstat -ano ^| findstr :%PUERTO%
  exit /b 1
)

echo   [ok] Puerto %PUERTO% liberado
exit /b 0

:fin
endlocal
pause
