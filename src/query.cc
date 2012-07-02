/*
 * query.cc
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */


#include <stdlib.h>

#include "query.h"
#include "utils.h"


query_t * query_alloc(const char * request) {
	query_t * query = (query_t *) malloc(sizeof(query_t));
	query->request = copy_string(request);

	query->error = NULL;
	query->result = NULL;

	return query;
}


void query_free(query_t * query) {
	if (query->error != NULL) {
		free(query->error);
	}

	if (query->result != NULL) {
		data_table_free(query->result);
	}

	free(query->request);
	free(query);
}
