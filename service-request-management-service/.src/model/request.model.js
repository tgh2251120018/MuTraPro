const mongoose = require('mongoose');
const { v7: uuidv7 } = require('uuid');

/**
 * Mongoose Schema for the 'Request' collection.
 * This model stores details about a service request submitted by a user.
 */
const requestSchema = new mongoose.Schema(
    {
        /**
         * The primary key (_id) for the document, set as a UUID.
         * Corresponds to 'PK | uuid | _id' in the diagram.
         */
        _id: {
            type: 'UUID',
            default: () => uuidv7(),
            required: true
        },

        /**
         * The title of the service request.
         * Corresponds to 'string NOT NULL | request_title'.
         */
        request_title: {
            type: String,
            required: [true, 'Request title is required'],
        },

        /**
         * The UUID of the user (Customer) who issued the request.
         * This links to the User Management Service.
         * Corresponds to 'uuid NOT NULL | issued_by'.
         */
        issued_by: {
            type: 'UUID',
            required: [true, 'Issuer UUID is required'],
            index: true
        },

        /**
         * A detailed description of the service request.
         * Corresponds to 'string | description'.
         */
        description: {
            type: String,
        },

        /**
         * The current status of the request.
         * Corresponds to 'enum NOT NULL | progress'.
         * Enum values are taken from the microservice specification.
         */
        progress: {
            type: String,
            required: true,
            enum: ['Pending', 'Assigned', 'In Progress', 'Completed'],
            default: 'Pending',
            index: true
        },

        /**
         * The UUID of the task created by the Task Assignment Service.
         * This links the request to its corresponding task(s).
         * Corresponds to 'uuid | issued_to_task'.
         */
        issued_to_task: {
            type: 'UUID',
            default: null,
        },
        attachment: {
            type: 'UUID',
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "update_at" },
        _id: false,
    }
);

// Create and export the model
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;