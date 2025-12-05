export interface FileResponse {
    // Entity Info
    file_id: string;
    display_name: string;
    owner_id: string;
    created_at: string;
    current_total_versions: number;

    // Version Info
    original_version: {
        version_id: string;
        file_entity_id: string;
        version_number: number;
        file_type: string;        // MIME type (image/png, application/pdf...)
        size_in_bytes: number;
        uploader_id: string;
        created_at: string;
        status: string;
    };
}