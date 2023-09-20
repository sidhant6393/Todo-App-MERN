const mongoose = require('mongoose');

const TodoItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  selectedAt: {
    type: Date, // Change to store the timestamp when the item was selected
    default: null,
  },
});

module.exports = mongoose.model('todo', TodoItemSchema);
