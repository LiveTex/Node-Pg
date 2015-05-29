/*
 * task.cc
 *
 *  Created on: May 29, 2012
 *      Author: kononencheg
 */

#include <stdlib.h>
#include <jemalloc/jemalloc.h>


#include "task.h"


task_pt * task_alloc(task_process_handler process,
					task_result_handler handle_result) {

	task_pt * task = (task_pt *) malloc(sizeof(task_pt));

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


void task_free(task_pt * task) {
	free(task->result);
	free(task);
}
