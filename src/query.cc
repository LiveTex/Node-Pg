/*
 * query.cc
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */

#include <stdlib.h>
#include <jemalloc/jemalloc.h>

#include "query.h"
#include "utils.h"


query_t * query_alloc(v8::Local<v8::Function> callback, const char * request) {
	v8::Isolate *isolate = v8::Isolate::GetCurrent();

	query_t * query = (query_t *) malloc(sizeof(query_t));

	v8::CopyablePersistentTraits<v8::Function>::CopyablePersistent persistent;
	persistent.Reset(isolate, callback);

	query->callback = persistent;
	query->request = copy_string(request);

	query->error = NULL;
	query->result = NULL;

	return query;
}


void query_apply(query_t * query) {
	v8::Isolate *isolate = v8::Isolate::GetCurrent();

	const unsigned argc = 2;
	v8::Handle<v8::Value> argv[argc];

	if (query->error == NULL) {
		argv[0] = v8::String::NewFromUtf8(isolate, "");
	} else {
		argv[0] = v8::String::NewFromUtf8(isolate, query->error);
	}

	if (query->result == NULL) {
		argv[1] = v8::Array::New(0);
	} else {
		argv[1] = get_array(query->result);
	}

	v8::Local<v8::Function> cb =
			v8::Local<v8::Function>::New(isolate, query->callback);
	cb->Call(v8::Context::New(isolate)->Global(), argc, argv);
}


void query_free(query_t * query) {
	query->callback.Reset();

	if (query->error != NULL) {
		free(query->error);
	}

	if (query->result != NULL) {
		PQclear(query->result);
	}

	free(query->request);
	free(query);
}
