import { requestPost } from "../../utils/baseService";
import { setTokenCookie } from "../../utils/cookieHelper";
import axios from "axios";

async function handler(req, res) {
  try {
    console.log("req ==> ", res);
    let response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
      {
        username: req.body.email,
        password: req.body.password,
        from_android: true,
      }
    );

    const token = response?.data?.access_token;
    const otp_verified = response?.data?.data?.otp_verified;
    const phone = response?.data?.data?.phone;
    const role = response?.data?.data?.role?.description;

    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login Succeed",
      data: {
        token,
        otp_verified,
        role,
      },
    });
  } catch (err) {
    console.error("Error login____", err?.response?.data);
    return res.status(err?.response?.data?.statusCode).json({
      success: false,
      message: `Login Failed. ${err?.response?.data?.message}`,
    });
  }

  // return res.status(401).json({
  //   success: false,
  //   message: "Login gagal, email atau password salah",
  // });
}

export default handler;
