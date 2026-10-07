@echo off
title QM Asset Control Center - PM2 Stopper
echo ==================================================
echo   Stopping QM Asset Control Center...
echo ==================================================
echo.

call pm2 stop qm-frontend
call pm2 stop qm-backend

echo.
echo ==================================================
echo   System has been stopped!
echo ==================================================
echo.
pause
