param(
    [int]$BackendPort = 8000,
    [int]$FrontendPort = 3000
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $projectRoot

if (-not (Test-Path -Path (Join-Path $projectRoot 'venv'))) {
    Write-Host 'Creating Python virtual environment...'
    python -m venv (Join-Path $projectRoot 'venv')
}

$venvPython = Join-Path $projectRoot 'venv\Scripts\python.exe'

if (-not (Test-Path -Path $venvPython)) {
    throw 'Virtual environment Python interpreter was not created successfully.'
}

Write-Host 'Installing Python dependencies (if needed)...'
& $venvPython -m pip install -r (Join-Path $projectRoot 'requirements.txt')

Write-Host 'Installing frontend dependencies (if needed)...'
npm install

Write-Host 'Starting FastAPI backend...'
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; & '$venvPython' -m uvicorn backend.app.main:app --reload --port $BackendPort" -PassThru

Write-Host 'Starting Vite frontend...'
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; npm run dev -- --port $FrontendPort" -PassThru

Write-Host "Backend PowerShell window PID: $($backendProcess.Id)"
Write-Host "Frontend PowerShell window PID: $($frontendProcess.Id)"
Write-Host 'Both servers are starting in new PowerShell windows. Close those windows to stop the servers.'

#Cmd for run: powershell -File "c:\Users\abela\Downloads\BSDS\DS2022\gymproject\run.ps1"