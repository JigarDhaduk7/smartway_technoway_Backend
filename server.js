const app = require('./src/app');
require('dotenv').config();

const connectDB = require('./src/config/db');

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});