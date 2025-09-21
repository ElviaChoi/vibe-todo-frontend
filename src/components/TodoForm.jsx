import React, { useState } from 'react';
import { PRIORITY_OPTIONS } from '../services/api';

const TodoForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    category: initialData?.category || '',
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 해당 필드의 오류 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    } else if (formData.title.length > 100) {
      newErrors.title = '제목은 100자 이하로 입력해주세요';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = '설명은 500자 이하로 입력해주세요';
    }

    if (formData.category && formData.category.length > 50) {
      newErrors.category = '카테고리는 50자 이하로 입력해주세요';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0); // 오늘 자정으로 설정

      if (isNaN(dueDate.getTime())) {
        newErrors.dueDate = '올바른 날짜를 입력해주세요';
      } else if (dueDate <= now) {
        newErrors.dueDate = '마감일은 오늘 이후로 설정해주세요';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      // 성공 시 폼 초기화 (새 할일 추가인 경우만)
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          category: '',
          dueDate: '',
        });
      }
    } catch (error) {
      console.error('할일 저장 오류:', error);
      // 서버 오류 처리
      if (error.message.includes('제목')) {
        setErrors({ title: error.message });
      } else if (error.message.includes('설명')) {
        setErrors({ description: error.message });
      } else if (error.message.includes('카테고리')) {
        setErrors({ category: error.message });
      } else if (error.message.includes('마감일')) {
        setErrors({ dueDate: error.message });
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        dueDate: '',
      });
      setErrors({});
    }
  };

  return (
    <div className="todo-form-container">
      <form onSubmit={handleSubmit} className="todo-form">
        <h2>{isEditing ? '할일 수정' : '새 할일 추가'}</h2>
        
        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title" className="required">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="할일 제목을 입력하세요"
            className={`form-input ${errors.title ? 'error' : ''}`}
            maxLength={100}
            disabled={isSubmitting}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
          <div className="char-count">
            {formData.title.length}/100
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">설명</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="할일에 대한 설명을 입력하세요 (선택사항)"
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            maxLength={500}
            rows={4}
            disabled={isSubmitting}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
          <div className="char-count">
            {formData.description.length}/500
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">우선순위</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="form-select"
              disabled={isSubmitting}
            >
              {PRIORITY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">카테고리</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="카테고리 (선택사항)"
              className={`form-input ${errors.category ? 'error' : ''}`}
              maxLength={50}
              disabled={isSubmitting}
            />
            {errors.category && (
              <span className="error-message">{errors.category}</span>
            )}
            <div className="char-count">
              {formData.category.length}/50
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">마감일</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className={`form-input ${errors.dueDate ? 'error' : ''}`}
            disabled={isSubmitting}
          />
          {errors.dueDate && (
            <span className="error-message">{errors.dueDate}</span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? '저장 중...' : (isEditing ? '수정' : '추가')}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-btn"
            disabled={isSubmitting}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
