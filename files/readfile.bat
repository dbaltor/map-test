@echo off

setlocal EnableDelayedExpansion

set "file=%1"
set /A i=0

for /F "usebackq delims=" %%a in ("%file%") do (
set /A i+=1
call set array[!i!]=%%a
call set n=%%i%%
)
:loop
for /L %%i in (1,1,%n%) do (
call SET /A color=!Random! * 3 / 32768
call echo %%array[%%i]%%,!color!
)
timeout 1 > NUL
goto loop