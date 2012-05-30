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


void connection_work(uv_work_t * work) {
	connection_t * connection = (connection_t *) work->data;

	size_t i = 0;

	task_t * task = connection_shift_task(connection);
	while (task != NULL) {
		task_result_t * result = NULL;

		if (task->action != NULL) {
			result = task->action(connection, task->data);
		}

		if (result != NULL) {
			result->task_id = task->id;

			connection_push_result(connection, result);

			i++;
		}

		if (i >= 16 && connection->status == CONNECTION_BUSY) {
			connection->status = CONNECTION_LOADED;
		}

		task_free(task);

		if (connection->status != CONNECTION_BUSY) {
			break;
		}

		task = connection_shift_task(connection);
	}

	if (connection->status == CONNECTION_BUSY) {
		connection->status = CONNECTION_FREE;
	}
}


void connection_handler(uv_work_t * work) {
	v8::HandleScope scope;

	connection_t * connection = (connection_t *) work->data;

	task_result_t * result = connection_shift_result(connection);
	while (result != NULL) {
		if (result->action != NULL) {
			result->action(connection, result);
		}

		task_result_free(result);

		result = connection_shift_result(connection);
	}

	if (connection->status == CONNECTION_BROKEN) {
		connection_free(connection);
	}

	if (connection->status == CONNECTION_LOADED) {
		connection_process(connection);
	}

	free(work);
}


connection_t * connection_alloc(v8::Local<v8::Function> callback) {
	connection_t * connection =	(connection_t *) malloc(sizeof(connection_t));

	connection->task_origin = (task_t *) malloc(sizeof(task_t));
	connection->task_origin->next = connection->task_origin;
	connection->task_origin->prev = connection->task_origin;

	connection->result_origin = (task_result_t *) malloc(sizeof(task_result_t));
	connection->result_origin->next = connection->result_origin;
	connection->result_origin->prev = connection->result_origin;

	connection->last_task_id = 0;
	connection->descriptor = NULL;
	connection->status = CONNECTION_FREE;
	connection->callback = v8::Persistent<v8::Function>::New(callback);

	return connection;
}


void connection_process(connection_t * connection) {
	uv_work_t * work = (uv_work_t *) malloc(sizeof(uv_work_t));
	work->data = connection;

	connection->status = CONNECTION_BUSY;

	uv_queue_work(uv_default_loop(), work, connection_work, connection_handler);
}


void connection_push_task(connection_t * connection, task_t * task) {
	task_t * tail = connection->task_origin->next;

	tail->prev = task;
	task->next = tail;

	connection->task_origin->next = task;
	task->prev = connection->task_origin;

	task->id = connection->last_task_id++;
}


task_t * connection_shift_task(connection_t * connection) {
	if (connection->task_origin->prev != connection->task_origin) {
		task_t * head = connection->task_origin->prev;

		head->prev->next = connection->task_origin;
		connection->task_origin->prev = head->prev;

		head->next = NULL;
		head->prev = NULL;

		return head;
	}

	return NULL;
}


void connection_push_result(connection_t * connection, task_result_t * result) {
	task_result_t * tail = connection->result_origin->next;

	tail->prev = result;
	result->next = tail;

	connection->result_origin->next = result;
	result->prev = connection->result_origin;
}


task_result_t * connection_shift_result(connection_t * connection) {
	if (connection->result_origin->prev != connection->result_origin) {
		task_result_t * head = connection->result_origin->prev;

		head->prev->next = connection->result_origin;
		connection->result_origin->prev = head->prev;

		head->next = NULL;
		head->prev = NULL;

		return head;
	}

	return NULL;
}

void connection_callback(connection_t * connection, const unsigned int argc,
						 v8::Local<v8::Value> argv[]) {
	connection->callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);
}


void connection_free(connection_t * connection) {
	task_result_t * result = connection_shift_result(connection);
	while (result != NULL) {
		task_result_free(result);
		result = connection_shift_result(connection);
	}

	task_t * task = connection_shift_task(connection);
	while (task != NULL) {
		task_free(task);
		task = connection_shift_task(connection);
	}

	connection->callback.Dispose();

	free(connection->result_origin);
	free(connection->task_origin);
	free(connection);
}

