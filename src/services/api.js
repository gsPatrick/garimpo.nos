import axios from 'axios';

const api = axios.create({
    baseURL: 'https://geral-apilorenaecommerce.r954jc.easypanel.host/api',
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Opcional: Redirecionar para login ou emitir evento
                // window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

export default api;
