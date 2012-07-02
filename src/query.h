/*
 * query.h
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */

#ifndef QUERY_H_
#define QUERY_H_

#include "data_table.h"

typedef struct query_ {
	size_t id;

	struct query_ * next;
	struct query_ * prev;

	char * request;
	char * error;

	data_table_t * result;

} query_t;


query_t * query_alloc(const char * request);

void query_free(query_t * query);

#endif /* QUERY_H_ */
