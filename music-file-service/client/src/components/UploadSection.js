import React from "react";

export default function UploadSection({ onUpload }) {
    return (
        <div className="upload-section">
            <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => onUpload(e.target.files[0])}
            />
            <button
                className="upload-btn"
                onClick={() => document.getElementById("fileInput").click()}
            >
                Upload
            </button>
        </div>
    );
}
