const mongoose = require("mongoose")
const Schema = mongoose.Schema

const courseSchema = new Schema({
    sessionId: {
        $type: String,
        required: true
    },
    name: {
        $type: String,
        required: true
    },
    code: {
        $type: String,
        required: true
    },
    sectionCode: String,
    campus: String,
    sessions: [String],
    sections: [{
        name: String,
        type: String,
        sectionNumber: String,
        meetingTimes: [{
            start: Number,
            end: Number,
            building: {
                buildingCode: String,
                buildingUrl: String
            },
            sessionCode: String,
            repetition: String,
            repetitionTime: String,
            day: Number
        }],
        instructors: [{
            firstName: String,
            lastName: String
        }],
        currentEnrolment: Number,
        maxEnrolment: Number,
        subTitle: String,
        cancelInd: String,
        waitlistInd: String,
        deliveryModes: [{
            session: String,
            mode: String
        }],
        currentWaitlist: Number,
        enrolmentInd: String,
        tbaInd: String,
        openLimitInd: String,
        notes: [{
            name: String,
            type: String,
            content: String
        }],
        enrolmentControls: [String],
        linkedMeetingSections: mongoose.Schema.Types.Mixed
    }],
    cmCourseInfo: {
        description: String,
        title: String,
        levelOfInstruction: String,
        prerequisitesText: String,
        corequisitesText: String,
        exclusionsText: String,
        recommendedPreparation: String,
        note: String,
        division: String,
        breadthRequirements: [String],
        distributionRequirements: [String],
        publicationSections: [String],
        cmPublicationSections: [{
            section: String,
            subSections: mongoose.Schema.Types.Mixed
        }]
    },
    primaryTeachMethod: String,
    faculty: {
        code: String,
        name: String
    },
    coSec: {
        code: String,
        name: String
    },
    department: {
        code: String,
        name: String
    },
    title: String,
    maxCredit: Number,
    minCredit: Number,
    breadths: [{
        org: {
            code: String,
            name: String
        },
        breadthTypes: [{
            kind: String,
            type: String,
            description: String,
            code: String
        }]
    }],
    notes: mongoose.Schema.Types.Mixed,
    cancelInd: String,
    fullyOnline: Boolean,
    primaryFull: Boolean,
    primaryWaitlistable: Boolean
}, {
    timestamps: true,
    typeKey: '$type'
})

const Course = mongoose.model("Course", courseSchema)

module.exports = Course