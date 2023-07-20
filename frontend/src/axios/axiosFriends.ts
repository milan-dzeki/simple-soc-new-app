import axios from "axios";
import baseUrl from "./baseUrl";

const axiosFriends = axios.create({
  baseURL: `${baseUrl}/friends`
});

export default axiosFriends;