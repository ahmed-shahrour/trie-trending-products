const mongoose = require('mongoose');

// This is where we connect to the database
const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

module.exports = connectDatabase;
