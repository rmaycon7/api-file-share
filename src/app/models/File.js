const mongoose = require("../../database");

const bcrypt = require("bcryptjs");

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    required: true
  }
});

const File = mongoose.model("File", FileSchema);

module.exports = File;
