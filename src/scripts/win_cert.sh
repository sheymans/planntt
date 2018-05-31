#!/bin/bash

export WIN_CSC_LINK=file:///project/keys/windows_digicert.p12
read -sp "Certificate Password: " certPassword
export WIN_CSC_KEY_PASSWORD=$certPassword;
echo "Cert location: " $WIN_CSC_LINK
node .electron-vue/build.js && electron-builder -w --x64 --ia32