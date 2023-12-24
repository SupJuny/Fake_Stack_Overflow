// Application server
const express = require("express");
const mongoose = require("mongoose");
const cor = require("cors");
const bcrypt = require("bcrypt");
// var session = require('express-session');
// var MongoDBStore = require('connect-mongodb-session')(session);
const saltRounds = 10;

var count = 0;

var count_for_map = 0;

const app = express();
app.use(cor());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Question = require("./models/questions");
const Tag = require("./models/tags");
const Answer = require("./models/answers");
const User = require("./models/users");
const Comment = require("./models/comments");
const users = require("./models/users");
const port = 8000;

app.listen(port, () => {
    console.log('app listening on 8000');
    mongoose.connect("mongodb://127.0.0.1:27017/fake_so");
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function () {
    console.log('DB is connected');
});

app.post("/new_user", async (req, res) => {
    let user = new User(req.body);

    console.log("signal from server.js");

    bcrypt.genSalt(saltRounds, function (err, salt) {
        console.log("did you pass here?")
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            user.password = hash;
            user.save();
        })
    });

    console.log("passed all and sending now")
    console.log(user);
    res.send(user);
})

app.post("/login", async (req, res) => {

    let account = await User.findOne({ email: req.body.email });

    // console.log("get into login post in server.js")
    // console.log("account.pw: " + account.password);

    // console.log(account);

    if (account === null) {
        res.send("notMatched")
    }
    else {
        // console.log("User found")
        let pw = account.password;
        bcrypt.compare(req.body.password, pw, function (err, result) {
            // console.log("result: "+ result)
            if (result == false) {
                // console.log("User found but pw is not matched");
                res.send("pwNotMatched");
            }
            else {
                // console.log("User found and pw is matched");
                // console.log(pw);
                res.send(account);
            }
        });
    }
})

app.get("/", async (req, res) => {
    console.log("Get in the server " + count);
    count++;
    const question = await Question.find({});
    const answer = await Answer.find({});
    const tag = await Tag.find({});
    const user = await User.find({});
    const comment = await Comment.find({});
    const all = {
        questions: question,
        answers: answer,
        tags: tag,
        users: user,
        comments: comment
    };
    if (count_for_map === 0) {
        for await (let u of User.find()) {
            question.forEach((q) => {
                u.question_vote_map.set(q._id, 0);
            })
            answer.forEach((a) => {
                u.answer_vote_map.set(a._id, 0);
            })
            console.log(u);
            await u.save();
        }
        count_for_map = 1;
    }
    // console.log(all);
    res.send(all);
});

app.post("/view", async (req, res) => {
    console.log("Came into server.js/app.post");
    let inc_view = await Question.findById(req.body.q_id);
    console.log("Came into server.js/app.post2");
    inc_view.views += 1;
    await inc_view.save();
    // console.log("Came into server.js/app.post3");
    res.send(inc_view);
})

app.post("/add_new_answer", async (req, res) => {
    // console.log(req.body);
    let new_answer = new Answer(req.body);
    // console.log(new_answer);
    await new_answer.save();
    res.send(new_answer._id);
})

app.post("/update_quest_answer", async (req, res) => {
    let target_question = await Question.findById(req.body.q_id);
    let user = await User.findOne({ email: req.body.email });
    target_question.answers.push(req.body.ans_id);
    user.answers.push(req.body.ans_id);
    console.log(target_question.views);
    // target_question.views -= 1; 
    console.log(target_question.views);
    await target_question.save();
    await user.save();

    for await (let u of User.find()) {
        u.answer_vote_map.set(req.body.ans_id, 0);
        console.log(u);
        await u.save();
    }
})

app.post("/new_tag_eval", async (req, res) => {
    let find_tags = await Tag.findOne({ name: req.body.tag_name });
    let target_q = await Question.findById(req.body.q_id);

    if (find_tags === null) {
        let new_tag = new Tag({ name: req.body.tag_name })
        await new_tag.save();
        // res.send(new_tag._id);
        target_q.tags.push(new_tag._id);
    }
    else {
        // res.send(find_tags._id);
        target_q.tags.push(find_tags._id);
    }
    await target_q.save();
    res.send(target_q._id);
})

app.post("/add_new_question", async (req, res) => {
    let new_question = new Question(req.body.question);
    await new_question.save();
    res.send(new_question._id);
})

app.post("/add_user_question", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    let question = await Question.findById(req.body.q_id);
    user.questions.push(question);
    // console.log(question._id);
    // user.question_vote_map.set(question._id, 0);
    await user.save();

    for await (let u of User.find()) {
        u.question_vote_map.set(question._id, 0);
        console.log(u);
        await u.save();
    }

})

app.post("/vote_inc", async (req, res) => {
    console.log("In vote_inc function");
    let user = await User.findOne({ email: req.body.email });
    let question = await Question.findById(req.body.q_id);
    let question_owner = await User.findOne({ name: question.asked_by });

    if (user.question_vote_map.get(question._id) === 0) {
        user.question_vote_map.set(question._id, 1);
        question.votes++;
        question_owner.reputation += 5;

    }
    else if (user.question_vote_map.get(question._id) === -1) {
        user.question_vote_map.set(question._id, 0);
        question.votes++;
        question_owner.reputation += 10;
    }

    await user.save();
    await question.save();
    await question_owner.save();
    res.send(question);
})

app.post("/vote_dec", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    let question = await Question.findById(req.body.q_id);
    let question_owner = await User.findOne({ name: question.asked_by });

    if (user.question_vote_map.get(question._id) === 1) {
        user.question_vote_map.set(question._id, 0);
        question.votes--;
        question_owner.reputation -= 5;

    }
    else if (user.question_vote_map.get(question._id) === 0) {
        user.question_vote_map.set(question._id, -1);
        question.votes--;
        question_owner.reputation -= 10;
    }

    await user.save();
    await question.save();
    await question_owner.save();
    res.send(question);
})

app.post("/vote_ans_inc", async (req, res) => {
    console.log("In vote_ans_inc function");
    let user = await User.findOne({ email: req.body.email });
    let answer = await Answer.findById(req.body.a_id);
    let answer_owner = await User.findOne({ name: answer.ans_by });

    if (user.answer_vote_map.get(answer._id) === 0) {
        user.answer_vote_map.set(answer._id, 1);
        answer.votes++;
        answer_owner.reputation += 5;

    }
    else if (user.answer_vote_map.get(answer._id) === -1) {
        user.answer_vote_map.set(answer._id, 0);
        answer.votes++;
        answer_owner.reputation += 10;
    }

    await user.save();
    await answer.save();
    await answer_owner.save();
    res.send(answer);
})

app.post("/vote_ans_dec", async (req, res) => {
    console.log("In vote_ans_dec function");
    let user = await User.findOne({ email: req.body.email });
    let answer = await Answer.findById(req.body.a_id);
    let answer_owner = await User.findOne({ name: answer.ans_by });

    if (user.answer_vote_map.get(answer._id) === 1) {
        user.answer_vote_map.set(answer._id, 0);
        answer.votes--;
        answer_owner.reputation -= 5;

    }
    else if (user.answer_vote_map.get(answer._id) === 0) {
        user.answer_vote_map.set(answer._id, -1);
        answer.votes--;
        answer_owner.reputation -= 10;
    }

    await user.save();
    await answer.save();
    await answer_owner.save();
    res.send(answer);
})

app.post("/delete_question", async (req, res) => {
    await Question.deleteOne({ _id: req.body.q_id });
    console.log("Came into server.js/app.post2");

    // console.log("Came into server.js/app.post3");
    res.send("deleted");
})
