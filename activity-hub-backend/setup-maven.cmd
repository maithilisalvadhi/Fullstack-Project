@REM @echo off
@REM Maven Setup Script for Windows
@REM This script downloads and configures Maven automatically

setlocal enabledelayedexpansion

echo ================================================================
echo Maven Installer for Windows
echo ================================================================

set MAVEN_VERSION=3.9.6
set MAVEN_HOME=%USERPROFILE%\maven
set MAVEN_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip

echo.
echo Checking if Maven is already installed...
if exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo Maven is already installed at %MAVEN_HOME%
    goto ADD_TO_PATH
)

echo.
echo Downloading Maven %MAVEN_VERSION%...
if not exist "%TEMP%\maven.zip" (
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%MAVEN_URL%', '%TEMP%\maven.zip')"
    if errorlevel 1 (
        echo. Failed to download Maven
        exit /b 1
    )
)

echo Extracting Maven...
if not exist "%MAVEN_HOME%" mkdir "%MAVEN_HOME%"
powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('%TEMP%\maven.zip', '%USERPROFILE%')"

REM Rename the extracted folder
for /d %%D in ("%USERPROFILE%\apache-maven-*") do (
    move "%%D" "%MAVEN_HOME%"
)

:ADD_TO_PATH
echo.
echo Maven installed at: %MAVEN_HOME%
echo.
echo To use Maven from command line, add it to your PATH:
echo.
echo 1. Open System Properties (Win + Pause)
echo 2. Click "Environment Variables"
echo 3. Add this to your PATH: %MAVEN_HOME%\bin
echo.
echo Then restart your terminal and run: mvn --version

setlocal endlocal
