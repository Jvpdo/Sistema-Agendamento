import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ennuyante-coinstantaneous-rosemarie.ngrok-free.dev'
                
});

export default api;