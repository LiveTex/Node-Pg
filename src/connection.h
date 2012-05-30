/*
 * js_connection.h
 *
 *  Created on: May 29, 2012
 *      Author: kononencheg
 */

#ifndef CONNECTION_H_
#define CONNECTION_H_


#include <v8.h>

#include <libpq-fe.h>

#include "task.h"


enum connection_status {
	CONNECTION_BUSY = 0,
	CONNECTION_FREE,
	CONNECTION_BROKEN,
	CONNECTION_LOADED
};


typedef struct connection_ {
	PGconn * descriptor;

	connection_status status;

	size_t last_task_id;

	struct task_ * task_origin;
	struct task_result_ * result_origin;

	v8::Persistent<v8::Function> callback;
} connection_t;


connection_t * connection_alloc(v8::Local<v8::Function> callback);


void connection_process(connection_t * connection);


void connection_push_task(connection_t * connection, struct task_ * task);


struct task_ * connection_shift_task(connection_t * connection);


void connection_push_result(connection_t * connection,
							struct task_result_ * result);


struct task_result_ * connection_shift_result(connection_t * connection);

void connection_callback(connection_t * connection, const unsigned int argc,
						 v8::Local<v8::Value> argv[]);


void connection_free(connection_t * connection);


#endif /* CONNECTION_H_ */
