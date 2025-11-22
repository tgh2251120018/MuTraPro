import mongoose from 'mongoose';
import { v7 as uuidv7 } from 'uuid'; // Use ES Module import

/**
 * Mongoose Schema for the 'FileMetadata' collection.
 * This model stores metadata about files uploaded to the system.
 */
const fileMetadataSchema = new mongoose.Schema(
  {
    /**
     * The primary key (_id) for the document, set as a UUIDv7.
     */
    _id: {
      type: 'UUID',
      default: () => uuidv7(),
      required: true,
    },

    /**
     * The full URL where the file can be accessed
     */
    url: {
      type: String,
      required: [true, 'File URL is required'],
    },

    /**
     * The UUID of the user who uploaded the file.
     * This links to the User Management Service.
     */
    uploader: {
      type: 'UUID',
      required: [true, 'Uploader UUID is required'],
      index: true,
    },

    /**
     * The original name of the file upon upload.
     */
    file_name: {
      type: String,
      required: [true, 'File name is required'],
    },

    /**
     * The MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
     */
    file_type: {
      type: String,
      required: [true, 'File type is required'],
    },

    /**
     * The size of the file, stored in megabytes.
     */
    size_in_mb: {
      type: Number,
      required: true,
      default: 0,
    },

    /**
     * A checksum (e.g., MD5, SHA256) to verify file integrity (optional).
     */
    checksum: {
      type: String,
      default: null,
    },
  },
  {
    // Tell Mongoose to not create its own _id, as we are providing it.
    _id: false,

    // Keep your original timestamp naming convention
    timestamps: { createdAt: 'created_at', updatedAt: 'modified_at' },
  }
);

export default mongoose.model("FileMetadata", fileMetadataSchema, "file_metadata");
