const Request = require('../model/request.model.js');

// Define privileged roles based on the document
const PRIVILEGED_ROLES = ['COORDINATOR', 'ADMIN'];

/**
 * Creates a new service request.
 * 'issued_by' is now automatically set from the 'x-user-id' header.
 */
exports.createRequest = async (req, res) => {
    try {
        const newRequest = new Request({
            ...req.body,
            // [INSTRUCTION_B]
            // Overwrite 'issued_by' with the authenticated user's ID from the header
            // [INSTRUCTION_E]
            issued_by: req.user.id,
        });

        // Ensure fields that a customer cannot set are not set on creation
        newRequest.progress = 'Pending'; // Force 'Pending' on creation
        newRequest.issued_to_task = null;

        const savedRequest = await newRequest.save();
        res.status(201).json({ message: 'Request created successfully', request_title: savedRequest.request_title, id: savedRequest._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Retrieves service requests.
 * - Customers only see their own requests.
 * - Coordinators/Admins see all requests.
 */
exports.getAllRequests = async (req, res) => {
    try {
        const filter = {};

        // [INSTRUCTION_B]
        // Check the user's role to determine the filter logic
        // [INSTRUCTION_E]
        if (PRIVILEGED_ROLES.includes(req.user.role)) {
            // Admin/Coordinator: Can see all.
            // They can still filter by 'issued_by' if they pass it as a query param.
            if (req.query.issued_by) {
                filter.issued_by = req.query.issued_by;
            }
        } else {
            // Customer (or other non-privileged roles):
            // Force filter to only show their own requests
            filter.issued_by = req.user.id;
        }

        // Add progress filter if present in query
        if (req.query.progress) {
            filter.progress = req.query.progress;
        }

        const requests = await Request.find(filter).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Retrieves a single service request by its ID.
 * - Customers can only see their own requests.
 * - Coordinators/Admins can see any request.
 */
exports.getRequestById = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // [INSTRUCTION_B]
        // Authorization check
        // [INSTRUCTION_E]
        const isOwner = request.issued_by.toString() === req.user.id.toString();
        const isPrivileged = PRIVILEGED_ROLES.includes(req.user.role);

        if (!isOwner && !isPrivileged) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to view this request.' });
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRequestsBySenderId = async (req, res) => {
    try {
        const { senderId } = req.params;
        const authenticatedUser = req.user;

        // [INSTRUCTION_B]
        // Authorization Check:
        // 1. User is not Admin/Coordinator
        // 2. User is trying to access someone else's requests
        // [INSTRUCTION_E]
        const isPrivileged = PRIVILEGED_ROLES.includes(authenticatedUser.role);
        const isOwner = authenticatedUser.id === senderId;

        if (!isPrivileged && !isOwner) {
            return res.status(403).json({ message: 'Forbidden: You can only view your own requests.' });
        }

        // Filter to find all requests by the specified senderId
        const filter = { issued_by: senderId };

        // Add progress filter if present in query
        if (req.query.progress) {
            filter.progress = req.query.progress;
        }

        const requests = await Request.find(filter).sort({ createdAt: -1 });

        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: 'No requests found for this sender.' });
        }

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Updates an existing service request.
 * - Customers can only update minor fields (desc, attachment) IF status is 'Pending'.
 * - Coordinators/Admins can update all fields (e.g., progress, issued_to_task).
 */
exports.updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const requestToUpdate = await Request.findById(id);

        if (!requestToUpdate) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const isOwner = requestToUpdate.issued_by.toString() === req.user.id.toString();
        const isPrivileged = PRIVILEGED_ROLES.includes(req.user.role);

        let updateData = {};

        if (isPrivileged) {
            // Admin/Coordinator: Can update all fields from req.body
            updateData = req.body;

            // [INSTRUCTION_B]
            // Ensure 'issued_by' is not accidentally changed unless explicitly intended
            // (Though it's generally bad practice to change 'issued_by')
            // [INSTRUCTION_E]
            if (req.body.issued_by) {
                updateData.issued_by = req.body.issued_by;
            }

        } else if (isOwner) {
            // Customer: Can only update if 'Pending'
            if (requestToUpdate.progress !== 'Pending') {
                return res.status(403).json({ message: 'Forbidden: Cannot update a request that is already in progress.' });
            }

            // Only allow updating specific, non-critical fields
            if (req.body.request_title) updateData.request_title = req.body.request_title;
            if (req.body.description) updateData.description = req.body.description;
            if (req.body.attachment) updateData.attachment = req.body.attachment;

        } else {
            // Not owner and not privileged
            return res.status(403).json({ message: 'Forbidden: You do not have permission to update this request.' });
        }

        const updatedRequest = await Request.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Deletes a service request by its ID.
 * - Customers can only delete their own requests IF status is 'Pending'.
 * - Coordinators/Admins can delete any request.
 */
exports.deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const requestToDelete = await Request.findById(id);

        if (!requestToDelete) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const isOwner = requestToDelete.issued_by.toString() === req.user.id.toString();
        const isPrivileged = PRIVILEGED_ROLES.includes(req.user.role);

        if (!isPrivileged && !isOwner) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this request.' });
        }

        // Customer-specific check
        if (isOwner && !isPrivileged && requestToDelete.progress !== 'Pending') {
            return res.status(403).json({ message: 'Forbidden: Cannot delete a request that is already in progress.' });
        }

        // Privileged user or Owner of a 'Pending' request can delete
        await Request.findByIdAndDelete(id);

        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};