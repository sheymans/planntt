#!/bin/bash

# get all environment variables
export $(cat .env | xargs)

echo "generating changelog..."
pandoc -s ./planntt.com/CHANGELOG.md -o ./planntt.com/CHANGELOG.html

echo "copying website to " $WEBSITE
scp ./planntt.com/index.html ./planntt.com/CHANGELOG.html \
    $WEBSITE
echo "done copying website"
