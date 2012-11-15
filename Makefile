
CC = gcc 

CFLAGS = -fno-inline -O3 -Wall -fPIC -DPIC -pthread
LINK_FLAGS = -shared -pthread 

LIBS = pq v8 jemalloc

BUILD_DIR = bin
INCLUDE_DIRS = /usr/include/node /usr/include/postgresql /usr/include/jemalloc

VPATH = src

JS_ROOT_DIR  = ./
JS_DEPS_DIRS =
JS_CUSTOM_EXTERNS = lib/externs.js

include build/js-variables.mk

MODULE_NAME ?= pg
INSTALL_PREFIX ?= /usr/lib/

#
#	Global
#


all : pg.node js-export


clean : js-clean
	rm -rf $(BUILD_DIR)/*


install :
	mkdir -p $(INSTALL_PREFIX)/node/$(MODULE_NAME)/bin/;
	mkdir -p $(INSTALL_PREFIX)/node/$(MODULE_NAME)/externs/;
	cp package.json $(INSTALL_PREFIX)/node/$(MODULE_NAME)/;
	cp bin/index.js $(INSTALL_PREFIX)/node/$(MODULE_NAME)/bin/;
	cp bin/pg.node $(INSTALL_PREFIX)/node/$(MODULE_NAME)/bin/;
	cp externs/pg.js $(INSTALL_PREFIX)/node/$(MODULE_NAME)/externs/;


uninstall :
	rm -rf $(INSTALL_PREFIX)/node/$(MODULE_NAME);


pg.node : pg.o \
		  utils.o \
		  pool.o \
		  connection.o \
		  query.o
	$(CC) -o $(BUILD_DIR)/$@ \
	   	  $(addprefix $(BUILD_DIR)/, $^) \
	   	  $(addprefix -l, $(LIBS)) $(LINK_FLAGS)

%.o : %.cc
	$(CC) $(CFLAGS) $(addprefix -I, $(INCLUDE_DIRS)) -o $(BUILD_DIR)/$@  -c $<


include build/js-rules.mk


