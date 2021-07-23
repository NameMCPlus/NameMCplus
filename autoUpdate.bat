@echo off
cd /d %~dp0
git init
git pull https://github.com/M6yo/NameMCplus.git main
echo Now go to your browser's extension settings and press the refresh icon beside NameMC+
echo Once you've refreshed the extension,
pause
