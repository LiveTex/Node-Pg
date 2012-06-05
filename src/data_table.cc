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

data_table_t * data_table_alloc(int rows_count, int columns_count) {
	data_table_t * table = (data_table_t *) malloc(sizeof(data_table_t));

	table->rows_count = rows_count;
	table->columns_count = columns_count;

	table->columns = (char **) malloc(columns_count * sizeof(char *));
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
	}

	for (i = 0; i < table->rows_count; i++) {
		for (j = 0; j < table->columns_count; j++) {
			table->rows[i][j] = copy_string
					(PQgetvalue(result, i , j), PQgetlength(result, i, j) + 1);
		}
	}
}

v8::Local<v8::Array> data_table_get_array(data_table_t * table) {
	v8::Local<v8::Array> result = v8::Array::New(table->rows_count);

	int i, j;

	for (i = 0; i < table->rows_count; i++) {
		v8::Local<v8::Object> record = v8::Object::New();

		for (j = 0; j < table->columns_count; j++) {
			v8::Local<v8::String> data =
				v8::Local<v8::String>::New(v8::String::New(table->rows[i][j]));

			record->Set(v8::String::New(table->columns[j]), data);
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

	free(table->columns);
	free(table->rows);
	free(table);
}


