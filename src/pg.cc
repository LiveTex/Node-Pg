#include <stdlib.h>
#include <unistd.h>

#include <v8.h>
#include <node.h>
#include <uv.h>

#include <libpq-fe.h>

#include "errors.h"
#include "exec_task.h"
#include "connect_task.h"


v8::Handle<v8::Value> pg_connect(const v8::Arguments &args) {
    v8::HandleScope scope;

    if (args.Length() < 1) {
		return throw_type_error("First argument must be connection string!");
	}

    if (args.Length() < 2 && !args[1]->IsFunction()) {
		return throw_type_error("Second argument must be callback function!");
	}

    v8::Local<v8::String> arg0 = args[0]->ToString();

    char * connection_string =
    		(char *) malloc(sizeof(char) * arg0->Utf8Length());
    arg0->WriteUtf8(connection_string);

    PGconn * connection = PQconnectStart(connection_string);

    uv_work_t * task_request = (uv_work_t *) malloc(sizeof(uv_work_t));

    task_request->data = connect_task_alloc
			(connection, v8::Local<v8::Function>::Cast(args[1]));

    uv_queue_work(uv_default_loop(), task_request,
    			  connect_task_work, connect_task_handler);

    return scope.Close(v8::Undefined());
}


v8::Handle<v8::Value> pg_disconnect(const v8::Arguments &args) {
    v8::HandleScope scope;

    if (args.Length() < 1) {
		return throw_type_error("First argument must be connection!");
	}

    PQfinish((PGconn *) v8::External::Unwrap(args[0]));

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

    if (args.Length() < 3 && !args[2]->IsFunction()) {
		return throw_type_error("Third argument must be callback function!");
	}

    PGconn * connection = (PGconn *) v8::External::Unwrap(args[0]);

    v8::Local<v8::String> arg1 = args[1]->ToString();

    char * query_string = (char *) malloc(sizeof(char) * arg1->Utf8Length());
    arg1->WriteUtf8(query_string);

    if (PQsendQuery(connection, query_string) == 0) {
    	return throw_error(PQerrorMessage(connection));
    }

    uv_work_t * task_request = (uv_work_t *) malloc(sizeof(uv_work_t));

    task_request->data =
    		exec_task_alloc(connection, v8::Local<v8::Function>::Cast(args[2]));

    uv_queue_work(uv_default_loop(), task_request,
    			  exec_task_work, exec_task_handler);

    return scope.Close(v8::Undefined());
}


v8::Handle<v8::Value> pg_is_busy(const v8::Arguments &args) {
    v8::HandleScope scope;

    if (args.Length() < 1) {
		return throw_type_error("First argument must be connection!");
	}

    PGconn * connection = (PGconn *) v8::External::Unwrap(args[0]);

    if (PQisBusy(connection) == 1) {
    	return scope.Close(v8::True());
    }

    return scope.Close(v8::False());
}


extern "C" void init (v8::Handle<v8::Object> target) {
    v8::HandleScope scope;

    target->Set(v8::String::New("connect"),
    			v8::FunctionTemplate::New(pg_connect)->GetFunction());

    target->Set(v8::String::New("exec"),
    			v8::FunctionTemplate::New(pg_exec)->GetFunction());

    target->Set(v8::String::New("isBusy"),
    			v8::FunctionTemplate::New(pg_is_busy)->GetFunction());

    target->Set(v8::String::New("disconnect"),
    			v8::FunctionTemplate::New(pg_disconnect)->GetFunction());
}

