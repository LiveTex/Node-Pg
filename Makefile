


CC = gcc 

CFLAGS = -fno-inline -O3 -Wall -fPIC -DPIC -pthread
LINK_FLAGS = -shared -pthread 

LIBS = pq v8 jemalloc

INCLUDE_DIRS = /usr/include/node /usr/include/postgresql /usr/include/jemalloc

VPATH = src

JS_BUILD_HOME ?= /usr/lib/js-build-tools
JS_ROOT_DIR  = ./

JS_CUSTOM_EXTERNS = lib/externs.js

include $(JS_BUILD_HOME)/js-variables.mk

MODULE_NAME ?= node-pg

#
#	Global
#


all: js native

check: js-test-compile js-test-lint

js: js-externs js-export

native: pg.node

clean: js-clean
	rm -rf bin/*

pg.node : pg.o \
		  utils.o \
		  pool.o \
		  connection.o \
		  query.o
	$(CC) -o bin/$@ \
	   	  $(addprefix bin/, $^) -L/opt/postgres/lib \
	   	  $(addprefix -l, $(LIBS)) $(LINK_FLAGS)

%.o : %.cc
	$(CC) $(CFLAGS) $(addprefix -I, $(INCLUDE_DIRS)) -o bin/$@  -c $<


include $(JS_BUILD_HOME)/js-rules.mk

