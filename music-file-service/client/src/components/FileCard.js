export default function FileCard({ file }) {
    return (
        <div className="file-card">
            <p className="file-name">{file.file_name}</p>
            <p className="file-duration">Duration: 03:24</p>
            <button className="play-btn">Play</button>
        </div>
    );
}
