#!/bin/zsh
# Renders slides.html into every format folder. Usage: ./render.sh
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
shot(){ mkdir -p $1; for i in 1 2 3 4; do "$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=$5 --window-size=$3,$4 --virtual-time-budget=6000 --screenshot="$1/hypebox-$i.png" "file://$PWD/slides.html?f=$2&s=$i" 2>/dev/null; done; }
shot feed-4x5 portrait 1080 1350 1
shot linkedin-4x5 portrait 1080 1350 1.1111111
shot square-1x1 square 1080 1080 1
shot story-9x16 story 1080 1920 1
shot landscape-16x9 landscape 1920 1080 1
