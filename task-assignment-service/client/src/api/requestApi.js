import axios from "axios";

const API = "http://localhost:5001/requests";

export const getRequests = async () => {
	const res = await axios.get(API);
	return res.data;
};

export const createRequest = async (data, files) => {
	const form = new FormData();
	for (const key in data) form.append(key, data[key]);
	if (files) for (const f of files) form.append("attachments", f);
	const res = await axios.post(API, form, {
		headers: { "Content-Type": "multipart/form-data" }
	});
	return res.data;
};

export const getRequestDetail = async (id) => {
	const res = await axios.get(`${API}/${id}`);
	return res.data;
};
