/*
 * data_table.h
 *
 *  Created on: Jun 5, 2012
 *      Author: kononencheg
 */

#ifndef DATA_TABLE_H_
#define DATA_TABLE_H_

#include <libpq-fe.h>


typedef struct {

	char ** columns;
	char *** rows;

	int columns_count;
	int rows_count;
} data_table_t;

data_table_t * data_table_alloc(int rows_count, int columns_count);

void data_table_populate(data_table_t * table, PGresult * result);

v8::Local<v8::Array> data_table_get_array(data_table_t * table);

void data_table_free(data_table_t * table);

#endif /* DATA_TABLE_H_ */
