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

char * copy_string(const char * source);
char * copy_string(const char * source, size_t length);

v8::Local<v8::Array> get_array(PGresult * result);

#endif /* UTILS_H_ */
