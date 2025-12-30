const express = require('express');
const SessionGroup = require('../models/sessionGroup');
const Division = require('../models/division');
const rateLimit = require('express-rate-limit');
const router = new express.Router();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // Limit each IP to 100 requests per 10 minutes (6 seconds / request)
});

router.get('/referenceData', [limiter], async (req, res) => {
    try {
        const sessions = await SessionGroup.find({});
        const divisions = await Division.find({});
        res.status(200).json({
            success: true,
            sessions,
            divisions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching session or division data',
            error: error.message
        });
    }
});

module.exports = router;