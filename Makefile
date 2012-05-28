
CC = gcc 

CFLAGS = -g3 -fno-inline -O3 -Wall -fPIC
LINK_FLAGS = -shared

LIBS = pq v8

BUILD_DIR = bin
INCLUDE_DIRS = /usr/local/include/node /usr/include/node /usr/include/postgresql 

VPATH = src

all : pg.node 

pg.node : pg.o \
		  errors.o \
		  exec_task.o \
		  connect_task.o 
	$(CC) $(LINK_FLAGS) -o $(BUILD_DIR)/$@ \
	   	  $(addprefix $(BUILD_DIR)/, $^) \
	   	  $(addprefix -l, $(LIBS)) 

%.o : %.cc
	$(CC) $(CFLAGS) $(addprefix -I, $(INCLUDE_DIRS)) -o $(BUILD_DIR)/$@  -c $< 

clean :
	rm -rf $(BUILD_DIR)/*.*
	