#!/bin/bash

version=$1

# get all environment variables
export $(cat .env | xargs)

echo "copying apps with version ${version} to " $PLANNTT_DOWNLOADS
scp ./build/planntt-${version}.dmg \
    ./build/planntt-${version}-mac.zip \
    ./build/*.yml \
    ./build/*.yaml \
    $PLANNTT_DOWNLOADS
echo "done copying apps"
