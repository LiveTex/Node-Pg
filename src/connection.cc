/*
 * connection.cc
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */

#include <stdio.h>
#include <uv.h>

#include <jemalloc/jemalloc.h>

#include "connection.h"
#include "queue.h"
#include "utils.h"


void connection_connect_work(uv_work_t * work) {
	connection_t * connection = (connection_t *) work->data;

	connection->descriptor = PQconnectdb(connection->connection_info);

	ConnStatusType status = PQstatus(connection->descriptor);
	if (status != CONNECTION_OK) {
		connection->error = copy_string(PQerrorMessage(connection->descriptor));
	}
}


void connection_exec_work(uv_work_t * work) {
	connection_t * connection = (connection_t *) work->data;

	ConnStatusType status = PQstatus(connection->descriptor);
	if (status != CONNECTION_OK) {
		connection->error = copy_string(PQerrorMessage(connection->descriptor));
	} else {
		query_t * query = connection->current_query;

		if (query != NULL) {
			PGresult * result = PQexec(connection->descriptor, query->request);

			switch (PQresultStatus(result)) {
				case PGRES_COMMAND_OK: {
					PQclear(result);
					break;
				}

				case PGRES_TUPLES_OK: {
					query->result = result;
					break;
				}

				default: {
					query->error = copy_string(PQresultErrorMessage(result));
					PQclear(result);
					break;
				}
			}
		}
	}
}


void connection_work_handler(uv_work_t * work) {
	connection_t * connection = (connection_t *) work->data;

	if (connection->error != NULL) {
		pool_t * pool = connection->pool;

		if (connection->current_query != NULL) {
			queue_unshift(pool->query_queue, connection->current_query);
			connection->current_query = NULL;
		}

		pool_handle_error(pool, connection->error);
		pool_process(pool);

		connection_destroy(connection);
	}

	connection->activity_status = FREE;
	connection_process(connection);

	free(work);
}


void connection_queue_work(connection_t * connection, uv_work_cb work) {
	uv_work_t * work_item = (uv_work_t *) malloc(sizeof(uv_work_t));
	work_item->data = connection;

	connection->activity_status = BUSY;

	uv_queue_work(uv_default_loop(), work_item, work,
			(uv_after_work_cb) connection_work_handler);
}


void connection_fetch_query(connection_t * connection) {
	if (connection->current_query == NULL && connection->status != DESTROYING) {
		queue_shift(connection->pool->query_queue, connection->current_query);

		if (connection->current_query != NULL) {
			connection_queue_work(connection, connection_exec_work);
		} else {
			connection_destroy(connection);
		}
	}
}

connection_t * connection_alloc(char * connection_info, pool_t * pool) {
	connection_t * connection = (connection_t *) malloc(sizeof(connection_t));
	connection->status = NEW;
	connection->activity_status = FREE;

	connection->connection_info = copy_string(connection_info);

	connection->pool = pool;

	connection->current_query = NULL;

	connection->descriptor = NULL;

	connection->prev = NULL;
	connection->next = NULL;

	connection->error = NULL;

	queue_push(pool->connection_queue, connection);

	return connection;
}


void connection_init(connection_t * connection) {
	connection->status = INITIALIZING;
	connection_queue_work(connection, connection_connect_work);
}


void connection_destroy(connection_t * connection) {
	connection->status = DESTROYING;
	connection_process(connection);
}


void connection_process(connection_t * connection) {
	if (connection->activity_status == FREE) {
		query_t * query = connection->current_query;
		connection->current_query = NULL;

		switch (connection->status) {
			case INITIALIZING: {
				connection->status = ACTIVE;
				connection_fetch_query(connection);

				break;
			}

			case ACTIVE: {
				connection_fetch_query(connection);

				break;
			}

			case DESTROYING: {
				connection_free(connection);

				break;
			}

			case NEW: {
				break;
			}
		}


		if (query != NULL) {
			query_apply(query);
			query_free(query);
		}
	}
}


void connection_free(connection_t * connection) {
	if (connection->prev != NULL) {
		queue_remove(connection);
	}

	if (connection->descriptor != NULL) {
		PQfinish(connection->descriptor);
	}

	if (connection->current_query != NULL) {
		query_free(connection->current_query);
	}

	free(connection->connection_info);
	free(connection);
}
