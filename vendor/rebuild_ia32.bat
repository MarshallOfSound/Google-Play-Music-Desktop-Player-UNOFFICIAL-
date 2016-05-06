cd ..
cd node_modules
rmdir /Q /S nslog\build 2>nul
.bin\electron-rebuild.cmd --arch=ia32 -f
