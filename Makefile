


#
#   Native variables
#


CC = gcc 

CFLAGS = -fno-inline -O3 -Wall -fPIC -DPIC -pthread
LINK_FLAGS = -shared -pthread 

LIBS = pq v8 jemalloc

INCLUDE_DIRS = /usr/include/node /usr/include/postgresql /usr/include/jemalloc

VPATH = src



#
#   JS variables
#

JS_COMPILER = java -jar /usr/lib/js-build-tools/tools/compiler.jar

JS_COMPILER_ARGS = --warning_level VERBOSE \
				--output_wrapper="$(shell cat lib/output-wrapper.js)" \
				--language_in=ECMASCRIPT5_STRICT \
				--debug --formatting PRETTY_PRINT \
			  --externs lib/externs.js



#
#   Native
#


native-build : pg.node


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



#
#	  JS
#


js-build : index.js


js-lint : $(shell cat src.d)
	gjslint --beep --strict --custom_jsdoc_tags='namespace,event' $^;


js-check : $(shell cat src.d)
	$(JS_COMPILER) $(JS_COMPILER_ARGS) --compilation_level ADVANCED_OPTIMIZATIONS \
	               $(addprefix --js , $^)


index.js : $(shell cat src.d)
	$(JS_COMPILER) $(JS_COMPILER_ARGS) --compilation_level WHITESPACE_ONLY \
	               $(addprefix --js , $^) > bin/$@


#
#   Clean
#

clean: js-clean
	rm -rf bin/*
