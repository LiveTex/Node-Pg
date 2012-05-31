#!/bin/bash

node bench-pg.js 10000 && sleep 1;
node bench-pg.js 20000 && sleep 1;
node bench-pg.js 30000 && sleep 1;
node bench-pg.js 40000 && sleep 1;
node bench-pg.js 50000 && sleep 1;
node bench-pg.js 60000 && sleep 1;
node bench-pg.js 70000 && sleep 1;
node bench-pg.js 80000 && sleep 1;
node bench-pg.js 90000 && sleep 1;

node bench-pg.js 100000 && sleep 1;
node bench-pg.js 200000 && sleep 1;
node bench-pg.js 300000 && sleep 1;
node bench-pg.js 400000 && sleep 1;
node bench-pg.js 500000 && sleep 1;

