@echo off
echo Starting PakFantasyPSL...
start "Backend" cmd /k "cd backend && npm start"
start "Frontend" cmd /k "cd frontend && npm run dev"
echo Backend and Frontend have been launched in separate windows.
