/*
 * js_connection.cc
 *
 *  Created on: May 29, 2012
 *      Author: kononencheg
 */


#include <stdlib.h>

#include <uv.h>

#include "actions.h"
#include "connection.h"
#include "utils.h"


void connection_work(uv_work_t * work) {
	connection_t * connection = (connection_t *) work->data;

	task_t * task = connection->current_task;
	if (task != NULL) {
		task->process(task->data, connection, task->result);
	}
}


void connection_handler(uv_work_t * work) {
	v8::HandleScope scope;

	connection_t * connection = (connection_t *) work->data;
	task_t * task = connection->current_task;

	if (task != NULL) {
		const unsigned argc = 4;
		v8::Handle<v8::Value> argv[argc];

		task->handle_result(task->result, connection, argc, argv);

		connection->callback->Call
				(v8::Context::GetCurrent()->Global(), argc, argv);
	}

	task_free(connection->current_task);
	connection->current_task = NULL;

	if (connection->is_broken) {
		connection_free(connection);
	} else {
		connection_process(connection);
	}

	free(work);
}


connection_t * connection_alloc(v8::Local<v8::Function> callback) {
	connection_t * connection =	(connection_t *) malloc(sizeof(connection_t));

	connection->descriptor = NULL;
	connection->current_task = NULL;

	connection->task_queue_origin = (task_t *) malloc(sizeof(task_t));
	connection->task_queue_origin->next = connection->task_queue_origin;
	connection->task_queue_origin->prev = connection->task_queue_origin;

	connection->is_broken = false;

	connection->callback = v8::Persistent<v8::Function>::New(callback);

	return connection;
}


void connection_process(connection_t * connection) {
	if (connection->current_task == NULL) {
		connection->current_task = connection_shift_task(connection);

		if (connection->current_task != NULL) {
			uv_work_t * work = (uv_work_t *) malloc(sizeof(uv_work_t));
			work->data = connection;

			uv_queue_work
				(uv_default_loop(), work, connection_work, connection_handler);
		}
	}

}


void connection_push_task(connection_t * connection, task_t * task) {
	task_t * tail = connection->task_queue_origin->next;

	tail->prev = task;
	task->next = tail;

	connection->task_queue_origin->next = task;
	task->prev = connection->task_queue_origin;
}


task_t * connection_shift_task(connection_t * connection) {
	if (connection->task_queue_origin->prev != connection->task_queue_origin) {
		task_t * head = connection->task_queue_origin->prev;

		head->prev->next = connection->task_queue_origin;
		connection->task_queue_origin->prev = head->prev;

		head->next = NULL;
		head->prev = NULL;

		return head;
	}

	return NULL;
}


void connection_free(connection_t * connection) {
	task_t * task = connection_shift_task(connection);
	while (task != NULL) {
		task_free(task);
		task = connection_shift_task(connection);
	}

	connection->callback.Dispose();

	free(connection->task_queue_origin);
	free(connection);
}
