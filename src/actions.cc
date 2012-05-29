/*
 * actions.cc
 *
 *  Created on: May 29, 2012
 *      Author: kononencheg
 */

#include <stdlib.h>

#include <v8.h>

#include <libpq-fe.h>

#include "utils.h"
#include "actions.h"
#include "connection.h"


static v8::Persistent<v8::String> connect_event_type;
static v8::Persistent<v8::String> disconnect_event_type;
static v8::Persistent<v8::String> exec_event_type;


v8::Local<v8::Array> fetch_result(PGresult * result);

task_result_t * action_connect(connection_t * connection, void * data) {
	task_result_t * result = task_result_alloc(action_connect_result);

	connection->descriptor = PQconnectdb((char *) data);

	ConnStatusType status = PQstatus(connection->descriptor);
	if (status != CONNECTION_OK) {
		result->error = copy_string(PQerrorMessage(connection->descriptor));

		PQfinish(connection->descriptor);

		connection->status = CONNECTION_BROKEN;
	}

	return result;
}

void action_connect_result(connection_t * connection, task_result_t * result) {
	connect_event_type =
			v8::Persistent<v8::String>::New(v8::String::NewSymbol("connect"));

	v8::HandleScope scope;

	const unsigned argc = 3;
	v8::Local<v8::Value> argv[argc];
	
	argv[0] = connect_event_type->ToString();
	
	if (result->error == NULL) {
		argv[1] = v8::Local<v8::Value>::New(v8::Null());
	} else {
		argv[1] = create_error(result->error);
	}

	argv[2] = v8::Integer::New(result->task_id);

	connection_callback(connection, argc, argv);
}

task_result_t * action_disconnect(connection_t * connection, void * data) {
	task_result_t * result = task_result_alloc(action_disconnect_result);

	PQfinish(connection->descriptor);
	connection->status = CONNECTION_BROKEN;

	return result;
}

void action_disconnect_result(connection_t * connection, task_result_t * result) {
	disconnect_event_type =
		v8::Persistent<v8::String>::New(v8::String::NewSymbol("disconnect"));

	const unsigned argc = 3;
	v8::Local<v8::Value> argv[argc];

	argv[0] = disconnect_event_type->ToString();
	argv[1] = v8::Local<v8::Value>::New(v8::Null());
	argv[2] = v8::Integer::New(result->task_id);

	connection_callback(connection, argc, argv);
}


task_result_t * action_execute(connection_t * connection, void * data) {
	task_result_t * result = task_result_alloc(action_execute_result);

	PGresult * result_descriptor =
			PQexec(connection->descriptor, (char *) data);

	switch (PQresultStatus(result_descriptor)) {
		case PGRES_COMMAND_OK: {
			PQclear(result_descriptor);
			break;
		}

		case PGRES_TUPLES_OK: {
			result->data = result_descriptor;
			break;
		}

		default: {
			result->error = copy_string(PQresultErrorMessage(result_descriptor));
			PQclear(result_descriptor);
			break;
		}
	}

	return result;
}


void action_execute_result(connection_t * connection, task_result_t * result) {
	exec_event_type =
		v8::Persistent<v8::String>::New(v8::String::NewSymbol("exec"));

	const unsigned argc = 4;
	v8::Local<v8::Value> argv[argc];

	argv[0] = exec_event_type->ToString();

	if (result->error == NULL) {
		argv[1] = v8::Local<v8::Value>::New(v8::Null());

		if (result->data != NULL) {
			PGresult * result_descriptor = (PGresult *) result->data;
			argv[2] = fetch_result(result_descriptor);

			PQclear(result_descriptor);
			result->data = NULL;
		} else {
			argv[2] = v8::Local<v8::Value>::New(v8::Null());
		}
	} else {
		argv[1] = create_error(result->error);
		argv[2] = v8::Local<v8::Value>::New(v8::Null());
	}

	argv[3] = v8::Integer::New(result->task_id);

	connection_callback(connection, argc, argv);
}


v8::Local<v8::Array> fetch_result(PGresult * result_descriptor) {
	int row_count = PQntuples(result_descriptor);
	int field_count = PQnfields(result_descriptor);

	int i, j;

	v8::Local<v8::String> * fields =
		(v8::Local<v8::String> *)
			malloc(sizeof(v8::Local<v8::String> *) * field_count);

	for (j = 0; j < field_count; ++j) {
		fields[j] = v8::String::New(PQfname(result_descriptor, j));
	}

	v8::Local<v8::Array> result = v8::Array::New(row_count);

	for (i = 0; i < row_count; ++i) {
		v8::Local<v8::Object> record = v8::Object::New();

		for (j = 0; j < field_count; ++j) {
			record->Set(fields[j],
						v8::String::New(PQgetvalue(result_descriptor, i , j)));
		}

		result->Set(i, record);
	}

	free(fields);

	return result;
}
