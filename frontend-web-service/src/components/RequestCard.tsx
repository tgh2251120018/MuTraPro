import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Đảm bảo axiosInstance đã fix token
import { type RequestResponse } from '../types/request';
import { type FileResponse } from '../types/file';
import { FaFile, FaFilePdf, FaFileImage, FaFileWord, FaDownload, FaClock, FaSpinner } from 'react-icons/fa6';
import { MdError } from 'react-icons/md';

// Helper: Format kích thước file
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper: Chọn icon dựa trên file type
const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <FaFileImage className="text-blue-500" />;
    if (mimeType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (mimeType.includes('word')) return <FaFileWord className="text-blue-700" />;
    return <FaFile className="text-gray-500" />;
};

// Helper: Màu badge theo trạng thái
const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Assigned': 'bg-blue-100 text-blue-800 border-blue-200',
        'In Progress': 'bg-purple-100 text-purple-800 border-purple-200',
        'Completed': 'bg-green-100 text-green-800 border-green-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

interface RequestCardProps {
    request: RequestResponse;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
    const [fileInfo, setFileInfo] = useState<FileResponse | null>(null);
    const [loadingFile, setLoadingFile] = useState<boolean>(false);
    const [fileError, setFileError] = useState<boolean>(false);

    // Fetch thông tin file nếu có attachment ID
    useEffect(() => {
        const fetchFileInfo = async () => {
            if (request.attachment) {
                setLoadingFile(true);
                try {
                    // Gọi API localhost:8000/files/:id
                    const response = await axiosInstance.get<FileResponse>(`/files/${request.attachment}`);
                    setFileInfo(response.data);
                } catch (error) {
                    console.error("Failed to fetch file info:", error);
                    setFileError(true);
                } finally {
                    setLoadingFile(false);
                }
            }
        };

        fetchFileInfo();
    }, [request.attachment]);

    return (
        // Sử dụng class .card từ global.css, thêm hover effect
        <div className="card" style={{ padding: '24px', marginBottom: '16px', transition: 'transform 0.2s', cursor: 'default' }}>

            {/* --- Header: Title & Status --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    {request.request_title}
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusBadge(request.progress)}`}>
                    {request.progress}
                </span>
            </div>

            {/* --- Date Info --- */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <FaClock />
                <span>Created: {new Date(request.created_at).toLocaleDateString()}</span>
            </div>

            {/* --- Description --- */}
            {request.description && (
                <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '20px' }}>
                    {request.description}
                </p>
            )}

            {/* --- Attachment Section --- */}
            {request.attachment && (
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        ATTACHMENT
                    </p>

                    {/* Case 1: Loading */}
                    {loadingFile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            <FaSpinner className="animate-spin" /> Loading file info...
                        </div>
                    )}

                    {/* Case 2: Error */}
                    {!loadingFile && fileError && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ef4444' }}>
                            <MdError size={16} /> Unable to load attachment info.
                        </div>
                    )}

                    {/* Case 3: Success */}
                    {!loadingFile && fileInfo && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 14px',
                            backgroundColor: 'var(--bg-input)', // Tự động theo theme
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)'
                        }}>
                            {/* Icon Loại File */}
                            <div style={{ fontSize: '24px', marginRight: '12px' }}>
                                {getFileIcon(fileInfo.original_version.file_type)}
                            </div>

                            {/* Thông tin File */}
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: 'var(--text-main)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }} title={fileInfo.display_name}>
                                    {fileInfo.display_name}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    {formatFileSize(fileInfo.original_version.size_in_bytes)} • {fileInfo.original_version.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                                </div>
                            </div>

                            {/* Nút Download (Giả lập) */}
                            {/* Bạn có thể thêm API download ở đây sau này */}
                            <button
                                className="btn"
                                style={{ padding: '8px', borderRadius: '50%', color: 'var(--primary-color)', backgroundColor: 'transparent' }}
                                title="Download"
                                onClick={(e) => {
                                    e.stopPropagation(); // Tránh click vào card
                                    // Logic download
                                    //window.open(`http://localhost:8000/files/download/${fileInfo.file_id}`, '_blank');
                                }}
                            >
                                <FaDownload />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RequestCard;