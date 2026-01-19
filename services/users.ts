import axios from "axios";

export const loginPost = async (email: string, pass: string) => {
  try {
    const response = await axios.post(
      "https://taskload-one.vercel.app/api/auth/login",
      {
        email: email,
        pass: pass,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
