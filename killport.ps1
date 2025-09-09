param(
    [Parameter(Position=0, Mandatory=$true)]
    [int]$Port
)

$process = netstat -ano | Select-String ":$Port\s.*LISTENING"

if ($process) {
    $procId = ($process -split "\s+")[-1]
    Write-Host "Killing process with PID $procId on port $Port"
    Stop-Process -Id $procId -Force
} else {
    Write-Host "No process found on port $Port"
}
