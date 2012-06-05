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

	bool is_broken;

	struct task_ * current_task;
	struct task_ * task_queue_origin;

	v8::Persistent<v8::Function> callback;
} connection_t;


connection_t * connection_alloc(v8::Local<v8::Function> callback);


void connection_process(connection_t * connection);


void connection_break(connection_t * connection);


void connection_push_task(connection_t * connection, struct task_ * task);


struct task_ * connection_shift_task(connection_t * connection);


bool connection_is_empty(connection_t * connection);


void connection_callback(connection_t * connection, struct task_result_ * result);


void connection_free(connection_t * connection);


#endif /* CONNECTION_H_ */
