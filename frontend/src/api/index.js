import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const paymentApi = axios.create({
  baseURL: "http://localhost:4000/api/v1",
});

export const studioApi = axios.create({
  baseURL: "http://localhost:4100/api/v1",
});
