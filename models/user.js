const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String, unique: true},
    status: {type: String, default: 'Active'}
    
});

var user = mongoose.model('user', UserSchema);

module.exports = user;