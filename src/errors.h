/*
 * errors.h
 *
 *  Created on: May 28, 2012
 *      Author: kononencheg
 */

#ifndef ERRORS_H_
#define ERRORS_H_


#include <v8.h>


v8::Handle<v8::Value> throw_error(const char * msg);
v8::Handle<v8::Value> throw_error(v8::Local<v8::String> msg);

v8::Handle<v8::Value> throw_type_error(const char * msg);
v8::Handle<v8::Value> throw_type_error(v8::Local<v8::String> msg);

v8::Local<v8::Value> create_error(const char * msg);
v8::Local<v8::Value> create_error(v8::Local<v8::String> msg);


#endif /* ERRORS_H_ */
