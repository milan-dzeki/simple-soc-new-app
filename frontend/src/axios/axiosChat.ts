import axios from 'axios';
import baseUrl from './baseUrl';

const axiosChat = axios.create({
  baseURL: `${baseUrl}/chat`
});

export default axiosChat;