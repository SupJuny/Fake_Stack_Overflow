import React from "react";
import HelperFunction from './HelperFunctions.js';
var help = new HelperFunction();

export default class QuestionContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question_text: "",
            answer_text: "",
            cur_idx: 0,
            question_vote: 0
        }
    }

    show_five_contents = (question_row, current_idx) => {
        let showing_row = [];
        for (let i = 0; i < 5; i++) {
            if (5 * current_idx + i === question_row.length) break;
            showing_row.push(question_row[5 * current_idx + i]);
        }
        return showing_row;
    }

    render() {
        //console.log("get in the quest content function");
        let quest = this.props.data.questions;
        // console.log("this is props data: "+ this.props.data);
        // console.log("this is quest: "+quest);
        var index = 0;
        for (let j = 0; j < quest.length; j++) {
            if (quest[j]._id === this.props.ident)
                index = j;
        }
        let q = quest[index];
        console.log(q);
        let ans = this.props.data.answers.sort((a, b) => b.ans_date_time - a.ans_date_time);
        // ans.sort((a, b) => b.ansDate - a.ansDate);
        console.log(ans);

        ans = ans.reverse();
        console.log(ans);

        let q_page = [];
        let counter = 0;

        ans.forEach(a => {
            if (q.answers.includes(a._id)) {
                q_page.push(
                    <div id="q_content_answers" key={a._id}>
                        <div>
                            <div id="q_content_ans_vote">
                                <button onClick={() => {
                                    this.props.up_vote_answer(a._id);
                                }}>up</button>
                                <p id='q_content_ans_num_vote'>{a.votes} votes</p>
                                <button onClick={() => {
                                    this.props.down_vote_answer(a._id);
                                }}>down</button>
                            </div>
                            <p id="q_content_ans_text" dangerouslySetInnerHTML={{ __html: a.text.replace(/\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)/g, '<a href="$2" target="_blank">$1</a>') }}></p>
                            <div id="content_section">
                                <p id="q_content_ans_by">{a.ans_by}</p>
                                <p id="q_content_ans_time">answered {help.time_log(a.ans_date_time)}</p>
                            </div>
                        </div>
                    </div>
                );
                counter++;
            }
        });

        return (
            <div id='main_right'>
                <div id="question_content_page">
                    <div id="q_content_area">
                        <div id="q_section1">
                            <button onClick={() => {
                                let num = this.props.up_vote(q._id);
                                this.setState({ question_vote: num });
                            }}>up</button>
                            <h3 id='q_content_num_vote'>{q.votes} votes</h3>
                            <button onClick={() => {
                                let num = this.props.down_vote(q._id);
                                this.setState({ question_vote: num });
                            }}>down</button>
                            <br></br>
                            <br></br>
                            <h3 id='q_content_num_ans'>{counter} answers</h3>
                            <h3 id='q_content_num_view'>{q.views} views</h3>
                        </div>
                        <button className="askQ" id='askQ_cont' onClick={() => {
                            if (this.props.username === "") {
                                alert("You should login for asking the question");
                            }
                            else {
                                this.props.ask_question();
                            }
                        }}>Ask Question</button>
                        <div className="space" id="q_section2">
                            {/* <h3 id='q_content_num_view'>{q.views} views</h3> */}
                            <div id="q_content_title_and_text">
                                <h3 id='q_content_title'>{q.title}</h3>
                                <p id='q_content_text' dangerouslySetInnerHTML={{ __html: q.text.replace(/\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)/g, '<a href="$2" target="_blank">$1</a>') }}></p>
                            </div>
                            <div id="q_content_user_and_time">
                                <p id='q_content_user'>{q.asked_by}</p>
                                <p id="q_content_time">asked {help.time_log(q.ask_date_time)}</p>
                            </div>
                        </div>
                    </div>
                    <div id='q_content_answer_area'>
                        {this.show_five_contents(q_page, this.state.cur_idx)}
                        <button id='prev_button' className='sort_buttons' onClick={() => {
                            if (this.state.cur_idx > 0) this.setState({ cur_idx: this.state.cur_idx - 1 });
                        }}>Prev</button>
                        <button id='next_button' className='sort_buttons' onClick={() => {
                            if ((this.state.cur_idx + 1) < (counter / 5)) this.setState({ cur_idx: this.state.cur_idx + 1 });
                        }}>Next</button>
                    </div>
                    <button id="ans_question_btn" onClick={() => {
                        if (this.props.username === "") {
                            alert("You should login for answering the question");
                        }
                        else {
                            this.props.answer_question();
                        }
                    }}>Answer Question</button>
                </div>
            </div>
        );
    }
}