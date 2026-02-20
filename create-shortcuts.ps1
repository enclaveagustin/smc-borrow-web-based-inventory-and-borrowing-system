# SMC-Borrow Shortcut Creator
# Run this with: powershell -ExecutionPolicy Bypass -File create-shortcuts.ps1

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$WshShell = New-Object -ComObject WScript.Shell

# Create Desktop Shortcut
$DesktopPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath("Desktop"), "SMC-Borrow.lnk")
$SetupPath = [System.IO.Path]::Combine($ProjectRoot, "setup.bat")

$Shortcut = $WshShell.CreateShortCut($DesktopPath)
$Shortcut.TargetPath = $SetupPath
$Shortcut.WorkingDirectory = $ProjectRoot
$Shortcut.Description = "SMC-Borrow: Web-Based Inventory and Borrowing System"
$Shortcut.IconLocation = "🎯"
$Shortcut.Save()

Write-Host "✓ Desktop shortcut created: SMC-Borrow.lnk"

# Create Start Menu Shortcut
$StartMenuPath = [System.IO.Path]::Combine(
    [System.Environment]::GetFolderPath("ApplicationData"),
    "Microsoft\Windows\Start Menu\Programs"
)

$StartMenuShortcut = [System.IO.Path]::Combine($StartMenuPath, "SMC-Borrow.lnk")
$Shortcut2 = $WshShell.CreateShortCut($StartMenuShortcut)
$Shortcut2.TargetPath = $SetupPath
$Shortcut2.WorkingDirectory = $ProjectRoot
$Shortcut2.Description = "SMC-Borrow - Start Application"
$Shortcut2.IconLocation = "🎯"
$Shortcut2.Save()

Write-Host "✓ Start Menu shortcut created"
Write-Host ""
Write-Host "Done! You can now:"
Write-Host "  1. Double-click SMC-Borrow on your Desktop"
Write-Host "  2. Or search 'SMC-Borrow' in the Start Menu"
