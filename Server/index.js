const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
const SECRET_KEY = "ssosecretkey";

// Users data
const sampleUsers = {
  "user1@example.com": {
    password: bcrypt.hashSync("password123", 10),
    name: "User One",
  },
  "user2@example.com": {
    password: bcrypt.hashSync("password456", 10),
    name: "User Two",
  },
};

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "http://localhost:4001",
      "http://localhost:4002",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

// Helper functions
const generateToken = (email) =>
  jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
const verifyToken = (token) => jwt.verify(token, SECRET_KEY);

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = sampleUsers[email];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(email);
  res.cookie("sso_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Login successful", name: user.name });
});

// Verify User
app.get("/auth/user", (req, res) => {
  const token = req.cookies.sso_token;

  if (!token) {
    return res.status(401).json({ error: "JWT token is missing" });
  }

  try {
    const decoded = verifyToken(token);
    console.log(decoded);

    res.status(200).json({
      email: decoded.email,
      name: sampleUsers[decoded.email].name,
    });
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("sso_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Start server
app.listen(3000, () => {
  console.log("SSO Server running on http://localhost:3000");
});
