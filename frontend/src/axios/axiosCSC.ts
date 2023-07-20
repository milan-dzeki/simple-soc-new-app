import axios from "axios";
import baseUrl from "./baseUrl";

const axiosCSC = axios.create({
  baseURL: `${baseUrl}/csc`
});

export default axiosCSC;