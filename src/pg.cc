#include <unistd.h>
#include <pthread.h>
#include <typeinfo>
#include <cstddef>

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

v8::Persistent<v8::ObjectTemplate> handle_tmpl = v8::Persistent<
    v8::ObjectTemplate>::New(v8::ObjectTemplate::New());

v8::Handle<v8::Value>
pg_init(const v8::Arguments &args)
{

  v8::HandleScope scope;

  handle_tmpl->SetInternalFieldCount(1);

  if (args.Length() < 1 || (!args[0]->IsNumber()))
    {
      return throw_type_error("First argument must be max pool size!");
    }

  if (args.Length() < 2 || (!args[1]->IsString()))
    {
      return throw_type_error("Second argument must be connection string!");
    }

  if (args.Length() < 3 && !args[2]->IsFunction())
    {
      return throw_type_error("Third argument must be error callback!");
    }

  v8::String::Utf8Value str(args[1]->ToString());

  pool_t * pool = pool_alloc();

  pool_init(pool, args[0]->ToInteger()->Int32Value(), *str,
      v8::Local<v8::Function>::Cast(args[2]));

  pool->data = v8::Persistent<v8::Object>::New(handle_tmpl->NewInstance());

  pool->data->SetPointerInInternalField(0, pool);

  return scope.Close(pool->data);
}

v8::Handle<v8::Value>
pg_exec(const v8::Arguments& args)
{
  v8::HandleScope scope;

  if ((args.Length() < 1) || (!args[0]->IsObject()))
    {
      return throw_type_error("First argument must be pool handle!");
    }

  if (args.Length() < 2 || (!args[1]->IsString()))
    {
      return throw_type_error("Second argument must be query request!");
    }

  if (args.Length() < 3 && !args[2]->IsFunction())
    {
      return throw_type_error("Third argument must be query callback!");
    }

  if (args[0]->ToObject()->InternalFieldCount() < 1)
    return throw_type_error("Invalid handle!");

  pool_t * pool = (pool_t *) args[0]->ToObject()->GetPointerFromInternalField(
      0);

  if (pool == NULL)
    return throw_type_error("Invalid handle!");

  v8::String::Utf8Value str(args[1]->ToString());

  query_t * query = query_alloc(v8::Local<v8::Function>::Cast(args[2]), *str);

  pool_exec(pool, query);

  return scope.Close(v8::Undefined());
}

v8::Handle<v8::Value>
pg_destroy(const v8::Arguments& args)
{
  v8::HandleScope scope;

  if ((args.Length() < 1) || (!args[0]->IsObject()))
    {
      return throw_type_error("First argument must be pool handle!");
    }

  if (args[0]->ToObject()->InternalFieldCount() < 1)
    return throw_type_error("Invalid handle!");

  pool_t * pool = (pool_t *) args[0]->ToObject()->GetPointerFromInternalField(
      0);

  if (pool == NULL)
    return throw_type_error("Invalid handle!");

  pool_destroy(pool);

  return scope.Close(v8::Undefined());
}

void
init(v8::Handle<v8::Object> target)
{

  v8::HandleScope scope;

  target->Set(v8::String::New("init"),
      v8::FunctionTemplate::New(pg_init)->GetFunction());

  target->Set(v8::String::New("exec"),
      v8::FunctionTemplate::New(pg_exec)->GetFunction());

  target->Set(v8::String::New("destroy"),
      v8::FunctionTemplate::New(pg_destroy)->GetFunction());
}

NODE_MODULE(pg, init)
