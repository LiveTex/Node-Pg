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


void pool_spawn_connection(pool_t * pool) {
	connection_t * connection = connection_alloc(pool->connection_info, pool);

	queue_push(pool->connection_queue, connection);

	pool->size++;

	connection_init(connection);
}


pool_t * pool_alloc(size_t max_size, char * connection_info) {
	pool_t * pool = (pool_t *) malloc(sizeof(pool_t));

	pool->connection_info = connection_info;

	pool->max_size = max_size;
	pool->size = 0;
	pool->result_length = 0;

	pool->connection_queue = (connection_t *) malloc(sizeof(connection_t));
	pool->exec_query_queue = (query_t *) malloc(sizeof(query_t));
	pool->result_query_queue = (query_t *) malloc(sizeof(query_t));

	queue_init(pool->connection_queue);
	queue_init(pool->exec_query_queue);
	queue_init(pool->result_query_queue);

	uv_mutex_init(&pool->apply_lock);

	return pool;
}


void pool_exec(pool_t * pool, query_t * query) {
	connection_t * connection = NULL;

	queue_push(pool->exec_query_queue, query);

	queue_for(pool->connection_queue, connection) {
		connection_process(connection);
	}

	if (!queue_is_empty(pool->exec_query_queue) && pool->size < pool->max_size) {
		pool_spawn_connection(pool);
	}
}


void pool_apply(pool_t * pool, query_t * query) {
	uv_mutex_lock(&pool->apply_lock);

	queue_push(pool->result_query_queue, query);

	uv_mutex_unlock(&pool->apply_lock);

	pool->result_length++;
}


void pool_flush(pool_t * pool) {
	query_t * query = NULL;

	/*while (pool->result_query_queue->prev != pool->result_query_queue) {
		uv_mutex_lock(&pool->apply_lock);
		query = pool->result_query_queue->prev;
		query->prev->next = query->next;
		query->next->prev = query->prev;
		uv_mutex_unlock(&pool->apply_lock);

		query->next = NULL;
		query->prev = NULL;

		query_free(query);
	}*/

	uv_mutex_lock(&pool->apply_lock);
	queue_flush(pool->result_query_queue, query, query_free);
	uv_mutex_unlock(&pool->apply_lock);


	if (pool->result_length > 0) {
	//	printf("[COUNT]: %ld\n", pool->result_length);
		pool->result_length = 0;
	}
}


void pool_free(pool_t * pool) {
	connection_t * connection;
	query_t * query;

	queue_flush(pool->connection_queue, connection, connection_free);
	queue_flush(pool->exec_query_queue, query, query_free);
	queue_flush(pool->result_query_queue, query, query_free);

	free(pool->connection_queue);
	free(pool->exec_query_queue);
	free(pool->result_query_queue);

	free(pool);
}


