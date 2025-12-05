import { useState } from "react";
import { getDownloadUrl } from "../api/fileApi";

export default function FileCard({ file }) {
    const [audio, setAudio] = useState(null);
    const [playing, setPlaying] = useState(false);

    function handlePlay() {
        if (audio) {
            audio.pause();
            setAudio(null);
            setPlaying(false);
            return;
        }
        const audioObj = new Audio(getDownloadUrl(file.file_id));
        audioObj.onended = () => setPlaying(false);
        audioObj.play();
        setAudio(audioObj);
        setPlaying(true);
    }

    function handleDownload(version) {
        window.open(getDownloadUrl(file.file_id, version), "_blank");
    }

    return (
        <div className="file-card">
            <div style={{ marginBottom: 8 }}>
                <b>{file.file_name}</b>
            </div>
            <div style={{ fontSize: 13, color: "#8b949e" }}>
                Định dạng: {file.file_type} <br />
                Dung lượng: {file.size_in_mb} MB <br />
                Phiên bản: {file.version}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                {(file.file_type.startsWith("audio/")) && (
                    <button className="play-btn" onClick={handlePlay}>
                        {playing ? "Dừng" : "Play"}
                    </button>
                )}
                <button className="play-btn" onClick={() => handleDownload()}>Download</button>
            </div>
            {file.versions && file.versions.length > 0 && (
                <div style={{ marginTop: 10 }}>
                    <b style={{ fontSize: 13 }}>Các phiên bản cũ:</b>
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                        {file.versions.map(v => (
                            <li key={v.version_number} style={{ fontSize: 13 }}>
                                v{v.version_number} <button className="play-btn" style={{ padding: "2px 8px", fontSize: 12 }} onClick={() => handleDownload(v.version_number)}>Download</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
