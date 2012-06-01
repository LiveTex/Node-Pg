#!/bin/bash

i=0
while [ $i -le $2 ]
do
	j=0
	while [ $j -lt $4 ]
	do
		node bench-$1.js $(( $3*$i ));

		j=$(( $j+1 ))
	done

	i=$(( $i+1 ))
done
