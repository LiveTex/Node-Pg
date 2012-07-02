/*
 * connection.cc
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */

#include <stdio.h>
#include <stdlib.h>

#include <uv.h>

#include "connection.h"
#include "queue.h"
#include "utils.h"


void connection_break(connection_t * connection) {
	// TODO: save last error
	connection->is_broken = true;
}


void connection_connect_work(uv_work_t * work) {
	connection_t * connection = (connection_t *) work->data;

	connection->descriptor = PQconnectdb(connection->connection_info);

	ConnStatusType status = PQstatus(connection->descriptor);
	if (status != CONNECTION_OK) {
		printf("[ERROR]: %s", PQerrorMessage(connection->descriptor));

		connection_break(connection);
	} else {
		connection->is_connected = true;
	}
}


void connection_exec_work(uv_work_t * work) {
	connection_t * connection = (connection_t *) work->data;

	ConnStatusType status = PQstatus(connection->descriptor);
	if (status != CONNECTION_OK) {
		printf("[ERROR]: %s", PQerrorMessage(connection->descriptor));

		connection_break(connection);
	} else {
		query_t * query = connection->current_query;

		if (query != NULL) {
			PGresult * result = PQexec(connection->descriptor, query->request);

			switch (PQresultStatus(result)) {
				case PGRES_COMMAND_OK: {
					break;
				}

				case PGRES_TUPLES_OK: {
					query->result = data_table_alloc
							(PQntuples(result), PQnfields(result));

					data_table_populate(query->result, result);

					break;
				}

				default: {
					query->error = copy_string(PQresultErrorMessage(result));

					break;
				}
			}

			PQclear(result);

			pool_apply(connection->pool, query);
		}

		connection->current_query = NULL;
	}
}


void connection_work_handler(uv_work_t * work) {
	connection_t * connection = (connection_t *) work->data;

	pool_flush(connection->pool);

	if (connection->is_broken) {
		queue_remove(connection);
		connection_free(connection);
	} else {
		connection_process(connection);
	}

	free(work);
}


void connection_queue_work(connection_t * connection, uv_work_cb work) {
	uv_work_t * work_item = (uv_work_t *) malloc(sizeof(uv_work_t));
	work_item->data = connection;

	uv_queue_work(uv_default_loop(), work_item, work, connection_work_handler);
}


connection_t * connection_alloc(char * connection_info, pool_t * pool) {

	connection_t * connection = (connection_t *) malloc(sizeof(connection_t));
	connection->is_broken = false;
	connection->is_connected = false;

	connection->connection_info = connection_info;

	connection->pool = pool;

	connection->current_query = NULL;

	connection->descriptor = NULL;

	connection->prev = NULL;
	connection->next = NULL;

	return connection;
}


void connection_init(connection_t * connection) {
	connection_queue_work(connection, connection_connect_work);
}


void connection_process(connection_t * connection) {
	if (connection->current_query == NULL && connection->is_connected) {
		query_t * query;

		queue_shift(connection->pool->exec_query_queue, query);

		if (query != NULL) {
			connection->current_query = query;
			connection_queue_work(connection, connection_exec_work);
		}
	}
}


void connection_free(connection_t * connection) {
	if (connection->descriptor != NULL) {
		PQfinish(connection->descriptor);
	}

	if (connection->current_query != NULL) {
		query_free(connection->current_query);
	}

	free(connection);
}
