/*
 * utils.cc
 *
 *  Created on: May 28, 2012
 *      Author: kononencheg
 */

#include <string.h>
#include <stdlib.h>
#include <jemalloc/jemalloc.h>

#include "utils.h"


v8::Handle<v8::Value> throw_error(const char * msg) {
	v8::Isolate *isolate = v8::Isolate::GetCurrent();
	return isolate->ThrowException(
			v8::Exception::Error(
					v8::String::NewFromUtf8(isolate, msg)));
}


v8::Handle<v8::Value> throw_error(v8::Local<v8::String> msg) {
	return v8::Isolate::GetCurrent()->
			ThrowException(v8::Exception::Error(msg));
}


v8::Handle<v8::Value> throw_type_error(const char * msg) {
	v8::Isolate *isolate = v8::Isolate::GetCurrent();
	return isolate->ThrowException(
			v8::Exception::TypeError(
			    v8::String::NewFromUtf8(isolate, msg)));
}


v8::Handle<v8::Value> throw_type_error(v8::Local<v8::String> msg) {
	return v8::Isolate::GetCurrent()->ThrowException(
			v8::Exception::TypeError(msg));
}


char * copy_string(const char * source) {
	size_t length = strlen(source) + 1;

	char * string = (char *) malloc(sizeof(char) * length);
	memcpy(string, source, length);

	return string;
}

char * copy_string(const char * source, size_t length) {
	bool is_broken = length == 0 || source[length - 1] != '\0';
	if (is_broken) {
		length++;
	}

	char * string = (char *) malloc(sizeof(char) * length);
	memcpy(string, source, length);

	if (is_broken) {
		string[length - 1] = '\0';
	}

	return string;
}


v8::Local<v8::Value> get_field(const char * data) {
	return v8::String::NewFromUtf8(
			v8::Isolate::GetCurrent(), data, v8::String::kInternalizedString);
}


v8::Local<v8::Value> get_value(const char * data, int length, Oid type_id) {
	v8::Isolate *isolate = v8::Isolate::GetCurrent();

	// boolean
	if (type_id == 16) {
		if (data[0] == 't') {
			return v8::Local<v8::Value>::New(isolate, v8::True(isolate));
		} else if (data[0] == 'f') {
			return v8::Local<v8::Value>::New(isolate, v8::False(isolate));
		}
	}

	v8::Local<v8::Value> value = v8::String::NewFromUtf8(
			isolate, data, v8::String::kNormalString, length);


	switch (type_id) {
		case 20: // int8
		case 21: // int2
		case 23: // int4
		case 26: // oid
		case 28: // xid
			return value->ToInteger();

		case 700: // float4
		case 701: // float8
		case 1700: // numeric
			return value->ToNumber();
	}

	return value;
}


v8::Local<v8::Array> get_array(PGresult * result) {
	v8::Isolate *isolate = v8::Isolate::GetCurrent();

	int rows_count = PQntuples(result);
	int columns_count =	PQnfields(result);

	v8::Local<v8::Array> array = v8::Array::New(isolate, rows_count);

	for (int i = 0; i < rows_count; i++) {
		v8::Local<v8::Object> record = v8::Object::New(isolate);

		for (int j = 0; j < columns_count; j++) {
			if (PQgetisnull(result, i, j)) {
				record->Set(get_field(PQfname(result, j)), v8::Null(isolate));
			} else {
				record->Set(get_field(PQfname(result, j)),
							get_value(PQgetvalue(result, i , j),
									  PQgetlength(result, i, j),
									  PQftype(result, j)));
			}

		}

		array->Set(i, record);
	}

	return array;
}
