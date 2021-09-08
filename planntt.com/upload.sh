#!/bin/bash

# get all environment variables
export $(cat ../.env | xargs)

echo "generating changelog..."
pandoc -s CHANGELOG.md -o CHANGELOG.html

echo "copying website to " $WEBSITE
scp ./index.html ./CHANGELOG.html \
    $WEBSITE
echo "done copying website"
