const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    reputation: {
        type: Number,
        default: 0
    },
    questions: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    question_vote_map: {
        type: Map,
        default: new Map()
    },
    answer_vote_map: {
        type: Map,
        default: new Map()
    },
    answers: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    joined_date: {
        type: Date,
        default: new Date()
    }
});

userSchema.virtual('url').get(function () {
    return "posts/user/" + this._id;
});

module.exports = mongoose.model('User', userSchema);
