@echo off
setlocal enabledelayedexpansion
set GH_PREFIX=https://github.com
FOR /F "usebackq tokens=*" %%A IN (`powershell.exe -Command "('%PROCESSOR_ARCHITECTURE%').ToLower( )"`) DO SET arch=%%A
rem currently only amd64 built 3/6/25
rem set arch=amd64
for /f "delims=/ usebackq tokens=4,5,6" %%A in (`curl -sL %GH_PREFIX%/claudiodangelis/qrcp ^| findstr /C:"/claudiodangelis/qrcp/releases/tag/"`) do ( 
    set v=%%C
    set ver=!v:~1,-2!
)
	
curl -sL !GH_PREFIX!/claudiodangelis/qrcp/releases/download/v!ver!/qrcp_!ver!_windows_!arch!.tar.gz >xx.gz
if exist xx.gz (
	tar -xf xx.gz
	set qrcppath="%~dp0qrcp.exe"
	@rem mklink !HOMEPATH!\AppData\Local\Microsoft\WindowsApps\qrcp.exe !qrcppath!	
    copy qrcp.exe !HOMEPATH!\AppData\Local\Microsoft\WindowsApps >nul
	git checkout README.md >nul 2>&1
)

rem https://github.com/claudiodangelis/qrcp/releases/download/v0.11.4/qrcp_0.11.4_windows_amd64.tar.gz	

for /F "usebackq" %%a in (`ipconfig ^| findstr /C:adapter`) do set address=%%a
rem echo address=!address!
echo {"interface": "!address!"} >qrcp.json