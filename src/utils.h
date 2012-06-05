/*
 * utils.h
 *
 *  Created on: May 28, 2012
 *      Author: kononencheg
 */

#ifndef UTILS_H_
#define UTILS_H_


#include <v8.h>

#include <libpq-fe.h>

v8::Handle<v8::Value> throw_error(const char * msg);
v8::Handle<v8::Value> throw_error(v8::Local<v8::String> msg);

v8::Handle<v8::Value> throw_type_error(const char * msg);
v8::Handle<v8::Value> throw_type_error(v8::Local<v8::String> msg);

v8::Local<v8::Value> create_error(const char * msg);
v8::Local<v8::Value> create_error(v8::Local<v8::String> msg);


char * copy_string(const char * source);
char * copy_string(const char * source, size_t length);

char * arg_extract_string(v8::Local<v8::String> arg);

void arg_free_string(char * string);

#endif /* UTILS_H_ */
