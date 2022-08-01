#!/usr/bin/env fish

set res 0

set res[1] 60
set res[2] 76
set res[3] 120
set res[4] 152
set res[5] 192

set res[6] 16
set res[7] 32
set res[8] 48
set res[9] 64
set res[10] 128
set res[11] 256

for i in $res
    echo $i
    flatpak run org.inkscape.Inkscape -w $i -h $i icon.svg -o icon-$i.png &
end



wait


convert icon-*.png icon.ico
