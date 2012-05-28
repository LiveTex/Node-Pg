/*
 * exec_task.cc
 *
 *  Created on: May 28, 2012
 *      Author: kononencheg
 */

#include <stdlib.h>

#include "errors.h"
#include "exec_task.h"

void handle_command_result(const exec_task_t * task) {
	const unsigned argc = 2;
	v8::Local<v8::Value> argv[argc] = {
		v8::Local<v8::Value>::New(v8::Null()),
		v8::Local<v8::Value>::New(v8::Null())
	};

	task->js_callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);
}


void handle_query_result(const exec_task_t * task) {
	int row_count = PQntuples(task->pg_result);
	int field_count = PQnfields(task->pg_result);

	int i, j;

	v8::Local<v8::String> * fields =
		(v8::Local<v8::String> *)
			malloc(sizeof(v8::Local<v8::String> *) * field_count);

	for (j = 0; j < field_count; ++j) {
		fields[j] = v8::String::New(PQfname(task->pg_result, j));
	}

	v8::Local<v8::Array> result = v8::Array::New(row_count);

	for (i = 0; i < row_count; ++i) {
		v8::Local<v8::Object> record = v8::Object::New();

		for (j = 0; j < field_count; ++j) {
			record->Set(fields[j],
						v8::String::New(PQgetvalue(task->pg_result, i , j)));
		}

		result->Set(i, record);
	}

	const unsigned argc = 2;
	v8::Local<v8::Value> argv[argc] = {
		v8::Local<v8::Value>::New(v8::Null()),
		result
	};

	task->js_callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);

	free(fields);
}


void handle_result_error(const exec_task_t * task) {
    const unsigned argc = 2;
    v8::Local<v8::Value> argv[argc] = {
    	create_error(PQresultErrorMessage(task->pg_result)),
		v8::Local<v8::Value>::New(v8::Null())
	};

	task->js_callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);
}


exec_task_t * exec_task_alloc(PGconn * connection,
							  v8::Local<v8::Function> callback) {

	exec_task_t * exec_task = (exec_task_t *) malloc(sizeof(exec_task_t));
	exec_task->js_callback = v8::Persistent<v8::Function>::New(callback);
	exec_task->pg_connection = connection;

	return exec_task;
}


void exec_task_free(exec_task_t * task) {
	task->js_callback.Dispose();
	PQclear(task->pg_result);
	free(task);
}


void exec_task_work(uv_work_t* work_request) {
    exec_task_t * task = (exec_task_t *) work_request->data;

	PGresult * result;
	do {
		result = PQgetResult(task->pg_connection);

		if (result != NULL) {
			task->pg_result = result;
		}
	} while (result != NULL);
}


void exec_task_handler(uv_work_t * work_request) {
    v8::HandleScope scope;

    exec_task_t * task = (exec_task_t *) work_request->data;

    switch (PQresultStatus(task->pg_result)) {
    	case PGRES_COMMAND_OK: {
    		handle_command_result(task);
    		break;
    	}

    	case PGRES_TUPLES_OK: {
    		handle_query_result(task);
    		break;
    	}

    	default: {
    		handle_result_error(task);
    		break;
    	}
    }

    exec_task_free(task);

    free(work_request);
}
