
CC = gcc 

CFLAGS = -fno-inline -O3 -Wall -fPIC -DPIC -pthread
LINK_FLAGS = -shared -pthread 

LIBS = pq v8 jemalloc

INCLUDE_DIRS = /usr/include/node /usr/include/postgresql /usr/include/jemalloc

VPATH = src

JS_BUILD_HOME ?= /usr/lib/js-build-tools
JS_ROOT_DIR  = ./
JS_DEPS_DIRS = /usr/lib/node/node-util
JS_CUSTOM_EXTERNS = lib/externs.js

JS_BUILD_HOME=/usr/lib/js-build-tools

include $(JS_BUILD_HOME)/js-variables.mk

MODULE_NAME ?= pg
INSTALL_PREFIX ?= /usr/lib/

#
#	Global
#


all: build

check: js-test-compile js-test-lint

build: js-externs js-export

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

install :
	mkdir -p $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/bin/;
	mkdir -p $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/externs/;
	cp package.json $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/;
	cp bin/index.js $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/bin/;
	cp bin/pg.node $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/bin/;
	cp externs/index.js $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/externs/;



include $(JS_BUILD_HOME)/js-rules.mk

