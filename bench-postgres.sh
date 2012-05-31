#!/bin/bash

node bench-postgres.js 10000 && sleep 1;
node bench-postgres.js 20000 && sleep 1;
node bench-postgres.js 30000 && sleep 1;
node bench-postgres.js 40000 && sleep 1;
node bench-postgres.js 50000 && sleep 1;
node bench-postgres.js 60000 && sleep 1;
node bench-postgres.js 70000 && sleep 1;
node bench-postgres.js 80000 && sleep 1;
node bench-postgres.js 90000 && sleep 1;

node bench-postgres.js 100000 && sleep 1;
node bench-postgres.js 200000 && sleep 1;
node bench-postgres.js 300000 && sleep 1;
node bench-postgres.js 400000 && sleep 1;
node bench-postgres.js 500000 && sleep 1;

