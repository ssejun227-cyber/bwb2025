@echo off
chcp 65001 > nul
title BWB 2025 Server

echo ========================================
echo   BWB 2025 로컬 서버
echo ========================================
echo.

cd /d "%~dp0"

echo 서버를 시작합니다...
echo.
echo 사이트 주소: http://localhost:3000
echo 관리자 주소: http://localhost:3000/system/admin/
echo.
echo 종료하려면 이 창을 닫거나 Ctrl+C를 누르세요.
echo ========================================
echo.

node system/server.js

pause
