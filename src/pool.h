/*
 * pool.h
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */

#ifndef POOL_H_
#define POOL_H_


#include <v8.h>

#include "query.h"
#include "connection.h"


typedef struct pool_ {
	char * connection_info;

	size_t max_size;

	query_t * query_queue;

	struct connection_ * connection_queue;

	v8::Persistent<v8::Function> error_callback;
} pool_t;


pool_t * pool_alloc();

void pool_init(pool_t * pool, size_t max_size, const char * connection_info,
			   v8::Local<v8::Function> error_callback);

void pool_exec(pool_t * pool, query_t * query);

void pool_handle_error(pool_t * pool, char * error);

void pool_process(pool_t * pool);

void pool_destroy(pool_t * pool);

void pool_free(pool_t * pool);


#endif /* POOL_H_ */
