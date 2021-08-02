@echo off
cd /d %~dp0
rmdir /Q /S NameMCplus
git clone https://github.com/M6yo/NameMCplus.git
echo Now go to your browser's extension settings and press the refresh icon beside NameMC+
echo Once you've refreshed the extension, press any key to close this window
pause