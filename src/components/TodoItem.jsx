import React, { useState } from 'react';
import { PRIORITY_OPTIONS } from '../services/api';

const TodoItem = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    category: todo.category || '',
    dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
  });

  const handleEdit = () => {
    setEditError('');
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setEditError('');
      await onEdit(todo._id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('할일 수정 오류:', error);
      setEditError(error.message || '할일 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      category: todo.category || '',
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
    });
    setEditError('');
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPriorityInfo = (priority) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[1];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !todo.completed;
  };

  const priorityInfo = getPriorityInfo(todo.priority);

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="todo-edit-form">
          {editError && (
            <div className="error-message general-error">
              {editError}
            </div>
          )}
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleInputChange}
            placeholder="할일 제목"
            className="edit-title"
            maxLength={100}
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleInputChange}
            placeholder="설명 (선택사항)"
            className="edit-description"
            maxLength={500}
            rows={3}
          />
          <div className="edit-fields">
            <select
              name="priority"
              value={editData.priority}
              onChange={handleInputChange}
              className="edit-priority"
            >
              {PRIORITY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="category"
              value={editData.category}
              onChange={handleInputChange}
              placeholder="카테고리"
              className="edit-category"
              maxLength={50}
            />
            <input
              type="date"
              name="dueDate"
              value={editData.dueDate}
              onChange={handleInputChange}
              className="edit-due-date"
            />
          </div>
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">
              저장
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
      <div className="todo-content">
        <div className="todo-header">
          <div className="todo-title-section">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggleComplete(todo._id)}
              className="todo-checkbox"
            />
            <h3 className="todo-title">{todo.title}</h3>
            <span className={`priority-badge priority-${priorityInfo.color}`}>
              {priorityInfo.label}
            </span>
          </div>
          <div className="todo-actions">
            <button onClick={handleEdit} className="edit-btn">
              ✏️
            </button>
            <button onClick={() => onDelete(todo._id)} className="delete-btn">
              🗑️
            </button>
          </div>
        </div>
        
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        
        <div className="todo-meta">
          {todo.category && (
            <span className="todo-category">#{todo.category}</span>
          )}
          {todo.dueDate && (
            <span className={`todo-due-date ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
              📅 {formatDate(todo.dueDate)}
              {isOverdue(todo.dueDate) && ' (지연됨)'}
            </span>
          )}
          <span className="todo-created">
            생성: {formatDate(todo.createdAt)}
          </span>
          {todo.completed && todo.completedAt && (
            <span className="todo-completed">
              완료: {formatDate(todo.completedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
