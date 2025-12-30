require('dotenv').config();
require("./db/mongoose");

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

const courseRouter = require("./routes/course");
const divisionalDataRouter = require("./routes/divisionalData");
const referenceRouter = require("./routes/reference");

let corsOptions = {
    origin: [
        'https://timetable.viaplanner.ca',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8080',
        'http://127.0.0.1:3000'
    ],
    optionsSuccessStatus: 200
}

const app = express();

app.use(cors(corsOptions));
app.set('trust proxy', 1);
app.use(express.json());

app.use(courseRouter);
app.use(divisionalDataRouter);
app.use(referenceRouter);

const port = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // Limit each IP to 100 requests per 10 minutes (6 seconds / request)
});

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`);
        else
            next();
    });
}

app.get("/", cors(), (req, res) => {
    res.redirect('https://docs.viaplanner.ca/course-api/');
});

app.get('/health', cors(), (req, res) => {
    res.json({
        status: 'OK',
        message: 'VIA Course API is running',
        timestamp: new Date().toISOString(),
        version: '1.1.1'
    })
})

app.get("/status/timetable", [cors(), limiter], async (req, res) => {
    try {
        await axios.get("https://timetable.viaplanner.ca");
        res.send({
            schemaVersion: 1,
            label: "Status",
            message: "up",
            color: "success"
        });
    } catch (e) {
        res.send({
            schemaVersion: 1,
            label: "Status",
            message: "down",
            color: "critical",
        });
    }
});

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})