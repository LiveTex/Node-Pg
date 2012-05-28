/*
 * exec_task.h
 *
 *  Created on: May 28, 2012
 *      Author: kononencheg
 */

#ifndef EXEC_TASK_H_
#define EXEC_TASK_H_


#include <v8.h>
#include <uv.h>

#include <libpq-fe.h>


typedef struct {
	v8::Persistent<v8::Function> js_callback;

	PGconn * pg_connection;
	PGresult * pg_result;
} exec_task_t;


exec_task_t * exec_task_alloc(PGconn * connection,
							  v8::Local<v8::Function> callback);


void exec_task_work(uv_work_t* work_request);


void exec_task_handler(uv_work_t * work_request);


void exec_task_free(exec_task_t * task);




#endif /* EXEC_TASK_H_ */
