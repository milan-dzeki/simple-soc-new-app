import axios from 'axios';
import baseUrl from './baseUrl';

const axiosSettings = axios.create({
  baseURL: `${baseUrl}/settings`
});

export default axiosSettings;