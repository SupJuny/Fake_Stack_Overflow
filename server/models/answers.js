const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const answerSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    ans_by: {
        type: String,
        required: true
    },
    ans_date_time: {
        type: Date,
        default: new Date()
    },
    votes: {
        type: Number,
        default: 0
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId]
    }
});

answerSchema.virtual("url").get(function () {
    return "posts/answer/" + this._id;
});

module.exports = mongoose.model("Answer", answerSchema);
