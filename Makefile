

JSC = java -jar utils/compiler.jar \
		   --warning_level VERBOSE \
		   --compilation_level ADVANCED_OPTIMIZATIONS \
		   --formatting PRETTY_PRINT --debug

EXTERNS = node-externs.js pg-externs.js

CC = clang 

CFLAGS = -g3 -fno-inline -O3 -Wall -fPIC
LINK_FLAGS = -shared

LIBS = pq v8

BUILD_DIR = bin
INCLUDE_DIRS = /usr/local/include/node \
			   /usr/include/node \
			   /usr/include/postgresql 

VPATH = src

all : cpp js

cpp : pg.node

pg.node : pg.o \
		  errors.o \
		  exec_task.o \
		  connect_task.o 
	$(CC) $(LINK_FLAGS) -o $(BUILD_DIR)/$@ \
	   	  $(addprefix $(BUILD_DIR)/, $^) \
	   	  $(addprefix -l, $(LIBS)) 

%.o : %.cc
	$(CC) $(CFLAGS) $(addprefix -I, $(INCLUDE_DIRS)) -o $(BUILD_DIR)/$@  -c $<


js : index.js
	cat lib/requires.js > /tmp/out && \
	cat $(addprefix $(BUILD_DIR)/, $^) >> /tmp/out && \
	mv /tmp/out $(addprefix $(BUILD_DIR)/, $^)


index.js : lib/pg/pg.js \
		   lib/pg/connection.js \
		   lib/exports.js
	$(JSC) $(addprefix --js , $^) \
		   $(addprefix --externs lib/, $(EXTERNS)) \
		   $(addprefix --js_output_file $(BUILD_DIR)/, $@)


clean :
	rm -rf $(BUILD_DIR)/*.o $(BUILD_DIR)/*.node
	