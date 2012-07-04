/*
 * pool.cc
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */

#include <stdlib.h>

#include "pool.h"
#include "connection.h"
#include "queue.h"
#include "utils.h"


void pool_spawn_connection(pool_t * pool) {
	connection_t * connection = connection_alloc(pool->connection_info, pool);

	connection_init(connection);
}


pool_t * pool_alloc() {
	pool_t * pool = (pool_t *) malloc(sizeof(pool_t));

	pool->connection_info = NULL;

	pool->max_size = 0;

	pool->connection_queue = (connection_t *) malloc(sizeof(connection_t));
	pool->query_queue = (query_t *) malloc(sizeof(query_t));

	queue_init(pool->connection_queue);
	queue_init(pool->query_queue);

	return pool;
}


void pool_init(pool_t * pool, size_t max_size, const char * connection_info,
		   v8::Local<v8::Function> error_callback) {

	pool->connection_info = copy_string(connection_info);
	pool->max_size = max_size;

	pool->error_callback = v8::Persistent<v8::Function>::New(error_callback);
}


void pool_exec(pool_t * pool, query_t * query) {
	queue_push(pool->query_queue, query);

	pool_process(pool);
}


void pool_handle_error(pool_t * pool, char * error) {
	const unsigned argc = 1;
	v8::Handle<v8::Value> argv[argc];

	argv[0] = create_error(error);

	pool->error_callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);
}


void pool_process(pool_t * pool) {
	connection_t * connection = NULL;
	size_t i = 0;

	queue_for(pool->connection_queue, connection) {
		connection_process(connection);
		i++;
	}

	if (!queue_is_empty(pool->query_queue) && i < pool->max_size) {
		pool_spawn_connection(pool);
	}
}

void pool_destroy(pool_t * pool) {
	connection_t * connection;
	query_t * query;

	queue_flush(pool->connection_queue, connection, connection_destroy);
	queue_flush(pool->query_queue, query, query_free);

	pool->max_size = 0;
	pool->error_callback.Dispose();

	free(pool->connection_info);
	pool->connection_info = NULL;
}

void pool_free(pool_t * pool) {
	pool_destroy(pool);

	free(pool->connection_queue);
	free(pool->query_queue);

	free(pool);
}


