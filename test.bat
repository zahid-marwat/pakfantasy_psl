@echo off
setlocal enabledelayedexpansion

echo Checking for existing backend process on port 5000...
set "backendPid="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":5000 .*LISTENING"') do (
	if not defined backendPid (
		set "backendPid=%%p"
	)
)

if defined backendPid (
	echo Found process listening on port 5000 with PID %backendPid%. Attempting to terminate...
	taskkill /PID %backendPid% /F >nul 2>&1
	if %errorlevel%==0 (
		echo Successfully terminated process %backendPid%.
	) else (
		echo Warning: Unable to terminate process %backendPid%. Please close it manually.
	)
) else (
	echo No process detected on port 5000.
)

echo Starting PakFantasyPSL...
start "Backend" cmd /k "cd backend && npm start"
start "Frontend" cmd /k "cd frontend && npm run dev"
echo Backend and Frontend have been launched in separate windows.

endlocal
