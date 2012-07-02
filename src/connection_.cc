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

#include "queue.h"


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
		v8::Local<v8::Value> argv[argc];

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

	connection->task_queue = (task_t *) malloc(sizeof(task_t));
	queue_init(connection->task_queue);

	connection->is_broken = false;

	connection->callback = v8::Persistent<v8::Function>::New(callback);

	return connection;
}


void connection_process(connection_t * connection) {
	if (connection->current_task == NULL) {
		queue_shift(connection->task_queue, connection->current_task);

		if (connection->current_task != NULL) {
			uv_work_t * work = (uv_work_t *) malloc(sizeof * work);
			work->data = connection;

			// ASYNC
			uv_queue_work
				(uv_default_loop(), work, connection_work, connection_handler);

			// SYNC
			// connection_work(work);
			// connection_handler(work);
		}
	}
}


void connection_break(connection_t * connection) {
	PQfinish(connection->descriptor);
	connection->is_broken = true;
}


void connection_push_task(connection_t * connection, task_t * task) {
	queue_push(connection->task_queue, task);
}


void connection_free(connection_t * connection) {
	task_t * task;

	queue_flush(connection->task_queue, task, task_free);

	connection->callback.Dispose();

	free(connection->task_queue);
	free(connection);
}
