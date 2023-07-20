import axios from 'axios';
import baseUrl from './baseUrl';

const axiosActivityLogs = axios.create({
  baseURL: `${baseUrl}/activity`
});

export default axiosActivityLogs;