


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
	node-gyp clean



#
#   Native
#


native-build : setup-build-dir pg.node


pg.node : 
	node-gyp configure build
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

setup : setup-compiler setup-linter check-node-gyp


setup-compiler :
	if [ ! -f .build/compiler.jar ]; \
	then \
	mkdir .build/ ; \
	wget http://dl.google.com/closure-compiler/compiler-latest.zip -O .build/compiler.zip ; \
	unzip .build/compiler.zip -d .build/ compiler.jar; \
	rm .build/compiler.zip > /dev/null ; \
	fi


setup-linter :
	which gjslint > /dev/null; \
	[ $$? -eq 0 ] || sudo pip install -U http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz;


check-node-gyp :
	if [ -z "$(shell npm list -g 2>/dev/null | grep node-gyp)" ]; \
	then \
	echo "\033[31mPlease, install node-gyp: sudo npm install -g node-gyp\033[0m"; \
	exit 1; \
	fi


setup-build-dir :
	mkdir -p bin/
