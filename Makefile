
# ADVANCED_OPTIMIZATIONS WHITESPACE_ONLY

JSC = java -jar utils/compiler.jar \
		   --warning_level VERBOSE \
		   --compilation_level ADVANCED_OPTIMIZATIONS \
		   --formatting PRETTY_PRINT --debug

EXTERNS = node-externs.js pg-externs.js

CC = clang 

CFLAGS = -g3 -fno-inline -O3 -Wall -fPIC -DPIC -pthread
LINK_FLAGS = -shared -pthread

LIBS = pq v8

BUILD_DIR = bin
INCLUDE_DIRS = /usr/include/node /usr/include/postgresql 

VPATH = src


#
#	Global
#


all : cpp js


clean :
	rm -rf $(BUILD_DIR)/*


#
#	C++
#


cpp : pg.node


pg.node : pg.o \
		  utils.o \
		  actions.o \
		  task.o \
		  connection.o 
	$(CC) -o $(BUILD_DIR)/$@ \
	   	  $(addprefix $(BUILD_DIR)/, $^) \
	   	  $(addprefix -l, $(LIBS)) $(LINK_FLAGS)


%.o : %.cc
	$(CC) $(CFLAGS) $(addprefix -I, $(INCLUDE_DIRS)) -o $(BUILD_DIR)/$@  -c $<


#
#	JavaScript
#


js : index.js
	cat lib/requires.js > /tmp/out && \
	cat $(addprefix $(BUILD_DIR)/, $^) >> /tmp/out && \
	mv /tmp/out $(addprefix $(BUILD_DIR)/, $^)


index.js : lib/pg/pg.js \
		   lib/pg/pool.js \
		   lib/pg/query.js \
		   lib/pg/query-queue.js \
		   lib/pg/connection.js \
		   lib/exports.js
	$(JSC) $(addprefix --js , $^) \
		   $(addprefix --externs lib/, $(EXTERNS)) \
		   $(addprefix --js_output_file $(BUILD_DIR)/, $@)

	
