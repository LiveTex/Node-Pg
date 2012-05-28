/*
 * errors.cc
 *
 *  Created on: May 28, 2012
 *      Author: kononencheg
 */


#include "errors.h"


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

