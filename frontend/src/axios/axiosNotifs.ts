import axios from 'axios';
import baseUrl from './baseUrl';

const axiosNotifs = axios.create({
  baseURL: `${baseUrl}/notification`
});

export default axiosNotifs;