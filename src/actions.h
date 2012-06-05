/*
 * actions.h
 *
 *  Created on: May 29, 2012
 *      Author: kononencheg
 */

#ifndef ACTIONS_H_
#define ACTIONS_H_


#include <uv.h>

#include "connection.h"

#include "task.h"


void process_connection(void * data, connection_t * connection,
						task_result_t * result);

void handle_connection_result(task_result_t * result,
							  struct connection_ * connection,
							  int argc, v8::Handle<v8::Value> * argv);


void process_disconnection(void * data, connection_t * connection,
						   task_result_t * result);

void handle_disconnection_result(task_result_t * result,
								 struct connection_ * connection,
								 int argc, v8::Handle<v8::Value> * argv);


void process_execution(void * data, connection_t * connection,
					   task_result_t * result);

void handle_execution_result(task_result_t * result,
							 struct connection_ * connection,
							 int argc, v8::Handle<v8::Value> * argv);



#endif /* ACTIONS_H_ */
