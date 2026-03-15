import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sistema-agendamento-production-1690.up.railway.app',
    
});

export default api;