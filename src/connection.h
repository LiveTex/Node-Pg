/*
 * js_connection.h
 *
 *  Created on: May 29, 2012
 *      Author: kononencheg
 */

#ifndef CONNECTION_H_
#define CONNECTION_H_


#include <libpq-fe.h>

#include <uv.h>

#include "query.h"
#include "pool.h"


typedef struct connection_ {
	char * connection_info;

	PGconn * descriptor;

	struct connection_ * next;
	struct connection_ * prev;

	bool is_broken;
	bool is_connected;

	struct pool_ * pool;

	query_t * current_query;

} connection_t;


connection_t * connection_alloc(char * connection_info, struct pool_ * pool);

void connection_init(connection_t * connection);

void connection_process(connection_t * connection);

void connection_free(connection_t * connection);


#endif /* CONNECTION_H_ */
