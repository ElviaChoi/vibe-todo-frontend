import React from 'react';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../services/api';

const TodoControls = ({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  onAddTodo,
  showAddForm,
  totalCount,
  completedCount,
  incompleteCount
}) => {
  return (
    <div className="todo-controls">
      <div className="controls-header">
        <h1>📝 할일 관리</h1>
        <div className="todo-stats">
          <span className="stat-item">
            전체: <strong>{totalCount}</strong>
          </span>
          <span className="stat-item">
            미완료: <strong>{incompleteCount}</strong>
          </span>
          <span className="stat-item">
            완료: <strong>{completedCount}</strong>
          </span>
        </div>
      </div>

      <div className="controls-row">
        <div className="filter-controls">
          <label htmlFor="filter">필터:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="control-select"
          >
            {FILTER_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-controls">
          <label htmlFor="sort">정렬:</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="control-select"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onAddTodo}
          className={`add-todo-btn ${showAddForm ? 'active' : ''}`}
        >
          {showAddForm ? '✖️ 취소' : '➕ 할일 추가'}
        </button>
      </div>
    </div>
  );
};

export default TodoControls;
