#include <unistd.h>
#include <pthread.h>
#include <typeinfo>

#include <v8.h>
#include <node.h>
#include <uv.h>

#include <libpq-fe.h>
#include <jemalloc/jemalloc.h>


#include "pool.h"
#include "query.h"
#include "connection.h"
#include "utils.h"

#include <signal.h>


pool_t * pool;


v8::Handle<v8::Value> pg_init(const v8::Arguments &args) {
    v8::HandleScope scope;

    if (args.Length() < 1) {
		return throw_type_error("First argument must be max pool size!");
	}

    if (args.Length() < 2) {
		return throw_type_error("Second argument must be connection string!");
	}

    if (args.Length() < 3 && !args[2]->IsFunction()) {
		return throw_type_error("Third argument must be error callback!");
	}

	v8::String::Utf8Value str(args[1]->ToString());

	pool_init(pool, args[0]->ToInteger()->Int32Value(), *str,
			  v8::Local<v8::Function>::Cast(args[2]));

    return scope.Close(v8::Undefined());
}

v8::Handle<v8::Value> pg_exec(const v8::Arguments &args) {
    v8::HandleScope scope;

    if (args.Length() < 1) {
		return throw_type_error("First argument must be query request!");
	}

    if (args.Length() < 2 && !args[1]->IsFunction()) {
		return throw_type_error("Second argument must be query callback!");
	}

	v8::String::Utf8Value str(args[0]->ToString());

    query_t * query = query_alloc(v8::Local<v8::Function>::Cast(args[1]), *str);

    pool_exec(pool, query);

    return scope.Close(v8::Undefined());
}


v8::Handle<v8::Value> pg_destroy(const v8::Arguments &args) {
    v8::HandleScope scope;

    pool_destroy(pool);

    return scope.Close(v8::Undefined());
}


void init (v8::Handle<v8::Object> target) {
	pool = pool_alloc();

	v8::HandleScope scope;

    target->Set(v8::String::New("init"),
    			v8::FunctionTemplate::New(pg_init)->GetFunction());

    target->Set(v8::String::New("exec"),
    			v8::FunctionTemplate::New(pg_exec)->GetFunction());

    target->Set(v8::String::New("destroy"),
    			v8::FunctionTemplate::New(pg_destroy)->GetFunction());
}


NODE_MODULE(pg, init)
