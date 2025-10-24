require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
};

start();
