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

REM --- Puertos libres ---
REM Si el 3000 ya esta ocupado, el backend muere con EADDRINUSE dentro de su
REM ventana y lo unico que se ve es que la app no guarda.
set PUERTO_OCUPADO=
netstat -ano | findstr /r /c:"LISTENING" | findstr /r /c:":3000 " >nul
if not errorlevel 1 set PUERTO_OCUPADO=3000

netstat -ano | findstr /r /c:"LISTENING" | findstr /r /c:":5173 " >nul
if not errorlevel 1 (
  if defined PUERTO_OCUPADO (set PUERTO_OCUPADO=3000 y 5173) else (set PUERTO_OCUPADO=5173)
)

if defined PUERTO_OCUPADO (
  echo.
  echo   [ERROR] El puerto !PUERTO_OCUPADO! ya esta en uso.
  echo           Seguramente hay otra instancia del proyecto corriendo.
  echo           Cierra esa ventana, o mira que proceso es con:
  echo             netstat -ano ^| findstr :3000
  echo             taskkill /PID ^<numero^> /F
  goto :fin
)
echo   [ok] Puertos 3000 y 5173 libres

echo.
echo   AVISO: DATABASE_URL apunta a la base de datos real.
echo          Lo que edites aqui se guarda en produccion.
echo.
echo   Se abriran dos ventanas:
echo     - Backend  http://localhost:3000
echo     - Frontend http://localhost:5173
echo.
echo   Cierra ambas ventanas para detener el proyecto.
echo.
pause

REM DEBUG_PARSING=1 activa los registros de diagnostico del pipeline de correos,
REM que en produccion van apagados porque contienen datos del usuario.
REM start hereda el directorio actual, que ya es el del proyecto por el cd /d
REM de arriba, asi que no hace falta repetirlo dentro de las comillas.
start "KK backend" cmd /k "set DEBUG_PARSING=1&& set NODE_ENV=development&& npm run dev:server"

REM Un margen para que el backend levante antes de que Vite empiece a proxiar.
REM Se usa ping y no timeout: timeout aborta si la entrada esta redirigida, que
REM es lo que pasa al lanzar el .bat desde otro shell en vez de un doble clic.
"%SystemRoot%\System32\ping.exe" -n 4 127.0.0.1 >nul

start "KK frontend" cmd /k "npm run dev"

"%SystemRoot%\System32\ping.exe" -n 6 127.0.0.1 >nul
start "" http://localhost:5173

echo.
echo   Listo. Si el navegador no se abrio, entra a http://localhost:5173
echo.

:fin
endlocal
pause
