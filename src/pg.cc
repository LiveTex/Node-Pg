#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <typeinfo>

#include <v8.h>
#include <node.h>
#include <uv.h>

#include <libpq-fe.h>


#include "actions.h"
#include "connection.h"
#include "utils.h"
#include "task.h"


v8::Handle<v8::Value> pg_connect(const v8::Arguments &args) {
    v8::HandleScope scope;

    if (args.Length() < 1) {
		return throw_type_error
			("First argument must be connection options string!");
	}

    if (args.Length() < 2 && !args[1]->IsFunction()) {
		return throw_type_error
			("Second argument must be callback function!");
	}

    connection_t * connection =
		connection_alloc(v8::Local<v8::Function>::Cast(args[1]));

    task_t * task = task_alloc(process_connection, handle_connection_result);
    task->data = arg_extract_string(args[0]->ToString());

    connection_push_task(connection, task);
	connection_process(connection);

    return scope.Close(v8::External::Wrap(connection));
}


v8::Handle<v8::Value> pg_disconnect(const v8::Arguments &args) {
    v8::HandleScope scope;

    if (args.Length() < 1) {
		return throw_type_error("First argument must be connection!");
	}

    connection_t * connection = (connection_t *) v8::External::Unwrap(args[0]);

    if (connection == NULL) {
    	return throw_error("Invalid connection!");
    }

	task_t * task =
		task_alloc(process_disconnection, handle_disconnection_result);

	connection_push_task(connection, task);
	connection_process(connection);

    return scope.Close(v8::Undefined());
}


v8::Handle<v8::Value> pg_exec(const v8::Arguments &args) {
    v8::HandleScope scope;

    if (args.Length() < 1) {
		return throw_type_error("First argument must be connection!");
	}

    if (args.Length() < 2) {
		return throw_type_error("Second argument must be query!");
	}

    connection_t * connection = (connection_t *) v8::External::Unwrap(args[0]);

    if (connection == NULL) {
    	return throw_error("Invalid connection!");
    }

	task_t * task = task_alloc(process_execution, handle_execution_result);
	task->data = arg_extract_string(args[1]->ToString());

	connection_push_task(connection, task);
	connection_process(connection);

    return scope.Close(v8::Undefined());
}


void init (v8::Handle<v8::Object> target) {
    v8::HandleScope scope;

    target->Set(v8::String::New("connect"),
    			v8::FunctionTemplate::New(pg_connect)->GetFunction());

    target->Set(v8::String::New("exec"),
    			v8::FunctionTemplate::New(pg_exec)->GetFunction());

    target->Set(v8::String::New("disconnect"),
    			v8::FunctionTemplate::New(pg_disconnect)->GetFunction());
}


NODE_MODULE(pg, init)
