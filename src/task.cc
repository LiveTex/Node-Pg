/*
 * task.cc
 *
 *  Created on: May 29, 2012
 *      Author: kononencheg
 */

#include <stdlib.h>
#include <jemalloc/jemalloc.h>


#include "task.h"


db_task_t * task_alloc(task_process_handler process,
					task_result_handler handle_result) {

	db_task_t * task = (db_task_t *) malloc(sizeof(db_task_t));

	task->data = NULL;

	task->process = process;
	task->handle_result = handle_result;

	task->prev = NULL;
	task->next = NULL;

	task->result = (db_task_result_t *) malloc(sizeof(db_task_result_t));

	task->result->data = NULL;
	task->result->error = NULL;

	return task;
}


void task_free(db_task_t * task) {
	free(task->result);
	free(task);
}
