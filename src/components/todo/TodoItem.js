import React from 'react';
import { MdDelete, MdDone } from 'react-icons/md';
import './scss/TodoItem.scss';
import cn from 'classnames';

const TodoItem = ({ item, remove, check, count }) => {
  const { id, title, done } = item;
  return (
    <li className='todo-list-item'>
      <div
        className={cn('check-circle', { active: done })}
        onClick={() => check(id, done)}
      >
        <MdDone />
      </div>
      <span className={(cn('text'), { finish: done })}>{item.title}</span>
      <div
        className='remove'
        onClick={() => remove(item.id)}
      >
        <MdDelete />
      </div>
    </li>
  );
};

export default TodoItem;