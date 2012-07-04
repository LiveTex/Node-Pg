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


typedef enum {
	NEW = 0,
	INITIALIZING,
	ACTIVE,
	DESTROYING
} entity_status_t;

typedef enum {
	BUSY = 0,
	FREE
} activity_status_t;


typedef struct connection_ {
	char * connection_info;

	PGconn * descriptor;

	struct pool_ * pool;

	struct connection_ * next;
	struct connection_ * prev;

	struct query_ * current_query;

	entity_status_t status;
	activity_status_t activity_status;

	char * error;

} connection_t;


connection_t * connection_alloc(char * connection_info, struct pool_ * pool);

void connection_init(connection_t * connection);

void connection_process(connection_t * connection);

void connection_destroy(connection_t * connection);

void connection_free(connection_t * connection);


#endif /* CONNECTION_H_ */
