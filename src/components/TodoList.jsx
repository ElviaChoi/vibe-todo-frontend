import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ 
  todos, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  loading, 
  error 
}) => {
  if (loading) {
    return (
      <div className="todo-list-loading">
        <div className="loading-spinner"></div>
        <p>할일을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="todo-list-error">
        <p>❌ 오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>📝 할일이 없습니다. 새로운 할일을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;
