import axios from "axios";
import baseUrl from "./baseUrl";

const axiosPhotoAlbum = axios.create({
  baseURL: `${baseUrl}/photoAlbum`
});

export default axiosPhotoAlbum;