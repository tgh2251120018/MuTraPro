import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UploadSection from "../components/UploadSection";
import FileCard from "../components/FileCard";
import { getFiles, uploadMetadata } from "../api/fileApi";
import { v4 as uuidv4 } from "uuid";

export default function FileLibrary() {

    const [files, setFiles] = useState([]);

    useEffect(() => {
        getFiles().then(setFiles);
    }, []);

    async function handleUpload(file) {
        const metadata = {
            file_id: uuidv4(),
            file_name: file.name,
            file_type: file.type,
            size_in_mb: (file.size / (1024*1024)).toFixed(2),
            uploader: "123",
            version: 1,
            url: `/uploads/${file.name}`
        };

        await uploadMetadata(metadata);
        const refreshed = await getFiles();
        setFiles(refreshed);
    }

    return (
        <div className="layout">
            <Sidebar />

            <div className="content">
                <h2>Thư viện file</h2>

                <UploadSection onUpload={handleUpload} />

                <div className="file-grid">
                    {files.map(f => <FileCard key={f._id} file={f} />)}
                </div>
            </div>
        </div>
    );
}
