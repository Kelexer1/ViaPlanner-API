const express = require("express")
const Course = require("../models/course")
const rateLimit = require("express-rate-limit");
const router = new express.Router();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // Limit each IP to 100 requests per 10 minutes (6 seconds / request)
});

// Search for courses by code, also filtering by division and session
router.get('/courses/:searchTerm', [limiter], async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm;
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 5, 5);

        let sessions = req.query.sessions;
        if (sessions) {
            sessions = Array.isArray(sessions) ? sessions : sessions.split(',');
        }

        let divisions = req.query.divisions;
        if (divisions) {
            divisions = Array.isArray(divisions) ? divisions : divisions.split(',');
        }

        const searchQuery = {
            $or: [
                { code: { $regex: searchTerm, $options: 'i' } },
            ]
        };

        if (sessions && sessions.length > 0) {
            searchQuery.sessionId = { $in: sessions }
        }

        if (divisions && divisions.length > 0) {
            searchQuery['faculty.code'] = {
                $in: divisions.map(division => new RegExp(division, 'i'))
            }
        }

        const courses = await Course.find(searchQuery)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ code: 1 })

        const total = await Course.countDocuments(searchQuery);

        const finalCourses = courses.slice(0, limit);

        res.send({
            courses: finalCourses,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
            searchTerm,
            pageInfo: {
                hasNextPage: page < Math.ceil(total / limit),
                hasPreviousPage: page > 1,
                itemsOnPage: finalCourses.length
            }
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router