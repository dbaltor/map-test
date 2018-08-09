#!/bin/bash
i=0
while IFS='' read -r line || [[ -n $line ]]; do
ARRAY[i]="$line"
i=$((i + 1))
done <"$1"

while :; do
for line in ${ARRAY[@]}; do
echo "$line",$(($RANDOM * 6 / 32768 + 1))
done
sleep 1
done