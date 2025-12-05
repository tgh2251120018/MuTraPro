export interface RequestResponse {
    _id: string;
    request_title: string;
    issued_by: string;       // User ID
    description?: string;
    progress: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
    issued_to_task?: string | null;
    attachment?: string | null; // UUID của file (có thể null)
    created_at: string;
    update_at: string;
}