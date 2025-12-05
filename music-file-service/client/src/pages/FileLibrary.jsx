
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UploadSection from "../components/UploadSection";
import FileCard from "../components/FileCard";
import { getFiles, uploadFile } from "../api/fileApi";


export default function FileLibrary() {
    const [files, setFiles] = useState([]);
    const [filter, setFilter] = useState({ requestId: "", taskId: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchFiles() {
        setLoading(true);
        setError("");
        try {
            const data = await getFiles({
                requestId: filter.requestId || undefined,
                taskId: filter.taskId || undefined
            });
            setFiles(data);
        } catch (err) {
            setError("Không thể tải dữ liệu file. Vui lòng kiểm tra kết nối hoặc đăng nhập.");
            setFiles([]);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchFiles();
        // eslint-disable-next-line
    }, [filter.requestId, filter.taskId]);

    async function handleUpload(formData) {
        setError("");
        try {
            await uploadFile(formData);
            await fetchFiles();
        } catch (err) {
            setError("Upload thất bại. Vui lòng kiểm tra kết nối hoặc đăng nhập.");
        }
    }

    return (
        <div className="layout">
            <Sidebar />
            <div className="content">
                <h2>Thư viện file</h2>
                <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                    <input
                        type="text"
                        placeholder="Lọc theo Request ID"
                        value={filter.requestId}
                        onChange={e => setFilter(f => ({ ...f, requestId: e.target.value }))}
                        style={{ width: 140 }}
                    />
                    <input
                        type="text"
                        placeholder="Lọc theo Task ID"
                        value={filter.taskId}
                        onChange={e => setFilter(f => ({ ...f, taskId: e.target.value }))}
                        style={{ width: 140 }}
                    />
                    <button className="upload-btn" onClick={fetchFiles}>Lọc</button>
                </div>
                <UploadSection onUpload={handleUpload} />
                {error && <div style={{ color: "#f87171", marginBottom: 10 }}>{error}</div>}
                {loading ? <div>Đang tải...</div> : (
                    <div className="file-grid">
                        {files.map(f => <FileCard key={f._id || f.file_id} file={f} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
