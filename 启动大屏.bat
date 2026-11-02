@echo off
chcp 65001 >nul 2>&1
title 浦江水晶产业园 - 智能画像大屏

echo.
echo  ================================
echo   浦江水晶产业园 智能画像大屏
echo  ================================
echo.

pushd "%~dp0"
if errorlevel 1 (
    echo  [错误] 无法进入项目目录
    pause
    exit /b
)

if not exist "node_modules\" (
    echo  正在安装依赖...
    call npm install
    echo.
)

echo  停止旧服务...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /C:":3001"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo  正在启动服务器...
echo.
echo  请等待浏览器自动打开，或手动访问:
echo  http://localhost:3001
echo.
echo  ================================

:: 不用 strictPort，避免端口冲突时闪退
start http://localhost:3001
call npx vite --port=3001 --host=0.0.0.0

pause
