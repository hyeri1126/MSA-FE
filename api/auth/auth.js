import apiClient from "../config/axios";

export const authApi = {
    // 로그인
    login: async (username, password) => {
        try{
            const response = await apiClient.post('/user/president/login', {
                email,
                password
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // 로그아웃
    logout: async () => {
        try {
            // Spring Boot 서버에 로그아웃 요청
            const response = await apiClient.get('/user/president/logout');
           
        } catch (error) {
            throw error;
        }
    },

    // 토큰 유효성 검사(나중에 수정)
    validateToken: async () => {
        try {
            const response = await apiClient.get('/api/auth/validate');
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            throw error;
        }
    },

    // ID 찾기 함수
    findId: async (name, phoneNumber) => {
        try {
            const response = await apiClient.post('/user/president/id-find', {
                name,
                phone_number: phoneNumber
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};