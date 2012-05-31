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


static v8::Persistent<v8::Value> connection_action_type;
static v8::Persistent<v8::Value> disconnection_action_type;
static v8::Persistent<v8::Value> execution_action_type;

static v8::Persistent<v8::Value> null_arg;


v8::Local<v8::Array> fetch_result(PGresult * result);


v8::Handle<v8::Value> get_null_arg() {
	null_arg = v8::Persistent<v8::Value>::New(v8::Null());

	return null_arg;
}



void process_connection(void * data, connection_t * connection,
						task_result_t * result) {

	connection->descriptor = PQconnectdb((char *) data);

	ConnStatusType status = PQstatus(connection->descriptor);
	if (status != CONNECTION_OK) {
		result->error = copy_string(PQerrorMessage(connection->descriptor));

		PQfinish(connection->descriptor);

		connection->is_broken = true;
	}

	free(data);
}


void handle_connection_result(task_result_t * result,
							  connection_t * connection,
							  int argc, v8::Handle<v8::Value> * argv) {

	connection_action_type =
			v8::Persistent<v8::Integer>::New(v8::Integer::New(0));

	argv[0] = v8::Boolean::New(connection->is_broken);
	argv[1] = connection_action_type;

	if (result->error == NULL) {
		argv[2] = get_null_arg();
	} else {
		argv[2] = create_error(result->error);
		free(result->error);
	}

	argv[3] = get_null_arg();
}

void process_disconnection(void * data, connection_t * connection,
						   task_result_t * result) {
	PQfinish(connection->descriptor);

	connection->is_broken = true;
}

void handle_disconnection_result(task_result_t * result,
								 struct connection_ * connection,
								 int argc, v8::Handle<v8::Value> * argv) {

	disconnection_action_type =
		v8::Persistent<v8::Integer>::New(v8::Integer::New(-1));

	argv[0] = v8::Boolean::New(connection->is_broken);
	argv[1] = disconnection_action_type;
	argv[2] = get_null_arg();
	argv[3] = get_null_arg();
}



void process_execution(void * data, connection_t * connection,
					   task_result_t * result) {

	ConnStatusType status = PQstatus(connection->descriptor);

	if (status != CONNECTION_OK) {
		result->error = copy_string(PQerrorMessage(connection->descriptor));

		PQfinish(connection->descriptor);

		connection->is_broken = true;
	} else {
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
				result->error =
						copy_string(PQresultErrorMessage(result_descriptor));

				PQclear(result_descriptor);
				break;
			}
		}
	}

	free(data);
}

void handle_execution_result(task_result_t * result,
							 struct connection_ * connection,
							 int argc, v8::Handle<v8::Value> * argv) {


	execution_action_type =
		v8::Persistent<v8::Integer>::New(v8::Integer::New(1));

	argv[0] = v8::Boolean::New(connection->is_broken);
	argv[1] = execution_action_type;

	if (result->error == NULL) {
		argv[2] = get_null_arg();
	} else {
		argv[2] = create_error(result->error);
		free(result->error);
	}

	if (result->data == NULL) {
		argv[3] = get_null_arg();
	} else {
		PGresult * result_descriptor = (PGresult * ) result->data;

		argv[3] = fetch_result(result_descriptor);

		PQclear(result_descriptor);
	}
}


v8::Local<v8::Array> fetch_result(PGresult * result_descriptor) {
	int row_count = PQntuples(result_descriptor);
	int field_count = PQnfields(result_descriptor);
	int i, j;

	v8::Local<v8::Array> result = v8::Array::New(row_count);

	v8::Local<v8::String> * fields =
		(v8::Local<v8::String> *)
			malloc(sizeof(v8::Local<v8::String> *) * field_count);

	for (j = 0; j < field_count; ++j) {
		fields[j] = v8::String::New(PQfname(result_descriptor, j));
	}

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
