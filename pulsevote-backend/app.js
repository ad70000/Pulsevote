const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
      ],
      imgSrc: [
        "'self'",
        "data:",
      ],
      connectSrc: [
        "'self'",
        "http://localhost:5001",
        "https://localhost:5001",
      ],
    },
  })
);

app.use(express.json());

app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
  })
);

app.get('/', (req, res) => {
res.send('PulseVote API running!');
});

app.get('/test', (req, res) => {
    res.json({
    message: 'This is a test endpoint from PulseVote API!',
    status: 'success',
    timestamp: new Date()
    });
});



app.use("/api/auth", authRoutes);




const { protect } = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}! You have accessed protected data.`,
    timestamp: new Date()
  });
});

module.exports = app;
