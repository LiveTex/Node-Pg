/*
 * data_table.cc
 *
 *  Created on: Jun 5, 2012
 *      Author: kononencheg
 */

#include <stdlib.h>
#include <string.h>

#include "utils.h"

#include "data_table.h"


static v8::Persistent<v8::Value> true_value;
static v8::Persistent<v8::Value> false_value;

static v8::Persistent<v8::Value> empty_string_value;

v8::Local<v8::Value> v8_get_true() {
	true_value = v8::Persistent<v8::Value>::New(v8::True());

	return true_value->ToBoolean();
}

v8::Local<v8::Value> v8_get_false() {
	false_value = v8::Persistent<v8::Value>::New(v8::False());

	return false_value->ToBoolean();
}

v8::Local<v8::Value> v8_get_empty_string() {
	empty_string_value =
			v8::Persistent<v8::Value>::New(v8::String::NewSymbol(""));

	return empty_string_value->ToString();
}


v8::Local<v8::Value> get_field(const char * data) {
	return v8::String::NewSymbol(data);
}


v8::Local<v8::Value> get_value(const char * data, Oid type_id) {

	// boolean
	if (type_id == 16) {
		if (data[0] == 't') {
			return v8_get_true();
		} else if (data[0] == 'f') {
			return v8_get_false();
		}
	}

	v8::Local<v8::Value> value = v8::String::New(data);


	printf("> %d\n", type_id);

	switch (type_id) {
		case 20: // int8
		case 21: // int2
		case 23: // int4
		case 26: // oid
		case 28: // xid
		case 1114: // timestamp
			return value->ToInteger();

		case 700: // float4
		case 701: // float8
		case 1700: // numeric
			return value->ToNumber();
	}


	return value;
}


data_table_t * data_table_alloc(int rows_count, int columns_count) {
	data_table_t * table = (data_table_t *) malloc(sizeof(data_table_t));

	table->rows_count = rows_count;
	table->columns_count = columns_count;

	table->columns = (char **) malloc(columns_count * sizeof(char *));
	table->column_types = (Oid *) malloc(columns_count * sizeof(Oid));

	table->rows = (char ***) malloc(rows_count * sizeof(char **));

	for (int i = 0; i < rows_count; i++) {
		table->rows[i] = (char **) malloc(columns_count * sizeof(char *));
	}

	return table;
}


void data_table_populate(data_table_t * table, PGresult * result) {
	int i, j;

	for (j = 0; j < table->columns_count; j++) {
		table->columns[j] = copy_string(PQfname(result, j));
		table->column_types[j] = PQftype(result, j);
	}

	for (i = 0; i < table->rows_count; i++) {
		for (j = 0; j < table->columns_count; j++) {
			table->rows[i][j] = copy_string
					(PQgetvalue(result, i , j), PQgetlength(result, i, j));
		}
	}
}


v8::Local<v8::Array> data_table_get_array(data_table_t * table) {
	v8::Local<v8::Array> result = v8::Array::New(table->rows_count);

	int i, j;

	for (i = 0; i < table->rows_count; i++) {
		v8::Local<v8::Object> record = v8::Object::New();

		for (j = 0; j < table->columns_count; j++) {
			record->Set(get_field(table->columns[j]),
					    get_value(table->rows[i][j], table->column_types[j]));
		}

		result->Set(i, record);
	}

	return result;
}


void data_table_free(data_table_t * table) {
	int i, j;

	for (j = 0; j < table->columns_count; j++) {
		free(table->columns[j]);
	}

	for (i = 0; i < table->rows_count; i++) {
		for (j = 0; j < table->columns_count; j++) {
			free(table->rows[i][j]);
		}

		free(table->rows[i]);
	}

	free(table->column_types);
	free(table->columns);
	free(table->rows);
	free(table);
}


