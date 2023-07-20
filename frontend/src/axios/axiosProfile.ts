import axios from 'axios';
import baseUrl from './baseUrl';

const axiosProfile = axios.create({
  baseURL: `${baseUrl}/profile`
});

export default axiosProfile;