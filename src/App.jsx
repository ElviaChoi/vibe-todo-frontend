import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import TodoControls from './components/TodoControls';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { todoAPI, FILTER_OPTIONS, SORT_OPTIONS } from './services/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('createdAt');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  // 할일 목록 로드
  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const params = {
        page: pagination.currentPage,
        limit: 10,
        sort: sort,
      };

      switch (filter) {
        case 'completed':
          response = await todoAPI.getCompletedTodos(params);
          break;
        case 'incomplete':
          response = await todoAPI.getIncompleteTodos(params);
          break;
        case 'urgent':
          response = await todoAPI.getUrgentTodos(params);
          break;
        default:
          response = await todoAPI.getAllTodos(params);
      }

      setTodos(response.data.todos);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
      console.error('할일 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, sort, pagination.currentPage]);

  // 컴포넌트 마운트 시 할일 로드
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // 할일 추가
  const handleAddTodo = async (todoData) => {
    try {
      await todoAPI.createTodo(todoData);
      setShowAddForm(false);
      loadTodos(); // 목록 새로고침
    } catch (err) {
      throw err; // 에러를 폼으로 전달
    }
  };

  // 할일 수정
  const handleEditTodo = async (id, todoData) => {
    try {
      await todoAPI.updateTodo(id, todoData);
      setEditingTodo(null);
      loadTodos(); // 목록 새로고침
    } catch (err) {
      throw err; // 에러를 폼으로 전달
    }
  };

  // 할일 삭제
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('정말로 이 할일을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await todoAPI.deleteTodo(id);
      loadTodos(); // 목록 새로고침
    } catch (err) {
      setError(err.message);
    }
  };

  // 할일 완료/미완료 토글
  const handleToggleComplete = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      if (todo.completed) {
        await todoAPI.incompleteTodo(id);
      } else {
        await todoAPI.completeTodo(id);
      }
      loadTodos(); // 목록 새로고침
    } catch (err) {
      setError(err.message);
    }
  };

  // 필터 변경
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // 정렬 변경
  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // 할일 추가 폼 토글
  const handleAddTodoClick = () => {
    setShowAddForm(!showAddForm);
    setEditingTodo(null);
  };

  // 할일 수정 시작
  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setShowAddForm(false);
  };

  // 할일 수정 (TodoItem에서 직접 호출)
  const handleEditTodoDirect = async (id, todoData) => {
    try {
      await todoAPI.updateTodo(id, todoData);
      loadTodos(); // 목록 새로고침
    } catch (err) {
      throw err; // 에러를 TodoItem으로 전달
    }
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingTodo(null);
  };

  // 통계 계산
  const stats = {
    total: pagination.totalCount,
    completed: todos.filter(todo => todo.completed).length,
    incomplete: todos.filter(todo => !todo.completed).length,
  };

  return (
    <div className="app">
      <div className="app-container">
        <TodoControls
          filter={filter}
          sort={sort}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onAddTodo={handleAddTodoClick}
          showAddForm={showAddForm}
          totalCount={stats.total}
          completedCount={stats.completed}
          incompleteCount={stats.incomplete}
        />

        {(showAddForm || editingTodo) && (
          <TodoForm
            onSubmit={editingTodo ? 
              (data) => handleEditTodo(editingTodo._id, data) : 
              handleAddTodo
            }
            onCancel={editingTodo ? handleEditCancel : handleAddTodoClick}
            initialData={editingTodo}
            isEditing={!!editingTodo}
          />
        )}

        <TodoList
          todos={todos}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTodoDirect}
          onDelete={handleDeleteTodo}
          loading={loading}
          error={error}
        />

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={!pagination.hasPrevPage}
              className="page-btn"
            >
              이전
            </button>
            <span className="page-info">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={!pagination.hasNextPage}
              className="page-btn"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
