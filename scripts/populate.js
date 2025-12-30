require('dotenv').config();
require('../src/db/mongoose.js');

const Course = require('../src/models/course.js');
const EnrolmentLegend = require('../src/models/divisionalLegend.js');
const DivisionalEnrolmentIndicator = require('../src/models/divisionalEnrolmentIndicator.js');
const DivisionalLegend = require('../src/models/divisionalLegend.js');
const Division = require('../src/models/division.js');
const SessionGroup = require('../src/models/sessionGroup.js');

const fs = require('fs');
const path = require('path');

async function populateDatabase() {
    try {
        console.log('Starting database population');

        const coursePath = path.join(__dirname, 'input', 'courses.json');
        const divisionalPath = path.join(__dirname, 'input', 'divisional.json');
        const referencePath = path.join(__dirname, 'input', 'reference.json');
        const miscPath = path.join(__dirname, 'input', 'misc.json');

        if (!fs.existsSync(coursePath) || !fs.existsSync(divisionalPath) || !fs.existsSync(referencePath) || !fs.existsSync(miscPath)) {
            throw new Error('One or more input files were not found');
        }

        const rawCourseData = fs.readFileSync(coursePath, 'utf8');
        const courseData = JSON.parse(rawCourseData);

        const rawDivisionalData = fs.readFileSync(divisionalPath, 'utf-8');
        const divisionalData = JSON.parse(rawDivisionalData);

        const rawReferenceData = fs.readFileSync(referencePath, 'utf-8');
        const referenceData = JSON.parse(rawReferenceData);

        const rawMiscData = fs.readFileSync(miscPath, 'utf-8');
        const miscData = JSON.parse(rawMiscData);

        console.log('Successfully loaded input files');

        await Course.deleteMany({});
        await EnrolmentLegend.deleteMany({});
        await DivisionalEnrolmentIndicator.deleteMany({});
        await DivisionalLegend.deleteMany({});
        await Division.deleteMany({});
        await SessionGroup.deleteMany({});

        console.log('Cleared existing data');

        // Course Data
        let allCourses = [];

        for (const [sessionId, courses] of Object.entries(courseData)) {
            if (Array.isArray(courses)) {
                const coursesWithSessionId = courses.map(course => ({
                    ...course,
                    sessionId: sessionId
                }));

                allCourses.push(...coursesWithSessionId);
                console.log(`Processed session ${sessionId}: ${courses.length} courses`)
            }
        }

        if (allCourses.length > 0) {
            await Course.insertMany(allCourses);
            console.log(`Inserted ${allCourses.length} courses across ${Object.keys(courseData).length} sessions`);
        }

        // Divisional Legends
        let allDivisionalLegends = [];

        for (const [division, content] of Object.entries(divisionalData.divisionalLegends)) {
            allDivisionalLegends.push({
                division,
                content
            });
        }

        if (allDivisionalLegends.length > 0) {
            await DivisionalLegend.insertMany(allDivisionalLegends);
            console.log(`Inserted ${allDivisionalLegends.length} divisional legends`);
        }

        // Divisional Enrolment Indicators
        let allDivisionalEnrolmentIndicators = [];

        for (const [division, codes] of Object.entries(divisionalData.divisionalEnrolmentIndicators)) {
            allDivisionalEnrolmentIndicators.push({
                division,
                codes
            });
        }

        if (allDivisionalEnrolmentIndicators.length > 0) {
            await DivisionalEnrolmentIndicator.insertMany(allDivisionalEnrolmentIndicators);
            console.log(`Inserted ${allDivisionalEnrolmentIndicators.length} divisional enrolment indicators`);
        }

        // Sessions
        let allSessions = [];

        for (const [sessionGroup, content] of Object.entries(referenceData.currentSessions)) {
            allSessions.push({
                group: sessionGroup,
                ...content
            });
        }

        if (allSessions.length > 0) {
            await SessionGroup.insertMany(allSessions);
            console.log(`Inserted ${allSessions.length} session groups`);
        }

        // Divisions
        if (referenceData.divisions.length > 0) {
            await Division.insertMany(referenceData.divisions);
            console.log(`Inserted ${referenceData.divisions.length} divisions`);
        }

        console.log('Database populated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error populating database:', error);
        process.exit(1);
    }
}

populateDatabase();