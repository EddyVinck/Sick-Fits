const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "variables.env" });
const jwt = require("jsonwebtoken");
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// Use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// TODO Use express middleware to populate current user

// Decode the  JWT so we can get the User ID on every request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  console.log(token);
  if (token) {
    // Get the userId from the JWT cookie
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }

  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  details => {
    console.log(
      `Server is now running on port http://localhost:${details.port}`
    );
  }
);
