import axios from "axios";
// import { requestPost } from "../baseService";

export const doLogin = async (email, password) =>
  axios.post("api/loginDummy", { email, password });
