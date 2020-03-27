#!/bin/bash
set -e
exec ./files/readfile.sh ./files/test.csv | node server.js -f=./files/realtimelocation.csv -v=100 -r=2
