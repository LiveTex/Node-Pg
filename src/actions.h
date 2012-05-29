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

task_result_t * action_connect(connection_t * connection, void * data);

void action_connect_result(connection_t * connection, task_result_t * result);


task_result_t * action_disconnect(connection_t * connection, void * data);

void action_disconnect_result(connection_t * connection, task_result_t * result);


task_result_t * action_execute(connection_t * connection, void * data);

void action_execute_result(connection_t * connection, task_result_t * result);




#endif /* ACTIONS_H_ */
