/*
 * task.cc
 *
 *  Created on: May 29, 2012
 *      Author: kononencheg
 */


#include <jemalloc/jemalloc.h>


#include "task.h"


task_t * task_alloc(task_process_handler process,
					task_result_handler handle_result) {

	task_t * task = (task_t *) malloc(sizeof(task_t));

	task->data = NULL;

	task->process = process;
	task->handle_result = handle_result;

	task->prev = NULL;
	task->next = NULL;

	task->result = (task_result_t *) malloc(sizeof(task_result_t));

	task->result->data = NULL;
	task->result->error = NULL;

	return task;
}


void task_free(task_t * task) {
	free(task->result);
	free(task);
}
