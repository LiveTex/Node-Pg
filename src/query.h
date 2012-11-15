/*
 * query.h
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */

#ifndef QUERY_H_
#define QUERY_H_

#include <v8.h>
#include <libpq-fe.h>


typedef struct query_ {
	v8::Persistent<v8::Function> callback;

	struct query_ * next;
	struct query_ * prev;

	char * request;
	char * error;

	PGresult * result;

} query_t;


query_t * query_alloc(v8::Local<v8::Function> callback, const char * request);

void query_apply(query_t * query);

void query_free(query_t * query);

#endif /* QUERY_H_ */
