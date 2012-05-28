/*
 * connect_task.cc
 *
 *  Created on: May 28, 2012
 *      Author: kononencheg
 */

#include <stdlib.h>

#include "errors.h"
#include "connect_task.h"


connect_task_t * connect_task_alloc(PGconn * connection,
							  	    v8::Local<v8::Function> callback) {

	connect_task_t * connect_task =
			(connect_task_t *) malloc(sizeof(connect_task_t));

	connect_task->js_callback = v8::Persistent<v8::Function>::New(callback);
	connect_task->pg_connection = connection;

	return connect_task;
}


void connect_task_free(connect_task_t * task) {
	task->js_callback.Dispose();
	free(task);
}


void connect_task_work(uv_work_t* work_request) {
    connect_task_t * task = (connect_task_t *) work_request->data;

    PostgresPollingStatusType status;
    do {
    	status = PQconnectPoll(task->pg_connection);
	} while (status != PGRES_POLLING_OK &&
			 status != PGRES_POLLING_FAILED);
}


void connect_task_handler(uv_work_t * work_request) {
    v8::HandleScope scope;

    connect_task_t * task = (connect_task_t *) work_request->data;
	const unsigned argc = 2;
	v8::Local<v8::Value> argv[argc];

    if (PQstatus(task->pg_connection) == CONNECTION_OK) {
    	argv[0] = v8::Local<v8::Value>::New(v8::Null());
    	argv[1] = v8::External::Wrap(task->pg_connection);
	} else {
		argv[0] = create_error(PQerrorMessage(task->pg_connection));
    	argv[1] = v8::Local<v8::Value>::New(v8::Null());

		PQfinish(task->pg_connection);
	}

	task->js_callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);

    connect_task_free(task);

    free(work_request);
}
