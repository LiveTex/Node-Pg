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


void pg_init(const v8::FunctionCallbackInfo<v8::Value> &args) {
  if (args.Length() < 1) {
		throw_type_error("First argument must be max pool size!");
		return;
	}

  if (args.Length() < 2) {
		throw_type_error("Second argument must be connection string!");
		return;
	}

  if (args.Length() < 3 && !args[2]->IsFunction()) {
		throw_type_error("Third argument must be error callback!");
		return;
	}

	v8::String::Utf8Value str(args[1]->ToString());

	pool_init(pool, args[0]->ToInteger()->Int32Value(), *str,
			  v8::Local<v8::Function>::Cast(args[2]));
}


void pg_exec(const v8::FunctionCallbackInfo<v8::Value> &args) {
  if (args.Length() < 1) {
		throw_type_error("First argument must be query request!");
		return;
	}

  if (args.Length() < 2 && !args[1]->IsFunction()) {
		throw_type_error("Second argument must be query callback!");
		return;
	}

	v8::String::Utf8Value str(args[0]->ToString());

  query_t * query = query_alloc(v8::Local<v8::Function>::Cast(args[1]), *str);

  pool_exec(pool, query);
}


void pg_destroy(const v8::FunctionCallbackInfo<v8::Value> &args) {
    pool_destroy(pool);
}


void init (v8::Handle<v8::Object> target) {
	pool = pool_alloc();

	v8::Isolate *isolate = v8::Isolate::GetCurrent();

  target->Set(v8::String::NewFromUtf8(isolate, "init"),
        v8::FunctionTemplate::New(isolate, pg_init)->GetFunction());

  target->Set(v8::String::NewFromUtf8(isolate, "exec"),
        v8::FunctionTemplate::New(isolate, pg_exec)->GetFunction());

  target->Set(v8::String::NewFromUtf8(isolate, "destroy"),
        v8::FunctionTemplate::New(isolate, pg_destroy)->GetFunction());
}


NODE_MODULE(pg, init)
