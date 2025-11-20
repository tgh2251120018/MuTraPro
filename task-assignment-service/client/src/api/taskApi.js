import axios from "axios";

const API = "http://localhost:5001/tasks";

export const getTasks = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createTask = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

export const uploadTaskResult = async (id, files) => {
  const form = new FormData();
  for (const f of files) form.append("result_files", f);
  const res = await axios.post(`${API}/${id}/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};
