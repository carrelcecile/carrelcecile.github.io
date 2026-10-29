#!/bin/bash
set -e
SRC=~/Desktop/Personal
REPO=~/carrelcecile.github.io

ZIP=$(ls -t "$SRC"/files*.zip 2>/dev/null | head -1)
[ -z "$ZIP" ] && { echo "No files*.zip found in $SRC"; exit 1; }
echo "Using $ZIP"

cd "$REPO" && git pull --rebase -q

TMP=$(mktemp -d)
unzip -o -q "$ZIP" -d "$TMP"
cp -R "$TMP"/. "$REPO"/
rm -rf "$TMP"

cd "$REPO"
git add -A
git commit -m "Bio and page copy in the first person"
git push
echo "Deployed."
