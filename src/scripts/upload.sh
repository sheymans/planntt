#!/bin/bash

version=$1

echo "copying apps with version ${version}.."
scp ~/Workspaces/planntt/build/planntt-${version}.dmg \
    ~/Workspaces/planntt/build/planntt-${version}-mac.zip \
    ~/Workspaces/planntt/build/planntt-${version}-x86_64.AppImage \
    ~/Workspaces/planntt/build/*.yml \
    ~/Workspaces/planntt/build/*.yaml \
    iwokeupthismorning.net@s88322.gridserver.com:~/domains/planntt.com/html/downloads/
echo "done copying apps"