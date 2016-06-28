#Test if user is an administrator
function Test-Administrator  
{  
    $user = [Security.Principal.WindowsIdentity]::GetCurrent();
    (New-Object Security.Principal.WindowsPrincipal $user).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)  
}

#Perform test to see if user as an administrator
$IsAdmin = Test-Administrator

#Lets alert the user, if needed
if(!$IsAdmin)
{
    Write-Host "*******************************************************"
    Write-Host "Warning:  It may be required to run this script as"
    Write-Host "an administor or some of the programs may not install."
    Write-Host "*******************************************************"
    
    $caption = “Would you like to continue?”
    $message = “Select an option below”
    $choices = [System.Management.Automation.Host.ChoiceDescription[]] `
    @(“&No”, “&Yes”)
    [int]$defaultChoice = 0
    $choiceRTN = $host.ui.PromptForChoice($caption,$message, $choices,$defaultChoice)

    if($choiceRTN -eq 1)
    {
    Write-Host "Okay...Lets continue!"
    } else 
    {
    Write-Host "Probably for the best, run as administrator and try again"
    Exit
    }
}

$storageDir = $PSScriptRoot
$webclient = New-Object System.Net.WebClient

$node_installer_remote = "https://nodejs.org/dist/v6.2.2/node-v6.2.2-x64.msi"
$node_installer = "$storageDir\node-v6.2.2-x64.msi"

$git_installer_remote = "https://github.com/git-for-windows/git/releases/download/v2.9.0.windows.1/Git-2.9.0-64-bit.exe"
$git_installer = "$storageDir\Git-2.9.0-64-bit.exe"

$vcpp_remote = "http://samuelattard.com/files/visualcppbuildtools_full.exe"
$vcpp = "$storageDir\visualcppbuildtools_full.exe"

$bonjour_core_remote = "http://samuelattard.com/files/bonjourcore2.msi"
$bonjour_core = "$storageDir\bonjourcore2.msi"

$bonjour_sdk_remote = "http://samuelattard.com/files/bonjoursdksetup.exe"
$bonjour_sdk = "$storageDir\bonjoursdksetup.exe"

$python_remote = "https://www.python.org/ftp/python/2.7.10/python-2.7.10.amd64.msi"
$python = "$storageDir\python.msi"

Write-Host " "
Write-Host "Downloading Node: $node_installer"
$webclient.DownloadFile($node_installer_remote, $node_installer)

Write-Host " "
Write-Host "Downloading Git: $git_installer"
$webclient.DownloadFile($git_installer_remote, $git_installer)

Write-Host " "
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
Write-Host "Installing Node"
$args = "/i $node_installer /qn"
Start-Process "msiexec" $args -Wait
Write-Host "msiexec $args"
Write-Host "Installation Complete"

Write-Host " "
Write-Host "Installing Git"
$args = "/SILENT"
Start-Process $git_installer $args -Wait
Write-Host "$git_installer $args"
Write-Host "Installation Complete"

Write-Host " "
Write-Host "Installing VC++ 2015 Build Tools"
$args = "/Passive"
Start-Process $vcpp $args -Wait
Write-Host "Installation Complete"

Write-Host " "
Write-Host "Installing Bonjour Core"
$args = "/i $bonjour_core /passive"
Start-Process "msiexec" $args -Wait
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

Write-Host " "
Write-Host " "
Write-Host "Woo Hoo!  You should be all setup, go partay!"