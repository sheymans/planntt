#!/bin/bash

version=$1

echo "copying apps with version ${version}.."
scp ~/Workspaces/planntt/build/planntt-${version}.dmg ~/Workspaces/planntt/build/planntt\ Setup\ ${version}.exe ~/Workspaces/planntt/build/planntt-${version}.tar.gz iwokeupthismorning.net@s88322.gridserver.com:~/domains/planntt.com/html/downloads/
echo "done copying apps"