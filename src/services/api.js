// 환경변수에서 API URL 가져오기 (Vite에서는 VITE_ 접두사 필요)
// 프록시 사용 시에는 상대 경로 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/todos';

// API 통신을 위한 기본 함수
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('API 요청 URL:', url);
    console.log('API 요청 설정:', config);
    
    const response = await fetch(url, config);
    console.log('API 응답 상태:', response.status, response.statusText);
    console.log('API 응답 헤더:', response.headers);
    
    const data = await response.json();
    console.log('API 응답 데이터:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'API 요청에 실패했습니다');
    }
    
    return data;
  } catch (error) {
    console.error('API 요청 오류:', error);
    console.error('에러 상세:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// 할일 관련 API 함수들
export const todoAPI = {
  // 모든 할일 조회
  getAllTodos: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `?${queryString}` : '';
    return apiRequest(endpoint);
  },

  // 특정 할일 조회
  getTodoById: async (id) => {
    return apiRequest(`/${id}`);
  },

  // 할일 생성
  createTodo: async (todoData) => {
    return apiRequest('', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
  },

  // 할일 수정
  updateTodo: async (id, todoData) => {
    return apiRequest(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todoData),
    });
  },

  // 할일 삭제
  deleteTodo: async (id) => {
    return apiRequest(`/${id}`, {
      method: 'DELETE',
    });
  },

  // 할일 완료 처리
  completeTodo: async (id) => {
    return apiRequest(`/${id}/complete`, {
      method: 'PATCH',
    });
  },

  // 할일 미완료 처리
  incompleteTodo: async (id) => {
    return apiRequest(`/${id}/incomplete`, {
      method: 'PATCH',
    });
  },

  // 완료된 할일 조회
  getCompletedTodos: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/status/completed${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // 미완료 할일 조회
  getIncompleteTodos: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/status/incomplete${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  // 마감 임박 할일 조회
  getUrgentTodos: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/status/urgent${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },
};

// 우선순위 옵션
export const PRIORITY_OPTIONS = [
  { value: 'low', label: '낮음', color: 'green' },
  { value: 'medium', label: '보통', color: 'yellow' },
  { value: 'high', label: '높음', color: 'red' },
];

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: 'createdAt', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'title', label: '제목순' },
  { value: 'priority', label: '우선순위순' },
  { value: 'dueDate', label: '마감일순' },
];

// 필터 옵션
export const FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'incomplete', label: '미완료' },
  { value: 'completed', label: '완료' },
  { value: 'urgent', label: '마감임박' },
];
