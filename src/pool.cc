/*
 * pool.cc
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */

#include <jemalloc/jemalloc.h>
#include "stddef.h"
#include <time.h>

#include "pool.h"
#include "connection.h"
#include "queue.h"
#include "utils.h"

size_t pool_tick_repeat = 1000;

void pool_spawn_connection(pool_t * pool) {
	connection_t * connection = connection_alloc(pool->connection_info, pool);

	connection_init(connection);
}

pool_t *
pool_alloc() {
	pool_t * pool = (pool_t *) malloc(sizeof(pool_t));

	pool->connection_info = NULL;

	pool->max_size = 0;

	pool->lifetime = 0;

	pool->connection_queue = (connection_t *) malloc(sizeof(connection_t));
	pool->query_queue = (query_t *) malloc(sizeof(query_t));

	queue_init(pool->connection_queue);

	pool->timer = (uv_timer_t *) malloc(sizeof(uv_timer_t));

	queue_init(pool->query_queue);

	return pool;
}

void pool_tick(uv_idle_t * handle, int status) {

	pool_t * pool = (pool_t *) handle->data;

	connection_t * connection = pool->connection_queue->prev;
	connection_t * prev = NULL;

	while (connection != pool->connection_queue) {
		prev = connection->prev;

		if ((time(NULL) - pool->lifetime ) < connection->downtime_start) {
				connection->status = DESTROYING;
				connection_free(connection);
		}

		connection = prev;
	}
}

void pool_init(pool_t * pool, size_t max_size, size_t lifetime,
		const char * connection_info, v8::Local<v8::Function> error_callback) {
	pool->connection_info = copy_string(connection_info);
	pool->max_size = max_size;
	pool->lifetime = lifetime;

	uv_timer_init(uv_default_loop(), pool->timer);
	pool->timer->data = pool;
	uv_timer_start(pool->timer, (uv_timer_cb) pool_tick, 0, pool_tick_repeat);

	pool->error_callback = v8::Persistent<v8::Function>::New(error_callback);
}

void pool_exec(pool_t * pool, query_t * query) {
	queue_push(pool->query_queue, query);

	pool_process(pool);
}

void pool_handle_error(pool_t * pool, char * error) {
	v8::HandleScope scope;
	v8::Handle<v8::Value> argv[1];

	argv[0] = v8::String::New(error);

	pool->error_callback->Call(v8::Context::GetCurrent()->Global(), 1, argv);
}

void pool_process(pool_t * pool) {
	size_t i = 0;

	connection_t * connection = pool->connection_queue->prev;
	connection_t * prev = NULL;
	while (connection != pool->connection_queue) {

		prev = connection->prev;
		connection_process(connection);

		connection = prev;
		i++;
	}

	if (!queue_is_empty(pool->query_queue) && i < pool->max_size) {
		pool_spawn_connection(pool);
	}
}

void pool_destroy(pool_t * pool) {
	connection_t * connection;
	query_t * query;

	queue_flush(pool->connection_queue, connection, connection_destroy_req);
	queue_flush(pool->query_queue, query, query_free);

	pool->max_size = 0;
	pool->error_callback.Dispose();

	pool->data->SetPointerInInternalField(0, NULL);
	pool->data.Dispose();

	uv_timer_stop(pool->timer);
	free(pool->timer);

	free(pool->connection_info);
	pool->connection_info = NULL;
}

void pool_free(pool_t * pool) {
	pool_destroy(pool);

	free(pool->connection_queue);
	free(pool->query_queue);

	free(pool);
}

