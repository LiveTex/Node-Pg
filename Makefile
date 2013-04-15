
DESTDIR = 

CC = gcc 

CFLAGS = -fno-inline -O3 -Wall -fPIC -DPIC -pthread
LINK_FLAGS = -shared -pthread 

LIBS = pq v8 jemalloc

BUILD_DIR = bin
INCLUDE_DIRS = /usr/include/node /usr/include/postgresql /usr/include/jemalloc

VPATH = src

JS_BUILD_HOME ?= /usr/lib/js-build-tools
JS_ROOT_DIR  = ./
JS_DEPS_DIRS = /usr/lib/node/qs/
JS_CUSTOM_EXTERNS = lib/externs.js

JS_BUILD_HOME=/usr/lib/js-build-tools

include $(JS_BUILD_HOME)/js-variables.mk

MODULE_NAME ?= pg
INSTALL_PREFIX ?= /usr/lib/

#
#	Global
#


all : pg.node js-externs js-export


build: js-externs js-export


clean : js-clean
	rm -rf $(BUILD_DIR)/*


install :
	mkdir -p $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/bin/;
	mkdir -p $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/externs/;
	cp package.json $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/;
	cp bin/index.js $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/bin/;
	cp bin/pg.node $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/bin/;
	cp externs/*.js $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME)/externs/;


uninstall :
	rm -rf $(DESTDIR)$(INSTALL_PREFIX)/node/$(MODULE_NAME);


pg.node : pg.o \
		  utils.o \
		  pool.o \
		  connection.o \
		  query.o
	$(CC) -o $(BUILD_DIR)/$@ \
	   	  $(addprefix $(BUILD_DIR)/, $^) -L/opt/postgres/lib \
	   	  $(addprefix -l, $(LIBS)) $(LINK_FLAGS)

%.o : %.cc
	$(CC) $(CFLAGS) $(addprefix -I, $(INCLUDE_DIRS)) -o $(BUILD_DIR)/$@  -c $<


include $(JS_BUILD_HOME)/js-rules.mk

