const express = require('express');
const minioService = require('./minioClient');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- INTERNAL API (Dành cho Metadata Service gọi) ---

/**
 * 1. Generate Presigned Upload URL
 * This endpoint is called by your Business Service (Metadata Service).
 * It does NOT handle the file itself.
 */
app.post('/internal/presigned-upload', async (req, res) => {
    // [INSTRUCTION_B] Validate inputs strictly as this is an internal trusted API [INSTRUCTION_E]
    const { filename } = req.body;

    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    try {
        // Generate the URL allowing PUT request
        const url = await minioService.getPresignedUploadUrl(filename);

        // Return URL and the final object path
        res.json({
            uploadUrl: url,
            method: 'PUT',
            objectName: filename
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
});

app.post('/internal/presigned-download', async (req, res) => {
    const { objectName, filenameOverride } = req.body;

    if (!objectName) {
        return res.status(400).json({ error: 'objectName is required' });
    }

    try {
        // Gọi hàm xử lý logic bên minioClient.js
        const url = await minioService.getPresignedDownloadUrl(objectName, filenameOverride);

        res.json({ downloadUrl: url });
    } catch (error) {
        console.error('Error generating download URL:', error);
        res.status(500).json({ error: 'Failed to generate download URL' });
    }
});

// --- PUBLIC API (Dành cho Client/Frontend gọi) ---

/**
 * 2. Get Download URL
 * Redirects the user directly to MinIO to download the file.
 */
app.get('/files/:filename', async (req, res) => {
    try {
        const url = await minioService.getFileUrl(req.params.filename);
        // [INSTRUCTION_B] Using 302 Redirect puts the download load on MinIO, not this Node.js server [INSTRUCTION_E]
        res.redirect(url);
    } catch (error) {
        res.status(404).json({ error: 'File not found' });
    }
});



app.listen(PORT, () => {
    console.log(`Storage Service running on port ${PORT}`);
});