/*
 * connect_task.h
 *
 *  Created on: May 28, 2012
 *      Author: kononencheg
 */

#ifndef CONNECT_TASK_H_
#define CONNECT_TASK_H_


#include <v8.h>
#include <uv.h>

#include <libpq-fe.h>


typedef struct {
	v8::Persistent<v8::Function> js_callback;

	PGconn * pg_connection;
} connect_task_t;


connect_task_t * connect_task_alloc(PGconn * connection,
							  	  	v8::Local<v8::Function> callback);


void connect_task_work(uv_work_t* work_request);


void connect_task_handler(uv_work_t * work_request);


void connect_task_free(connect_task_t * task);


#endif /* CONNECT_TASK_H_ */
