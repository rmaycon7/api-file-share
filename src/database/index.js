const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost/host-file')
mongoose.connect('mongodb://localhost/files-api')
mongoose.Promise = global.Promise

module.exports = mongoose;