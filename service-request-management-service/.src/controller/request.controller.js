const Request = require('../model/request.model.js');

const PRIVILEGED_ROLES = ['COORDINATOR', 'ADMIN'];

/**
 * Converts a Mongoose doc to a plain object with string UUIDs.
 * @param {import('mongoose').Document} doc - The Mongoose document.
 */
const sanitizeRequest = (doc) => {
    if (!doc) {
        return null;
    }

    // [INSTRUCTION_B]
    // Get the plain object
    // [INSTRUCTION_E]
    const reqObject = doc.toObject();

    // [INSTRUCTION_B]
    // FIX: Overwrite the binary UUID fields in reqObject by calling
    // .toUUID().toString() on the *original Mongoose document* (doc),
    // not on the plain object's Buffer properties (reqObject).
    // [INSTRUCTION_E]
    if (doc._id) {
        reqObject._id = doc._id.toString();
    }
    if (doc.issued_by) {
        reqObject.issued_by = doc.issued_by.toString();
    }
    if (doc.issued_to_task) {
        reqObject.issued_to_task = doc.issued_to_task.toString();
    }
    if (doc.attachment) {
        reqObject.attachment = doc.attachment.toString();
    }
    return reqObject;
};

/**
 * Creates a new service request.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.createRequest = async (req, res) => {
    try {
        const newRequest = new Request({
            ...req.body,
            issued_by: req.user.id,
            progress: 'Pending',
            issued_to_task: null,
        });

        const savedRequest = await newRequest.save();

        res.status(201).json({
            message: 'Request created successfully',
            request_title: savedRequest.request_title,
            id: savedRequest._id.toString()
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Retrieves service requests (own requests or all for privileged roles).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.getAllRequests = async (req, res) => {
    try {
        const filter = {};

        if (PRIVILEGED_ROLES.includes(req.user.role)) {
            if (req.query.issued_by) {
                filter.issued_by = req.query.issued_by;
            }
        } else {
            filter.issued_by = req.user.id;
        }

        if (req.query.progress) {
            filter.progress = req.query.progress;
        }

        const requests = await Request.find(filter).sort({ createdAt: -1 });
        const sanitizedRequests = requests.map(sanitizeRequest);

        res.status(200).json(sanitizedRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Retrieves a single service request by its ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.getRequestById = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const isOwner = request.issued_by.toString() === req.user.id.toString();
        const isPrivileged = PRIVILEGED_ROLES.includes(req.user.role);

        if (!isOwner && !isPrivileged) {
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to view this request.'
            });
        }

        const sanitizedRequest = sanitizeRequest(request);
        res.status(200).json(sanitizedRequest);
        console.log(request.__v);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Retrieves all requests for a specific sender ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.getRequestsBySenderId = async (req, res) => {
    try {
        const { senderId } = req.params;
        const authenticatedUser = req.user;

        const isPrivileged = PRIVILEGED_ROLES.includes(authenticatedUser.role);
        const isOwner = authenticatedUser.id === senderId;

        if (!isPrivileged && !isOwner) {
            return res.status(403).json({ message: 'Forbidden: You can only view your own requests.' });
        }

        const filter = { issued_by: senderId };
        if (req.query.progress) {
            filter.progress = req.query.progress;
        }

        const requests = await Request.find(filter).sort({ createdAt: -1 });

        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: 'No requests found for this sender.' });
        }

        const sanitizedRequests = requests.map(sanitizeRequest);
        res.status(200).json(sanitizedRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Updates an existing service request.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
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
            updateData = req.body;
        } else if (isOwner) {
            if (requestToUpdate.progress !== 'Pending') {
                return res.status(403).json({
                    message: 'Forbidden: Cannot update a request that is already in progress.'
                });
            }
            if (req.body.request_title) updateData.request_title = req.body.request_title;
            if (req.body.description) updateData.description = req.body.description;
            if (req.body.attachment) updateData.attachment = req.body.attachment;
        } else {
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to update this request.'
            });
        }

        const updatedRequest = await Request.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        const reqObject = sanitizeRequest(updatedRequest);
        res.status(200).json(reqObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Deletes a service request by its ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
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
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to delete this request.'
            });
        }

        if (isOwner && !isPrivileged && requestToDelete.progress !== 'Pending') {
            return res.status(403).json({
                message: 'Forbidden: Cannot delete a request that is already in progress.'
            });
        }

        await Request.findByIdAndDelete(id);

        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};