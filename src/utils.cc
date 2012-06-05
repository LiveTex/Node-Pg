/*
 * utils.cc
 *
 *  Created on: May 28, 2012
 *      Author: kononencheg
 */

#include <stdlib.h>
#include <string.h>

#include "utils.h"


v8::Handle<v8::Value> throw_error(const char * msg) {
	return v8::ThrowException(v8::Exception::Error(v8::String::New(msg)));
}


v8::Handle<v8::Value> throw_error(v8::Local<v8::String> msg) {
	return v8::ThrowException(v8::Exception::Error(msg));
}


v8::Handle<v8::Value> throw_type_error(const char * msg) {
	return v8::ThrowException(v8::Exception::TypeError(v8::String::New(msg)));
}


v8::Handle<v8::Value> throw_type_error(v8::Local<v8::String> msg) {
	return v8::ThrowException(v8::Exception::TypeError(msg));
}


v8::Local<v8::Value> create_error(const char * msg) {
	return v8::Exception::Error(v8::String::New(msg));
}


v8::Local<v8::Value> create_error(v8::Local<v8::String> msg) {
	return v8::Exception::Error(msg);
}

char * copy_string(const char * source) {
	return copy_string(source, strlen(source) + 1);
}

char * copy_string(const char * source, size_t length) {
	return (char *) memcpy(malloc(sizeof(char) * length), source, length);
}

char * arg_extract_string(v8::Local<v8::String> arg) {
	char * string = (char *) malloc(sizeof(char) * arg->Length());

	arg->WriteUtf8(string);

	return string;
}
