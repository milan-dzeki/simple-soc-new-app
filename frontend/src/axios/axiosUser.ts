import axios from 'axios';
import baseUrl from './baseUrl';

const axiosUser = axios.create({
  baseURL: `${baseUrl}/user`
});

export default axiosUser;