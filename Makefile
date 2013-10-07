


#
#   Native variables
#


CC = gcc 

C_FLAGS = -fno-inline -O3 -Wall -fPIC -DPIC -pthread
LINK_FLAGS = -shared -pthread 

LIBS = pq v8 jemalloc

INCLUDE_DIRS = /usr/include/node /usr/include/postgresql /usr/include/jemalloc

VPATH = src



#
#   JS variables
#

JS_COMPILER = java -jar .build/compiler.jar

JS_COMPILER_ARGS = --warning_level VERBOSE \
				--output_wrapper="$(shell cat lib/output-wrapper.js)" \
				--language_in=ECMASCRIPT5_STRICT \
				--debug --formatting PRETTY_PRINT \
			  --externs lib/externs.js


#
#   Common
#

all: js-build native-build


clean:
	rm -rf bin/*.o bin/*.node



#
#   Native
#


native-build : setup-build-dir pg.node


pg.node : 
	node-gyp clean configure build
	cp ./build/Release/pg.node ./bin


%.o : %.cc
	$(CC) $(C_FLAGS) $(addprefix -I, $(INCLUDE_DIRS)) -o bin/$@  -c $<



#
#	  JS
#


js-build : setup-build-dir index.js


js-lint : $(shell cat src.d)
	gjslint --beep --strict --custom_jsdoc_tags='namespace,event' $^;


js-check : $(shell cat src.d)
	$(JS_COMPILER) $(JS_COMPILER_ARGS) --compilation_level ADVANCED_OPTIMIZATIONS \
	               $(addprefix --js , $^)


index.js : $(shell cat src.d)
	$(JS_COMPILER) $(JS_COMPILER_ARGS) --compilation_level WHITESPACE_ONLY \
	               $(addprefix --js , $^) > bin/$@



#
#   Setup compiler and linter
#

setup : setup-compiler setup-linter


setup-compiler :
	if [ ! -f .build/compiler.jar ]; \
	then \
	mkdir .build/ ; \
	wget http://closure-compiler.googlecode.com/files/compiler-latest.zip -O .build/google-closure.zip ; \
	unzip .build/google-closure.zip -d .build/ compiler.jar ; \
	rm .build/google-closure.zip > /dev/null ; \
	fi


setup-linter :
	which gjslint > /dev/null; \
	[ $$? -eq 0 ] || sudo pip install -U http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz;


setup-build-dir :
	mkdir -p bin/
