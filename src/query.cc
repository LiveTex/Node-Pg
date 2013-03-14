/*
 * query.cc
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */


#include <jemalloc/jemalloc.h>

#include "query.h"
#include "utils.h"


query_t * query_alloc(v8::Local<v8::Function> callback, const char * request) {
	query_t * query = (query_t *) malloc(sizeof(query_t));

	query->callback = v8::Persistent<v8::Function>::New(callback);
	query->request = copy_string(request);

	query->error = NULL;
	query->result = NULL;

	return query;
}


void query_apply(query_t * query) {
	v8::HandleScope scope;

	const unsigned argc = 2;
	v8::Handle<v8::Value> argv[argc];

	if (query->error == NULL) {
		argv[0] = v8::String::New("");
	} else {
		argv[0] = v8::String::New(query->error);
	}

	if (query->result == NULL) {
		argv[1] = v8::Array::New(0);
	} else {
		argv[1] = get_array(query->result);
	}

	query->callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);
}


void query_free(query_t * query) {
	query->callback.Dispose();

	if (query->error != NULL) {
		free(query->error);
	}

	if (query->result != NULL) {
		PQclear(query->result);
	}

	free(query->request);
	free(query);
}
