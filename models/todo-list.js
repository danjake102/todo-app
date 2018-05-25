const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoListSchema = new Schema({
    userId: {type: String},
    todo: {type: String}
    
});

var todo = mongoose.model('todo', TodoListSchema);

module.exports = todo;