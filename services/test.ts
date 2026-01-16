import axios from 'axios';

export const fetchHelloData = async () => {
  try {
    const response = await axios.get('https://taskload-one.vercel.app/api/hello');
    return response.data;
  } catch (error) {
    throw error;
  }
};
