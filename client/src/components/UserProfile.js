import React from "react";
import HelperFunction from './HelperFunctions.js';
var help = new HelperFunction();

export default class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_idx: 0
        }
        this.display_question_content = this.display_question_content.bind(this);
        this.action_delete_question = this.action_delete_question.bind(this);
    }

    display_question_content(id) {
        this.props.question_content(id);
    }

    action_delete_question(id) {
        this.props.question_delete(id);
    }

    show_questions_template(question_row, counter) {
        return (
            <div id="main_questions_load">
                {this.show_five_questions(question_row, this.state.cur_idx)}
                <button id='prev_button' className='sort_buttons' onClick={() => {
                    if (this.state.cur_idx > 0) this.setState({ cur_idx: this.state.cur_idx - 1 });
                }}>Prev</button>
                <button id='next_button' className='sort_buttons' onClick={() => {
                    if ((this.state.cur_idx + 1) < (counter / 5)) this.setState({ cur_idx: this.state.cur_idx + 1 });
                }}>Next</button>
            </div>
        )
    }

    show_five_questions = (question_row, current_idx) => {
        let showing_row = [];
        for (let i = 0; i < 5; i++) {
            if (5 * current_idx + i === question_row.length) break;
            showing_row.push(question_row[5 * current_idx + i]);
        }
        return showing_row;
    }

    make_row = (quest, tags_data, question_row) => {
        var tag_row = [];
        for (let j = 0; j < quest.tags.length; j++) {
            for (let i = 0; i < tags_data.length; i++) {
                if (quest.tags[j] === tags_data[i]._id) {
                    tag_row.push(<p className='quest_tag' key={tags_data[i]._id}>{tags_data[i].name}</p>);
                }
            }
        }

        question_row.push(
            <div id="main_questions" key={quest._id}>
                <div id="section1">
                    <p id="quest_num_ans">{quest.answers.length} answers</p>
                    <p id="quest_num_view">{quest.views} views</p>
                    <p id="quest_num_vote">{quest.votes} votes</p>
                </div>

                <div id="section2">
                    <p className="quest_title" onClick={() => { this.display_question_content(quest._id) }}>{quest.title}</p>
                    <div id="quest_tags">
                        {tag_row}
                    </div>
                </div>

                <div id="section3">
                    <p id="quest_user">{quest.asked_by} </p>
                    <p id="quest_asked"> asked</p>
                    <p id="quest_time">{help.time_log(quest.ask_date_time)}</p>
                    <button id="delete_question" onClick={() => { 
                        const confirm_box = window.confirm("Do you want to delete this question?")
                        if (confirm_box) {
                            this.action_delete_question(quest._id);
                        }
                        else {
                            alert("Delete question canceled");
                        } }}>Delete</button>
                </div>
            </div>
        )
    }

    render() {
        var question_row = [];
        var tags_data = this.props.data.tags;
        var user_set = this.props.data.users;
        let counter = 0;
        var username = this.props.name;

        var index = 0;
        for (let j = 0; j < user_set.length; j++) {
            if (user_set[j].name === username)
                index = j;
        }
        let target = user_set[index];

        if (username === "") {
            return (
                <div id='main_right'>
                    <div>
                        <h2 id='not_registered_user'>Please login to view user profile</h2>
                        <button className='askQ' id='askQ_user' onClick={() => {
                            alert("You should login for asking the question");
                        }}>Ask Question</button>
                    </div>
                </div>
            );
        }
        else if (username === "admin") {
            this.props.data.questions.forEach((quest) => {
                if (target.questions.includes(quest._id)) {
                    this.make_row(quest, tags_data, question_row);
                    counter++;
                }
            });

            return (
                <div id='main_right'>
                    <div id="user_info">
                        <h2>Hello, {username}</h2>
                        <button className='askQ' id='askQ_user' onClick={() => {
                                this.props.ask_question();
                        }}>Ask Question</button>

                        <h3>You are a member since {help.time_log(target.joined_date)}</h3>
                        <h3>Reputation: {target.reputation}</h3>
                    </div>
                    
                    <div>
                        <button id='see_all_user' onClick={() => {alert("We couldn't make it. Sorry")}}>See All User Profile</button>
                    </div>
                    <div id='user_page_under_dash'></div>
                    {this.show_questions_template(question_row, counter)}
                </div>
            );
        }
        else {
            this.props.data.questions.forEach((quest) => {
                if (target.questions.includes(quest._id)) {
                    this.make_row(quest, tags_data, question_row);
                    counter++;
                }
            });

            return (
                <div id='main_right'>
                    <div id="user_info">
                        <h2>Hello, {username}</h2>
                        <button className='askQ' id='askQ_user' onClick={() => {
                                this.props.ask_question();
                        }}>Ask Question</button>

                        <h3>You are a member since {help.time_log(target.joined_date)}</h3>
                        <h3>Reputation: {target.reputation}</h3>
                    </div>
                    <div id='user_page_under_dash'></div>
                    {this.show_questions_template(question_row, counter)}
                </div>
            );
        }
    }
}