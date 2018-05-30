#!/bin/bash

export WIN_CSC_LINK=file:///Users/sheymans/s/keys/windows_digicert.p12
read -sp "Certificate Password: " certPassword
export WIN_CSC_KEY_PASSWORD=$certPassword;
echo "password read: " $WIN_CSC_KEY_PASSWORD