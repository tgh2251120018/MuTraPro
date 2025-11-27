import React, { useState } from 'react';
import axios from 'axios'; // Dùng axios gốc cho việc upload binary
import axiosInstance from '../../utils/axiosInstance'; // Dùng instance cho API backend
import { FaXmark, FaCloudArrowUp, FaFile } from 'react-icons/fa6';
import { CgSpinner } from 'react-icons/cg';

interface CreateRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // Callback khi tạo thành công (ví dụ để reload list)
}

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // --- State ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [statusText, setStatusText] = useState(''); // Hiển thị trạng thái upload

    // --- Handlers ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        setStatusText('');
        setIsLoading(false);
    };

    const handleClose = () => {
        if (isLoading) return; // Không cho đóng khi đang upload
        resetForm();
        onClose();
    };

    // --- Logic Upload File 3 Bước ---
    const uploadFileProcess = async (file: File): Promise<string> => {
        try {
            // BƯỚC 1: Initiate
            setStatusText('Initializing upload...');
            const initRes = await axiosInstance.post('/files/upload/initiate', {
                fileName: file.name,
                fileType: file.type || 'application/octet-stream' // Fallback nếu file ko có type
            });

            const { uploadUrl, fileId } = initRes.data;

            // BƯỚC 2: Upload Binary (PUT)
            // Lưu ý: Dùng axios thường, không dùng axiosInstance để tránh kèm Header Auth vào request này
            setStatusText('Uploading file data...');
            await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type || 'application/octet-stream'
                }
            });

            // BƯỚC 3: Complete
            setStatusText('Finalizing...');
            await axiosInstance.post('/files/upload/complete', {
                fileId: fileId,
                sizeInBytes: file.size
            });

            return fileId; // Trả về UUID để gắn vào Request

        } catch (error) {
            console.error("Upload failed", error);
            throw new Error("File upload failed. Please try again.");
        }
    };

    // --- Submit Form ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Request title is required");
            return;
        }

        setIsLoading(true);

        try {
            let attachmentId = null;

            // Nếu có file, thực hiện upload trước
            if (selectedFile) {
                attachmentId = await uploadFileProcess(selectedFile);
            }

            // Tạo Request
            setStatusText('Creating request...');
            await axiosInstance.post('/requests/', {
                request_title: title,
                description: description,
                attachment: attachmentId // UUID hoặc null
                // issued_by, progress, issued_to_task được backend xử lý
            });

            // Thành công
            alert("Request created successfully!");
            if (onSuccess) onSuccess();
            handleClose();

        } catch (error) {
            console.error(error);
            alert("Failed to create request.");
        } finally {
            setIsLoading(false);
            setStatusText('');
        }
    };

    // Nếu không mở thì không render gì cả (hoặc dùng CSS để ẩn)
    // Ở đây dùng CSS class để animate nên vẫn render div nhưng class thay đổi
    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            {/* Kế thừa class .card từ global.css cho khung trắng bo tròn */}
            <div className="card modal-content">

                {/* Header */}
                <div className="modal-header">
                    <h3 className="modal-title">New Service Request</h3>
                    <button className="close-btn" onClick={handleClose} disabled={isLoading}>
                        <FaXmark />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Title Input */}
                    <div className="input-group">
                        <label className="input-label">Title <span className="text-danger">*</span></label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-control"
                                placeholder="e.g. Fix Printer"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    {/* Description Input */}
                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <div className="input-wrapper">
                            <textarea
                                className="input-control"
                                rows={3}
                                placeholder="Describe the issue..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ resize: 'none', height: 'auto' }} // Override style
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* File Upload Zone */}
                    <div className="input-group">
                        <label className="input-label">Attachment (Optional)</label>

                        {!selectedFile ? (
                            <label className="file-upload-zone">
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                    disabled={isLoading}
                                />
                                <FaCloudArrowUp size={30} color="var(--primary-color)" style={{ marginBottom: '8px' }} />
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    Click to upload a file
                                </p>
                            </label>
                        ) : (
                            <div className="file-upload-zone" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                                    <FaFile color="var(--text-secondary)" />
                                    <span style={{ fontSize: '14px', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                        {selectedFile.name}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFile(null)}
                                    className="close-btn"
                                    disabled={isLoading}
                                    title="Remove file"
                                >
                                    <FaXmark size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            type="button"
                            className="btn"
                            onClick={handleClose}
                            disabled={isLoading}
                            style={{ backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                            style={{ minWidth: '120px' }}
                        >
                            {isLoading ? (
                                <>
                                    <CgSpinner className="animate-spin" size={18} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                                    {statusText || 'Processing...'}
                                </>
                            ) : (
                                'Create Request'
                            )}
                        </button>
                    </div>

                    {/* Inline style animation cho spinner (nếu chưa có trong css) */}
                    <style>{`
                        @keyframes spin { 100% { transform: rotate(360deg); } }
                    `}</style>
                </form>
            </div>
        </div>
    );
};

export default CreateRequestModal;