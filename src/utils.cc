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

