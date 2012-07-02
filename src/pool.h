/*
 * pool.h
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */

#ifndef POOL_H_
#define POOL_H_

#include "query.h"
#include "connection.h"

typedef struct pool_ {
	char * connection_info;

	size_t max_size;
	size_t size;

	size_t result_length;

	query_t * exec_query_queue;
	query_t * result_query_queue;

	uv_mutex_t apply_lock;

	struct connection_ * connection_queue;
} pool_t;


pool_t * pool_alloc(size_t max_size, char * connection_info);

void pool_exec(pool_t * pool, query_t * query);

void pool_apply(pool_t * pool, query_t * query);

void pool_flush(pool_t * pool);

void pool_free(pool_t * pool);


#endif /* POOL_H_ */
