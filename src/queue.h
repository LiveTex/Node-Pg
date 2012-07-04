/*
 * queue.h
 *
 *  Created on: Jul 2, 2012
 *      Author: kononencheg
 */

#ifndef QUEUE_H_
#define QUEUE_H_



#define queue_init(origin) \
	(origin)->next = (origin); \
	(origin)->prev = (origin)

#define queue_is_empty(origin) \
	((origin)->prev == (origin))


#define queue_add_after(target, item) \
		(target)->next->prev = (item); \
		(item)->next = (target)->next; \
		(target)->next = (item); \
		(item)->prev = (target)



#define queue_add_before(target, item) \
		(target)->prev->next = (item); \
		(item)->prev = (target)->prev; \
		(target)->prev = (item); \
		(item)->next = (target)


// target -> origin
#define queue_push queue_add_after


// target -> origin
#define queue_unshift queue_add_before


#define queue_remove(item) \
    (item)->next->prev = (item)->prev; \
    (item)->prev->next = (item)->next; \
    (item)->prev = NULL; \
    (item)->next = NULL


#define queue_shift(origin, result) \
	(result) = NULL; \
	if ((origin)->prev != (origin)) { \
		(result) = (origin)->prev; \
		queue_remove(result); \
	}


#define queue_pop(origin, result) \
	(result) = NULL; \
	if ((origin)->next != (origin)) { \
		(result) = (origin)->next; \
		queue_remove((result)); \
	}


#define queue_for(origin, item) \
	for ((item) = (origin)->prev; \
		 (item) != (origin); \
		 (item) = (item)->prev)


#define queue_flush(origin, item, callback) \
	queue_shift((origin), (item)); \
	while ((item) != NULL) { \
		callback((item)); \
		queue_shift((origin), (item)); \
	}


#endif /* QUEUE_H_ */
