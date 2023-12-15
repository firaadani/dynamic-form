import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BE_URL;

const axiosAuth = axios.create({
  baseURL: BASE_URL,
});

export default axiosAuth;
