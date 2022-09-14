import $axios from "axios";

const axios = $axios.create({
  baseURL: 'https://floating-mountain-35184.herokuapp.com',
});

export default axios