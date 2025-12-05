import React from "react";

import { useRef, useState } from "react";

export default function UploadSection({ onUpload }) {
    const fileInput = useRef();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [requestId, setRequestId] = useState("");
    const [taskId, setTaskId] = useState("");

    async function handleFileChange(e) {
        setError("");
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            if (requestId) formData.append("requestId", requestId);
            if (taskId) formData.append("taskId", taskId);
            await onUpload(formData);
        } catch (err) {
            setError("Upload thất bại");
        }
        setUploading(false);
        fileInput.current.value = "";
    }

    return (
        <div className="upload-section">
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                    type="text"
                    placeholder="Request ID (tùy chọn)"
                    value={requestId}
                    onChange={e => setRequestId(e.target.value)}
                    style={{ width: 120 }}
                />
                <input
                    type="text"
                    placeholder="Task ID (tùy chọn)"
                    value={taskId}
                    onChange={e => setTaskId(e.target.value)}
                    style={{ width: 120 }}
                />
            </div>
            <input
                type="file"
                ref={fileInput}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="audio/mp3,audio/mpeg,video/mp4,application/pdf"
            />
            <button
                className="upload-btn"
                onClick={() => fileInput.current.click()}
                disabled={uploading}
            >
                {uploading ? "Đang upload..." : "Upload"}
            </button>
            {error && <span style={{ color: "#f87171", marginLeft: 10 }}>{error}</span>}
        </div>
    );
}
