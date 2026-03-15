import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ennuyante-coinstantaneous-rosemarie.ngrok-free.dev',
    headers: {
    'ngrok-skip-browser-warning': 'true'
    }
});

export default api;