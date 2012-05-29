/*
 * task.cc
 *
 *  Created on: May 29, 2012
 *      Author: kononencheg
 */


#include <stdlib.h>


#include "task.h"


task_t * task_alloc(task_action_f action, void * data) {
	task_t * task = (task_t *) malloc(sizeof(task_t));

	task->id = 0;
	task->action = action;
	task->data = data;
	task->prev = NULL;
	task->next = NULL;

	return task;
}


task_t * task_alloc(task_action_f action) {
	return task_alloc(action, NULL);
}


void task_free(task_t * task) {
	if (task->data != NULL) {
		free(task->data);
	}

	free(task);
}


task_result_t * task_result_alloc(task_result_action_f action, void * data) {
	task_result_t * result = (task_result_t *) malloc(sizeof(task_result_t));

	result->task_id = 0;

	result->action = action;
	result->data = data;

	result->error = NULL;

	result->prev = NULL;
	result->next = NULL;

	return result;
}


task_result_t * task_result_alloc(task_result_action_f action) {
	return task_result_alloc(action, NULL);
}


void task_result_free(task_result_t * result) {
	if (result->data != NULL) {
		free(result->data);
	}

	if (result->error != NULL) {
		free(result->error);
	}

	free(result);
}
