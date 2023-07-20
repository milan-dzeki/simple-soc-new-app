import axios from 'axios';
import baseUrl from './baseUrl';

const axiosAuth = axios.create({
  baseURL: `${baseUrl}/auth`
});

export default axiosAuth;