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


typedef task_result_t * (* task_action_f) (struct connection_ * connection,
										   void * data);


typedef void (* task_result_action_f) (struct connection_ * connection,
									   task_result_t * result);


struct task_ {
	size_t id;

	task_action_f action;

	task_t * next;
	task_t * prev;

	void * data;
};


struct task_result_ {
	size_t task_id;

	task_result_action_f action;

	task_result_t * next;
	task_result_t * prev;

	char * error;
	void * data;
};


task_t * task_alloc(task_action_f action);
task_t * task_alloc(task_action_f action, void * data);

task_result_t * task_result_alloc(task_result_action_f action);
task_result_t * task_result_alloc(task_result_action_f action, void * data);


void task_free(task_t * task);

void task_result_free(task_result_t * result);


#endif /* TASK_H_ */
