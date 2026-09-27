@echo off
title TelemetryPulse Landing Page
echo ========================================================
echo   TelemetryPulse - Launching 3D Interactive Web App
echo ========================================================
echo.
cd /d "%~dp0frontend"
if not exist "node_modules" (
  echo Installing dependencies...
  npm install
)
echo Starting local Vite dev server at http://localhost:5173/ ...
start http://localhost:5173/
npm run dev
pause
