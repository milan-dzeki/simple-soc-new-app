import axios from 'axios';
import baseUrl from './baseUrl';

const axiosPost = axios.create({
  baseURL: `${baseUrl}/post`
});

export default axiosPost;