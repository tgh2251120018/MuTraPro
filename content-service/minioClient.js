const Minio = require('minio');
require('dotenv').config();

class MinioService {
    constructor() {
        this.minioClient = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT, // 'minio' (internal docker network)
            port: parseInt(process.env.MINIO_PORT, 10),
            useSSL: process.env.MINIO_USE_SSL === 'true',
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
        });

        this.bucketName = process.env.MINIO_BUCKET_NAME;
        this.publicEndpoint = process.env.PUBLIC_ENDPOINT || 'http://localhost:9000';

        this.ensureBucketExists();
    }

    async ensureBucketExists() {
        try {
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
                // [INSTRUCTION_B] Set policy to allow downloads if needed, or keep private [INSTRUCTION_E]
                console.log(`Bucket '${this.bucketName}' created.`);
            }
        } catch (err) {
            console.error('Bucket check failed:', err);
        }
    }

    /**
     * Generate Upload URL (PUT)
     */
    async getPresignedUploadUrl(objectName) {
        // Expiry: 15 minutes (900 seconds)
        const url = await this.minioClient.presignedPutObject(this.bucketName, objectName, 900);

        // [INSTRUCTION_B] FIX LOCALHOST ISSUE: Replace internal 'minio' hostname with 'localhost' for the browser [INSTRUCTION_E]
        if (process.env.MINIO_ENDPOINT === 'minio') {
            return url.replace('http://minio:9000', this.publicEndpoint);
        }
        return url;
    }

    /**
         * Generate Download URL with "Save As" name support
         */
    async getPresignedDownloadUrl(objectName, downloadName = null) {
        let reqParams = {};

        // [INSTRUCTION_B] Handle "Save As" filename. 
        // We must encodeURIComponent to handle Vietnamese characters correctly.
        // RFC 5987 standard: filename*=UTF-8''encoded_name
        // [INSTRUCTION_E]
        if (downloadName) {
            const encodedName = encodeURIComponent(downloadName);
            reqParams['response-content-disposition'] = `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`;
        }

        // Expiry: 1 hour (3600s)
        const url = await this.minioClient.presignedGetObject(this.bucketName, objectName, 3600, reqParams);

        if (process.env.MINIO_ENDPOINT === 'minio') {
            return url.replace('http://minio:9000', this.publicEndpoint);
        }
        return url;
    }
}

module.exports = new MinioService();