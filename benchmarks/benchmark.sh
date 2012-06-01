#!/bin/bash

i=1
while [ $i -lt $4 ]
do
	echo '----------------------------------------------------';

	j=0
	while [ $j -lt $5 ]
	do
		node benchmarks/$1.js $2 $(( $3*$i ));

		j=$(( $j+1 ))
	done

	i=$(( $i+1 ))
done
