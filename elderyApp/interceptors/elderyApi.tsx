import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
const elderlyApi = axios.create({
  baseURL: 'http://10.0.2.2:3000/api', // Set your base URL
});
elderlyApi.interceptors.request.use(
  async config => {
    const token = await GoogleSignin.getTokens();
    if (!config?.headers) {
      config.headers = {};
    }
    config.headers.AccessToken = token.accessToken;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default elderlyApi;
