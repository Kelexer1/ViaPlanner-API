const express = require('express');
const DivisionalLegend = require('../models/divisionalLegend');
const DivisionalEnrolmentIndicator = require('../models/divisionalEnrolmentIndicator');
const rateLimit = require('express-rate-limit');
const router = new express.Router();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // Limit each IP to 100 requests per 10 minutes (6 seconds / request)
});

router.get('/divisionalLegends', [limiter], async (req, res) => {
    try {
        const legends = await DivisionalLegend.find({});
        res.status(200).json({
            success: true,
            count: legends.length,
            data: legends
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching divisional legends',
            error: error.message
        });
    }
});

router.get('/divisionalEnrolmentIndicators', [limiter], async (req, res) => {
    try {
        const indicators = await DivisionalEnrolmentIndicator.find({});
        res.status(200).json({
            success: true,
            count: indicators.length,
            data: indicators
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching divisional enrolment indicators',
            error: error.message
        });
    }
});

module.exports = router;