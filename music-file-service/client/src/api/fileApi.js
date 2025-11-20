import axios from "axios";

const BASE_URL = "http://localhost:5002/files";

export async function getFiles() {
    const res = await axios.get(BASE_URL, {
        headers: {
            "x-user-id": "123", // mock giả - gateway sẽ gửi thật
            "x-user-role": "customer",
            "x-account-type": "premium"
        }
    });
    return res.data;
}

export async function uploadMetadata(metadata) {
    const res = await axios.post(BASE_URL, metadata, {
        headers: {
            "x-user-id": "123",
            "x-user-role": "customer",
            "x-account-type": "premium"
        }
    });
    return res.data;
}
