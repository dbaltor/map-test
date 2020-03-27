#!/bin/bash
set -e
i=0
while IFS='' read -r line || [[ -n $line ]]; do
ARRAY[i]="$line"
i=$((i + 1))
done <"$1"

while :; do
for line in ${ARRAY[@]}; do
echo "$line",$(($RANDOM * 3 / 32768))
done
sleep 1
done