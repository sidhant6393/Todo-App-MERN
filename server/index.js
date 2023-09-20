const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cron = require('node-cron');
const Todo = require('./models/todoItems');
const moment = require('moment');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;
app.use(cors());

const TodoItemRoute = require('./routes/todoItems');
mongoose.connect(process.env.DB_CONNECT)
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.log(`DB Connection Failed`);
    console.log(err);
    process.exit(1);
  });

app.use('/', TodoItemRoute);
//// Define the duration (in minutes) after which completed items should be deleted
const completionDuration = 0;
// Define the cron job to delete completed to-do items every 5 seconds
// Define the cron job to delete selected items after 15 seconds
cron.schedule('*/5 * * * * *', async () => { // This runs every 15 seconds
  try {
    // Calculate the timestamp that represents the current time minus 15 seconds
    const cutoffTimestamp = moment().subtract(15, 'seconds').toDate();

    // Delete selected items that were selected more than 15 seconds ago
    await Todo.deleteMany({
      selected: true,
      selectedAt: { $lt: cutoffTimestamp },
    });

    console.log('Deleted selected to-do items.');
  } catch (error) {
    console.error('Error deleting selected to-do items:', error);
  }
});


// No need to call cron.start(); it starts automatically when you define a schedule.

app.listen(PORT, () => console.log("Server connected"));
