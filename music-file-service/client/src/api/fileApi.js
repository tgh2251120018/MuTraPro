import axios from "axios";

const BASE_URL = "http://localhost:5002/files";


export async function getFiles({ requestId, taskId } = {}) {
    const params = {};
    if (requestId) params.requestId = requestId;
    if (taskId) params.taskId = taskId;
    const res = await axios.get(BASE_URL, {
        params,
        headers: {
            "x-user-id": "123",
            "x-user-role": "customer",
            "x-account-type": "premium"
        }
    });
    return res.data;
}

export async function uploadFile(formData) {
    const res = await axios.post(BASE_URL + "/upload", formData, {
        headers: {
            "x-user-id": "123",
            "x-user-role": "customer",
            "x-account-type": "premium",
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}

export function getDownloadUrl(file_id, version) {
    let url = `${BASE_URL}/download/${file_id}`;
    if (version) url += `?version=${version}`;
    return url;
}
