# Start the FastAPI backend
Write-Host "Starting FastAPI backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\venv\Scripts\Activate.ps1; uvicorn backend.app.main:app --reload --port 8000"

# Start the Vite frontend
Write-Host "Starting Vite frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev -- --port 3000"

Write-Host "Both servers are starting in new PowerShell windows..."


