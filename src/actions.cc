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
#include "data_table.h"


static v8::Persistent<v8::Value> connection_action_type;
static v8::Persistent<v8::Value> disconnection_action_type;
static v8::Persistent<v8::Value> execution_action_type;

static v8::Persistent<v8::Value> null_arg;



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
		PGresult * rd = PQexec(connection->descriptor, (char *) data);

		switch (PQresultStatus(rd)) {
			case PGRES_COMMAND_OK: {
				break;
			}

			case PGRES_TUPLES_OK: {
				data_table_t * table =
						data_table_alloc(PQntuples(rd), PQnfields(rd));

				data_table_populate(table, rd);

				result->data = table;

				break;
			}

			default: {
				result->error = copy_string(PQresultErrorMessage(rd));
				break;
			}
		}

		PQclear(rd);
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
		data_table_t * table = (data_table_t * ) result->data;

		argv[3] = data_table_get_array(table);

		data_table_free(table);
	}
}
