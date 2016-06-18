$storageDir = $pwd
$webclient = New-Object System.Net.WebClient
$vcpp_remote = "http://samuelattard.com/files/visualcppbuildtools_full.exe"
$vcpp = "$storageDir\visualcppbuildtools_full.exe"

$bonjour_core_remote = "http://samuelattard.com/files/bonjourcore2.msi"
$bonjour_core = "$storageDir\bonjourcore2.msi"

$bonjour_sdk_remote = "http://samuelattard.com/files/bonjoursdksetup.exe"
$bonjour_sdk = "$storageDir\bonjoursdksetup.exe"

$python_remote = "https://www.python.org/ftp/python/2.7.10/python-2.7.10.amd64.msi"
$python = "$storageDir\python.msi"

Write-Host "Downloading VC++ 2015 Build Tools: $vcpp"
$webclient.DownloadFile($vcpp_remote, $vcpp)

Write-Host " "
Write-Host "Downloading Bonjour Core: $bonjour_core"
$webclient.DownloadFile($bonjour_core_remote, $bonjour_core)

Write-Host " "
Write-Host "Downloading Bonjour SDK: $bonjour_sdk"
$webclient.DownloadFile($bonjour_sdk_remote, $bonjour_sdk)

Write-Host " "
Write-Host "Downloading Python 2.7.10: $python"
$webclient.DownloadFile($python_remote, $python)

Write-Host " "
Write-Host "Installing VC++ 2015 Build Tools"
$args = "/Passive"
Start-Process $vcpp $args -Wait
Write-Host "Installation Complete"

Write-Host " "
Write-Host "Installing Bonjour Core"
$args = "/i $bonjour_core /passive"
Start-Process "msiexec" $args -Wait
Write-Host "msiexec $args"
Write-Host "Installation Complete"

Write-Host " "
Write-Host "Installing Bonjour SDK"
$args = "/passive"
Start-Process $bonjour_sdk $args -Wait
Write-Host "Installation Complete"

Write-Host " "
Write-Host "Installing Python 2.7.10"
$args = "/i $python /passive"
Start-Process "msiexec" $args -Wait
Write-Host "Installation Complete"

$env:BONJOUR_SDK_HOME = "C:\Program Files\Bonjour SDK"
[Environment]::SetEnvironmentVariable("BONJOUR_SDK_HOME", "C:\Program Files\Bonjour SDK",
"Machine")

Write-Host " "
Write-Host "Configuring NPM"
$args = "config set msvs_version 2015"
Start-Process "npm" $args -Wait
