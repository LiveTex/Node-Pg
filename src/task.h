/*
 * task.h
 *
 *  Created on: May 29, 2012
 *      Author: kononencheg
 */

#ifndef TASK_H_
#define TASK_H_


#include <uv.h>

#include "connection.h"


typedef struct task_result_ task_result_t;
typedef struct task_ task_t;


typedef void (* task_process_handler) (void * data,
									   struct connection_ * connection,
									   task_result_t * result);


typedef void (* task_result_handler) (task_result_t * result,
									  struct connection_ * connection,
									  int argc, v8::Handle<v8::Value> * argv);


struct task_ {
	task_process_handler process;
	task_result_handler handle_result;

	task_t * next;
	task_t * prev;

	task_result_t * result;

	void * data;
};


struct task_result_ {
	char * error;
	void * data;
};


task_t * task_alloc(task_process_handler process,
					task_result_handler handle_result);

void task_free(task_t * task);


#endif /* TASK_H_ */
