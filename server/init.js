// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require("./models/users");
let Comment = require("./models/comments");


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");
const saltRounds = 10;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


let tags = [];
let answers = [];
function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time, comments) {
  answerdetail = {
    text: text,
    votes: 0,
    comments: comments,
  };
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views, summary, comments) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
    vote: 0,
    comment: comments,
    summary: summary,
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

function commentsCreate(text, comment_by) {
  cmtdetail = {
    text: text,
    comment_by: comment_by,
    vote: 0,
  }

  let cmt = new Comment(cmtdetail);
  return cmt.save();
}

// async function encrypt(pw) {
//     const result =  await bcrypt.genSalt(saltRounds, function(err, salt) {
//         bcrypt.hash(pw, salt, function(err, hash) {
//             // console.log("hash value inside: "+ hash);
//             return hash;
//             // console.log("password" + passwords);
//         });
//     });
// }

async function userCreate(name, email, passwords, reputation, questions, joined_date) {

  let userdetail = {
    name: name,
    email: email,
    password: passwords,
    reputation: reputation,
    questions: questions
  }
  if (joined_date != false) userdetail.joined_date = joined_date;
  let user = new User(userdetail);

  console.log("before bcrypt:" + user.password);

  user.password = await new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(passwords, salt, function (err, hash) {
        if (err) reject(err)
        resolve(hash)
        // console.log("hash value inside: "+ hash);
        // user.password = hash;
        // console.log("password" + user.password);
        // user.save();
      });
    })
  });
  console.log("out password" + user.password);
  return user.save();
}

const populate = async () => {
  let t1 = await tagCreate('react');
  let t2 = await tagCreate('javascript');
  let t3 = await tagCreate('android-studio');
  let t4 = await tagCreate('shared-preferences');
  let c1 = await commentsCreate('Hi there', 'Jun');
  let c2 = await commentsCreate('kill thread', 'stark');
  let c3 = await commentsCreate('answer cmt1', 'Jun');
  let c4 = await commentsCreate('answer cmt2', 'kin');
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 'hamkalo', false, [c2, c3, c4]);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', 'azad', false, [c3]);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'abaya', false);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'alia', false, [c1, c3]);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', 'sana', false, [c3, c4]);
  let q1 = await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], 'admin', false, false, 'question1 summary', [c1, c2]);
  let q2 = await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], 'admin', false, 121, 'question2 summary', [c1]);
  await userCreate('admin', 'admin316@sbu.edu', 'unexpected', 1000, [q1, q2], false);
  if (db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if (db) db.close();
  });

console.log('processing ...');
