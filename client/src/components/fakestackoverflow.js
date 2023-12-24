import React from 'react';
import axios from 'axios';
import WelcomePage from './WelcomePage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import MainQuestionPage from './MainQuestionPage';
import Banner from './Banner';
import TagPage from './TagPage';
import AskQuestion from "./AskQuestion";
import QuestionContent from './QuestionContent';
import AnswerQuestion from './AnswerQuestion';
import HelperFunction from './HelperFunctions.js';
import UserProfile from './UserProfile.js';
var help = new HelperFunction();

export default class FakeStackOverflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { questions: [], answers: [], tags: [], users: [], comments: [] },
      temp_data: { questions: [], answers: [], tags: [], users: [], comments: [] },
      page_num: 100,
      nq_title: "",
      nq_text: "",
      nq_tags: "",
      nq_summary: "",
      quest_id: "",
      tag_id: "",
      ans_text: "",
      ans_name: "",
      searched: 0,
      sort_by_tag: false,
      q_btn_color: "lightgray",
      t_btn_color: "transparent",
      u_btn_color: "transparent",
      is_view_inc: false,
      nu_name: "",
      nu_pw: "",
      nu_account: "",
      nu_pw_verify: "",
      nu_reputation: 0,
      vote_target: ""
    }
  }

  async componentDidMount() {
    console.log("get in component mount function");

    await axios.get("http://localhost:8000/")
      .then((res) => {
        this.setState({
          data: res.data,
          temp_data: res.data
        });
        console.log("Renew Data");
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

    console.log(this.state.data);
    console.log("Component Mount function passed");
  }

  // ################# Display pages section ####################
  display_welcome_page = () => {
    this.setState(() => ({
      page_num: 100
    }))
  }

  display_register_page = () => {
    this.setState(() => ({
      page_num: 99
    }))
  }

  display_login_page = () => {
    this.setState(() => ({
      page_num: 98
    }))
  }

  display_main_page = (tid, is_tag) => {
    this.setState(() => ({
      page_num: 0,
      searched: 0,
      sort_by_tag: is_tag,
      tag_id: tid,
      q_btn_color: "lightgray",
      t_btn_color: "transparent",
      u_btn_color: "transparent",
    }));
    this.componentDidMount();
  }

  display_tag_page = (id) => {
    this.setState(() => ({
      page_num: 1,
      tag_id: id,
      q_btn_color: "transparent",
      t_btn_color: "lightgray",
      u_btn_color: "transparent",
    }));
  }

  display_ask_question = () => {
    this.setState(() => ({
      page_num: 2
    }))
  }

  display_question_content = async (id) => {
    if (this.state.page_num === 0) await this.increase_view(id);

    // this.state.data.questions.forEach(q => {
    //   if (q._id === id) console.log(q);
    // });

    this.setState(() => ({
      page_num: 3,
      quest_id: id,
      is_view_inc: true
    }))
  }

  display_answer_question = () => {
    this.setState(() => ({
      page_num: 4
    }))
  }

  display_searched_page = () => {
    this.setState(() => ({
      page_num: 0,
      searched: 1,
      q_btn_color: "transparent",
      t_btn_color: "transparent",
      u_btn_color: "transparent",
    }))
  }

  display_user_page = () => {
    this.setState(() => ({
      page_num: 5,
      q_btn_color: "transparent",
      t_btn_color: "transparent",
      u_btn_color: "lightgray",
    }))
  }

  // ################# User handler section ####################
  handle_name = (name) => {
    this.setState({ nu_name: name })
  }

  handle_account = (account) => {
    this.setState({ nu_account: account })
  }

  handle_pw = (pw) => {
    this.setState({ nu_pw: pw })
  }

  handle_verify = (verify) => {
    this.setState({ nu_pw_verify: verify })
  }

  handle_user_empty = () => {
    this.setState({
      nu_name: "",
      nu_account: "",
      nu_pw: "",
      nu_pw_verify: "",
      nu_reputation: 0
    })
  }

  // ################ New Question handler section ####################
  handle_title = (title) => {
    this.setState({ nq_title: title })
  }

  handle_text = (text) => {
    this.setState({ nq_text: text })
  }

  handle_tag = (tag) => {
    this.setState({ nq_tags: tag })
  }

  handle_user = (user) => {
    this.setState({ nq_user: user })
  }

  handle_summary = (summary) => {
    this.setState({ nq_summary: summary })
  }

  // ################# Answer handler section ####################
  handle_ans_text = (text) => {
    this.setState({ ans_text: text })
  }

  handle_ans_name = (name) => {
    this.setState({ ans_name: name })
  }

  // ################# Vote handler section ####################
  handle_vote = (vote) => {
    this.setState({ vote_target: vote })
  }

  // ################ Add to Model section ####################

  // add new user function
  evaluate_new_user = async () => {
    let err = [];
    console.log(this.state);
    // check filling
    if (this.state.nu_account.length === 0 || this.state.nu_name.length === 0 || this.state.nu_pw.length === 0 || this.state.nu_pw_verify.length === 0) {
      err.push("Please fill every information\n");
      alert("Please fill every information\n");
    }

    // double check pw
    if (this.state.nu_pw !== this.state.nu_pw_verify || this.state.nu_pw.length !== this.state.nu_pw_verify.length) {
      err.push("Passwords are not same. Please type again\n");
      alert("Passwords are not same. Please type again\n");
    }

    // check pw containing email id and username
    let account_id = this.state.nu_account.substring(0, this.state.nu_account.indexOf("@"));

    if (this.state.nu_pw.match(account_id) || this.state.nu_pw.match(this.state.nu_name)) {
      err.push("Password can't contain email ID or Username\n");
      alert("Password can't contain email ID or Username\n");
    }

    let user_for_register = this.state.data.users;
    var count = 0;
    user_for_register.forEach(() => {
      for (let i = 0; i < user_for_register.length; i++) {
        if (this.state.nu_account === user_for_register[i].email
          || this.state.nu_name === user_for_register[i].name) {
          count += 1;
        }
      }
    })
    if (count !== 0) {
      err.push("It is duplicated account. Use another email please\n");
      alert("The username or email is already registered. Try another user id or email please\n");
    }

    // send err messages
    if (err.length !== 0) {
      // this.handle_error(err);
      console.log(err);
    }
    else {
      axios.post("http://localhost:8000/new_user/",
        {
          name: this.state.nu_name,
          email: this.state.nu_account,
          password: this.state.nu_pw,
          reputation: 0
        }).then(res => {
          console.log(res);
          this.componentDidMount();           // need to check
          this.setState({ page_num: 98 })
        });
      // this.handle_error("");
    }
  }

  // login function
  evaluate_user_login = async () => {
    let err = [];

    // console.log("input id: " + this.state.nu_account);
    // console.log("input pw: " + this.state.nu_pw);
    axios.post("http://localhost:8000/login/",
      {
        email: this.state.nu_account,
        password: this.state.nu_pw
      }).then(res => {
        console.log("get into login");
        if (res.data === "notMatched") {
          err.push("Account doesn't exist\n");
          alert("Account doesn't exist\n");
          // this.handle_error(err);
        }
        else if (res.data === "pwNotMatched") {
          err.push("Password is not matched with account");
          alert("Password is not matched with account");
          // this.handle_error(err);
        }
        else {
          console.log("login start");
          this.setState({ nu_name: res.data.name });
          this.setState({ nu_reputation: res.data.reputation });
          this.setState({ page_num: 0 });
          // this.handle_error("");
          console.log("login end");
        }
      });
  }

  // increase view of question
  increase_view = async (id) => {
    await axios.post("http://localhost:8000/view", {
      q_id: id
    })

    console.log("Increase_view_post passed");

    await this.componentDidMount();

    // this.state.data.questions.forEach(q => {
    //   if (q._id === id) console.log(q);
    // });
  }

  // increase vote of question
  increase_vote = async (id) => {
    console.log("Increase_vote_before pass");

    if (this.state.nu_name === "") alert("Login is required for voting");
    else {
      await axios.post("http://localhost:8000/vote_inc", {
        email: this.state.nu_account,
        q_id: id
      }).then(res => {

        this.componentDidMount();
        console.log("Increase_vote passed");
        return res.votes;
      });
    }
  }

  // decrease vote of question
  decrease_vote = async (id) => {
    if (this.state.nu_name === "") alert("Login is required for voting");
    else {
      await axios.post("http://localhost:8000/vote_dec", {
        email: this.state.nu_account,
        q_id: id
      }).then(res => {

        this.componentDidMount();
        console.log("Decrease_vote passed");
        return res.votes;
      });
    }
  }

  // increase vote of answer
  increase_vote_answer = async (id) => {
    console.log("Increase_vote_before pass");

    if (this.state.nu_name === "") alert("Login is required for voting");
    else {
      await axios.post("http://localhost:8000/vote_ans_inc", {
        email: this.state.nu_account,
        a_id: id
      }).then(res => {
        this.componentDidMount();
        console.log("Increase_vote passed");
        return res.votes;
      });
    }
  }
  // decrease vote of answer
  decrease_vote_answer = async (id) => {
    if (this.state.nu_name === "") alert("Login is required for voting");
    else {
      await axios.post("http://localhost:8000/vote_ans_dec", {
        email: this.state.nu_account,
        a_id: id
      }).then(res => {
        this.componentDidMount();
        console.log("Decrease_vote passed");
        return res.votes;
      });
    }
  }

  // delete question
  delete_question = async (id) => {
    await axios.post("http://localhost:8000/delete_question", {
      q_id: id
    }).then((res) => {
      if (res.data === "deleted") {
        alert("Question deleted");
        console.log("lets display user page");
        this.componentDidMount();
        this.display_user_page();
      }
      else {
        alert("Failed to delete question")
      }
    })
  }

  // add new question
  add_new_question = () => {
    let new_title = this.state.nq_title;
    let new_text = help.handling_hyperlinks(this.state.nq_text);
    let new_tags = this.state.nq_tags;
    let new_summary = this.state.nq_summary;
    let new_username = this.state.nu_name;

    let title_empty_check = true;
    let text_empty_check = true;
    // let username_empty_check = true;
    let summary_empty_check = true;
    let new_tag_length_check = true;

    console.log("post question function");
    console.log("text is", new_text);

    for (let i = 0; i < new_title.length; i++) {
      if (new_title[i] !== " ") title_empty_check = false;
    }

    for (let i = 0; i < new_text.length; i++) {
      if (new_text[i] !== " ") text_empty_check = false;
    }

    for (let i = 0; i < new_summary.length; i++) {
      if (new_summary[i] !== " ") summary_empty_check = false;
    }

    new_tags = new_tags.toLowerCase();

    for (let i = 0; i < new_tags.length; i++)  // deleting unnecessary characters
    {
      new_tags = new_tags.replaceAll("  ", " ");

      if ((new_tags[i] >= 'a' && new_tags[i] <= 'z') || (new_tags[i] === '-') || (new_tags[i] === ' ') || (new_tags[i] >= '0' && new_tags[i] <= '9')) {
        continue;
      }
      else {
        new_tags = new_tags.slice(0, i) + new_tags.slice(i + 1);
        i--;
      }
    }

    if (new_tags[new_tags.length - 1] === ' ') new_tags = new_tags.slice(0, new_tags.length - 1);

    const tags_arr = new_tags.split(" ");

    for (let i = 0; i < tags_arr.length; i++) {
      if (tags_arr[i].length > 10) new_tag_length_check = false;
      console.log(tags_arr[i]);
    }

    if (tags_arr.length > 5) alert("Tags should be less or equal than 5.");
    else if (!new_tag_length_check) alert("The tag cannot be more than 10 characters.")
    else if (new_title.length > 50) alert("The title should not be more than 50 characters");
    else if (new_summary.length > 140) alert("The summary should not be more than 140 characters");
    else if (title_empty_check) alert("The title should not be empty");
    else if (text_empty_check) alert("The question text should not be empty");
    else if (summary_empty_check) alert("The summary should not be empty");
    else if (new_username === "") alert("Guest can not post question")
    else if (new_text === "hyperlink_empty") alert("Insert the hyperlink inside of parentheses");
    else if (new_text === "invalid_hyperlink") alert("Hyperlink should start with http:// or https://");
    else {
      axios.post("http://localhost:8000/add_new_question/", {
        question: {
          title: new_title,
          text: new_text,
          tags: [],
          asked_by: new_username,
          ask_date_time: new Date(),
          summary: new_summary,
        }
      }).then((res) => {
        for (let i = 0; i < tags_arr.length; i++) {
          axios.post("http://localhost:8000/new_tag_eval/", {
            tag_name: tags_arr[i],
            q_id: res.data
          })
        }
        axios.post("http://localhost:8000/add_user_question/", {
          email: this.state.nu_account,
          q_id: res.data
        });
        this.componentDidMount();
        this.display_main_page();

      });
    }
  }

  // post new answer function
  add_new_answer = () => {
    let target_quest_id = this.state.quest_id;
    let new_ans_text = help.handling_hyperlinks(this.state.ans_text);
    let new_ans_username = this.state.nu_name;

    console.log(new_ans_text);
    console.log(new_ans_username);

    let username_empty_check = true;
    let text_empty_check = true;

    for (let i = 0; i < new_ans_text.length; i++) {
      if (new_ans_text[i] !== " ") text_empty_check = false;
    }

    for (let i = 0; i < new_ans_username.length; i++) {
      if (new_ans_username[i] !== " ") username_empty_check = false;
    }

    if (text_empty_check) alert("The answer text should not be empty");
    else if (username_empty_check) alert("The username should not be empty");
    else if (new_ans_text === "hyperlink_empty") alert("Insert the hyperlink inside of parentheses");
    else if (new_ans_text === "invalid_hyperlink") alert("Hyperlink should start with http:// or https://");
    else {
      console.log("In right condition for adding question");
      axios.post("http://localhost:8000/add_new_answer/", {
        text: new_ans_text,
        ans_by: new_ans_username,
        ans_date_time: new Date()
      }).then((res) => {
        console.log("Then Passed");
        axios.post("http://localhost:8000/update_quest_answer/", {
          email: this.state.nu_account,
          ans_id: res.data,
          q_id: target_quest_id
        });
        console.log("Answer ID");
        console.log(res.data);
        console.log(target_quest_id);
      }).then(() => {
        console.log("just before go back to content page");
      });
      this.componentDidMount();
      this.display_question_content(target_quest_id);
    }
  }

  // ################ search bar function ####################
  searching_by_input = (inpt) => {
    console.log("get in search function in fakestackoverflow");
    // let search_input = this.state.srch_input;
    console.log(inpt);
    // console.log(search_input);
    let search_input = inpt
    let words = search_input.toLowerCase();
    let searched_questions = [];
    let word_questions = [];
    let tag_questions = [];

    let split_by_space = words.split(" ");

    for (let i = 0; i < split_by_space.length; i++) {
      if (split_by_space[i] === '') continue;
      else if (split_by_space[i].includes('[') && split_by_space[i].includes(']')) {
        let is_last_word_tag = true;
        let idx = 0;
        let tmp_str = "";
        while (idx < split_by_space[i].length) {
          if (split_by_space[i][idx] !== '[') {
            tmp_str = "";
            while (split_by_space[i][idx] !== '[' && idx < split_by_space[i].length) {
              tmp_str += split_by_space[i][idx];
              idx++;
            }
            word_questions.push(tmp_str);
          }
          else {
            tmp_str = "";
            idx++;
            while (split_by_space[i][idx] !== ']') {
              tmp_str += split_by_space[i][idx];
              if (idx === split_by_space[i].length - 1) {
                tmp_str = '[' + tmp_str;
                word_questions.push(tmp_str);
                is_last_word_tag = false;
                break;
              }
              idx++;
            }
            idx++;
            if (is_last_word_tag) tag_questions.push(tmp_str);
          }
        }
      }
      else {
        word_questions.push(split_by_space[i]);
      }
    }

    console.log(word_questions);
    console.log(tag_questions);
    var tag_id_set = [];

    this.state.data.tags.forEach(d => {
      tag_questions.forEach(l => {
        if (d.name === l) tag_id_set.push(d._id);
      })
    })

    console.log("tag id set is " + tag_id_set);

    this.state.data.questions.forEach(o => {
      let q_title = o.title.toLowerCase();
      let q_text = o.text.toLowerCase();
      let q_tag = o.tags;


      word_questions.forEach(w => {
        if (q_title.includes(w) || q_text.includes(w)) searched_questions.push(o);
      })

      tag_id_set.forEach(t => {
        if (q_tag.includes(t)) searched_questions.push(o);
      })
    });

    console.log(searched_questions);

    let sorted_questions = [];

    searched_questions.forEach(element => {
      if (!sorted_questions.includes(element)) sorted_questions.push(element);
    });

    this.setState({ temp_data: { questions: help.newest_sort(sorted_questions) } })
    this.display_searched_page();
  }


  // ################ page rendering section ####################
  render() {
    console.log("Renderrr");
    let main_page = null;
    let banner = null;
    console.log(this.state.data);
    console.log(this.state.nu_name);

    if (this.state.page_num === 100) {
      main_page = <WelcomePage main_question_page={this.display_main_page} register={this.display_register_page} user_login={this.display_login_page}
        user_empty={this.handle_user_empty} />
    }

    // register page
    else if (this.state.page_num === 99) {
      main_page = <RegisterPage name_handler={this.handle_name} account_handler={this.handle_account} pw_handler={this.handle_pw} verify_handler={this.handle_verify}
        add_user={this.evaluate_new_user} />       // after evaluate, success -> display login page
    }

    // login page
    else if (this.state.page_num === 98) {
      main_page = <LoginPage main_question_page={this.display_main_page} account_handler={this.handle_account} pw_handler={this.handle_pw}
        try_login={this.evaluate_user_login} />
    }

    // main page
    else if (this.state.page_num === 0) {
      // banner = <Banner main_question_page={this.display_main_page} main_tag_page={this.display_tag_page} search={this.searching_by_input} input={this.state.srch_input} />    //search handle function need to add
      main_page = <MainQuestionPage
        main_tag_page={this.display_tag_page} main_user_page={this.display_user_page} search_handler={this.searching_by_input} input={this.state.srch_input} q_color={this.state.q_btn_color} t_color={this.state.t_btn_color}
        u_color={this.state.u_btn_color} tid={this.state.tag_id} tag_sort={this.state.sort_by_tag} data={this.state.data} temp_data={this.state.temp_data}
        login_page={this.display_login_page} welcome_page={this.display_welcome_page}
        username={this.state.nu_name}
        ask_question={this.display_ask_question} question_content={this.display_question_content} search_status={this.state.searched} />
    }
    // tag page
    else if (this.state.page_num === 1) {
      banner = <Banner main_question_page={this.display_main_page} main_tag_page={this.display_tag_page} main_user_page={this.display_user_page} search_handler={this.searching_by_input}
        q_color={this.state.q_btn_color} t_color={this.state.t_btn_color} u_color={this.state.u_btn_color}
        login_page={this.display_login_page} welcome_page={this.display_welcome_page}
        username={this.state.nu_name} />
      main_page = <TagPage main_question_page={this.display_main_page} ask_question={this.display_ask_question} data={this.state.data}
        username={this.state.nu_name} />
    }

    // ask question page
    else if (this.state.page_num === 2) {
      banner = <Banner main_question_page={this.display_main_page} main_tag_page={this.display_tag_page} main_user_page={this.display_user_page} main_pages={this.main_page} search_handler={this.searching_by_input}
        login_page={this.display_login_page} welcome_page={this.display_welcome_page}
        username={this.state.nu_name} />
      main_page = <AskQuestion main_question_page={this.display_main_page} title_handler={this.handle_title} text_handler={this.handle_text}
        tag_handler={this.handle_tag} summary_handler={this.handle_summary} title={this.state.nq_title} text={this.state.nq_text} tags={this.state.nq_tags}
        summary={this.state.nq_summary} add_question={this.add_new_question} />
    }

    // question content page
    else if (this.state.page_num === 3) {
      // console.log("question id: "+this.state.quest_id);
      banner = <Banner main_question_page={this.display_main_page} main_tag_page={this.display_tag_page} main_user_page={this.display_user_page} main_pages={this.main_page} search_handler={this.searching_by_input}
        login_page={this.display_login_page} welcome_page={this.display_welcome_page}
        username={this.state.nu_name} />
      main_page = <QuestionContent ident={this.state.quest_id} data={this.state.data} ask_question={this.display_ask_question}
        answer_question={this.display_answer_question} up_vote={this.increase_vote} down_vote={this.decrease_vote} target_vote={this.handle_vote} vote={this.state.vote_target}
        up_vote_answer={this.increase_vote_answer} down_vote_answer={this.decrease_vote_answer}
        username={this.state.nu_name} />
    }

    // Answer the question page
    else if (this.state.page_num === 4) {
      banner = <Banner main_question_page={this.display_main_page} main_tag_page={this.display_tag_page} main_user_page={this.display_user_page} main_pages={this.main_page} search_handler={this.searching_by_input}
        login_page={this.display_login_page} welcome_page={this.display_welcome_page}
        username={this.state.nu_name} />
      main_page = <AnswerQuestion text={this.state.ans_text} name={this.state.ans_name} answer_text_handler={this.handle_ans_text} post_answer={this.add_new_answer}
        answer_name_handler={this.handle_ans_name} />
    }

    // User profile page
    else if (this.state.page_num === 5) {
      banner = <Banner main_question_page={this.display_main_page} main_tag_page={this.display_tag_page} main_user_page={this.display_user_page} main_pages={this.main_page} search_handler={this.searching_by_input}
        login_page={this.display_login_page} welcome_page={this.display_welcome_page} q_color={this.state.q_btn_color} t_color={this.state.t_btn_color} u_color={this.state.u_btn_color}
        username={this.state.nu_name} />
      main_page = <UserProfile name={this.state.nu_name} ask_question={this.display_ask_question} question_content={this.display_question_content}
        question_delete={this.delete_question} data={this.state.data} />
    }

    return (
      <div>
        {banner}
        {main_page}
      </div>
    );
  }
}
