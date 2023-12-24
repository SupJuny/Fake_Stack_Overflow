import React from 'react';
import axios from 'axios';
import HelperFunction from './HelperFunctions.js';
var help = new HelperFunction();

export default class MainQuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_questions: this.props.data.questions,
            unanswer_filter_checked: false,
            tag_check: this.props.tag_sort,
            searched_page: this.props.search_status,
            q_back_color: this.props.q_color,
            t_back_color: this.props.t_color,
            u_back_color: this.props.u_color,
            search_value: '',
            cur_idx: 0
        }
        this.display_question_content = this.display_question_content.bind(this);
        this.newest_clicked = this.newest_clicked.bind(this);
        this.active_clicked = this.active_clicked.bind(this);
        this.unanswered_clicked = this.unanswered_clicked.bind(this);
        this.searching_by_input = this.searching_by_input.bind(this);
    }

    login_status_button() {
        if (this.props.username === "") {
            return (
                <button id='log' className='side_content' onClick={this.props.welcome_page}>Log In</button>
            );
        }
        else {
            return (
                <button id='log' className='side_content' onClick={this.props.welcome_page}>Log Out</button>
            )
        }
    }

    title_template() {
        return (
            <div>
                {this.login_status_button()}
                <h1 id='title'>Fake Stack Overflow</h1>
                <input
                    id="search_input"
                    type="text"
                    placeholder="Search..."
                    value={this.state.search_value}
                    onChange={this.handleSearchInputChange}
                    onKeyDown={this.searching_by_input}
                ></input>
            </div>
        )
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

    async componentDidMount() {
        await axios.get("http://localhost:8000/")
            .then((res) => {
                this.setState({
                    data_questions: help.newest_sort(res.data.questions)
                });
            })
    }

    searching_by_input(e) {
        if (e.key === "Enter") {
            this.setState({ searched_page: 1, q_back_color: "transparent", search_value: e.target.value });
            this.props.search_handler(e.target.value);
        }
    }

    handleSearchInputChange = (e) => {
        this.setState({ search_value: e.target.value });
    }

    display_question_content(id) {
        this.props.question_content(id);
    }

    newest_clicked = () => {
        let new_questions = help.newest_sort(this.props.data.questions);
        this.setState({ data_questions: new_questions, unanswer_filter_checked: false, tag_check: false, searched_page: 0, q_back_color: "lightgray", search_value: '' });
    }

    active_clicked = () => {
        let active_q_sort = help.active_sort(this.props.data.questions, this.props.data.answers);
        this.setState({ data_questions: active_q_sort, unanswer_filter_checked: false, tag_check: false, searched_page: 0, q_back_color: "lightgray", search_value: '' });
    }

    unanswered_clicked = () => {
        let newest_questions = help.newest_sort(this.props.data.questions);
        this.props.data.questions = newest_questions;
        this.setState({ unanswer_filter_checked: true, tag_check: false, searched_page: 0, q_back_color: "lightgray", search_value: '' });
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
                </div>
            </div>
        )
    }

    render() {
        var question_row = [];
        var tags_data = this.props.data.tags;
        let counter = 0;
        let q_string = 'question';

        console.log(this.state.cur_idx);

        if (this.state.searched_page === 1) {
            console.log("passed search == 1")
            this.props.temp_data.questions.forEach((quest) => {
                this.make_row(quest, tags_data, question_row);
                counter++;
            });

            if (counter > 1) q_string = 'questions';
            if (counter < 1) {
                return (
                    <div>
                        {this.title_template()}
                        <div id='main_left'>
                            <br></br>
                            <br></br>
                            <button id='question_menu' className='side_content' style={{ backgroundColor: this.state.q_back_color }} onClick={(e) => {
                                e.preventDefault();
                                this.setState({ unanswer_filter_checked: false, tag_check: false, searched_page: 0, q_back_color: "lightgray", search_value: '' });
                            }}>Questions</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <button id='tag_menu' className='side_content' style={{ backgroundColor: this.state.t_back_color }} onClick={this.props.main_tag_page}>Tags</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <button id='user_menu' className='side_content' style={{ backgroundColor: this.props.u_back_color }} onClick={this.props.main_user_page}>Users</button>
                        </div>

                        <div id='main_right'>
                            <div>
                                <h2 id='allQ'>Search Results</h2>
                                <button className='askQ' id='askQ_main' onClick={() => {
                                    if (this.props.username === "") {
                                        alert("You should login for asking the question");
                                    }
                                    else {
                                        this.props.ask_question();
                                    }

                                }}>Ask Question</button>
                            </div>
                            <div id='number_and_sorting_buttons'>
                                <p id='numQ'>{counter + ' ' + q_string}</p>

                                <div id='sorting_btns'>
                                    <button id='new_button' className='sort_buttons' onClick={this.newest_clicked}>Newest</button>
                                    <button id='active_button' className='sort_buttons' onClick={this.active_clicked}>Active</button>
                                    <button id='unanswer_button' className='sort_buttons' onClick={this.unanswered_clicked}>Unanswered</button>
                                </div>
                                <br></br>
                            </div>
                            <div id="main_questions_load">
                                <h2 id="no_questions">No Questions Found </h2>
                            </div>
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div>
                        {this.title_template()}
                        <div id='main_left'>
                            <br></br>
                            <br></br>
                            <button id='question_menu' className='side_content' style={{ backgroundColor: this.state.q_back_color }} onClick={(e) => {
                                e.preventDefault();
                                this.setState({ unanswer_filter_checked: false, tag_check: false, searched_page: 0, q_back_color: "lightgray", search_value: '' });
                            }}>Questions</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <button id='tag_menu' className='side_content' style={{ backgroundColor: this.state.t_back_color }} onClick={this.props.main_tag_page}>Tags</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <button id='user_menu' className='side_content' style={{ backgroundColor: this.props.u_back_color }} onClick={this.props.main_user_page}>Users</button>
                        </div>

                        <div id='main_right'>
                            <div>
                                <h2 id='allQ'>Search Results</h2>
                                <button className='askQ' id='askQ_main' onClick={this.props.ask_question}>Ask Question</button>
                            </div>
                            <div id='number_and_sorting_buttons'>
                                <p id='numQ'>{counter + ' ' + q_string}</p>

                                <div id='sorting_btns'>
                                    <button id='new_button' className='sort_buttons' onClick={this.newest_clicked}>Newest</button>
                                    <button id='active_button' className='sort_buttons' onClick={this.active_clicked}>Active</button>
                                    <button id='unanswer_button' className='sort_buttons' onClick={this.unanswered_clicked}>Unanswered</button>
                                </div>
                                <br></br>
                            </div>
                            {this.show_questions_template(question_row, counter)}
                        </div>
                    </div>
                );
            }
        }
        else {
            if (this.state.tag_check) {
                this.state.data_questions.forEach((quest) => {
                    if (quest.tags.includes(this.props.tid)) {
                        this.make_row(quest, tags_data, question_row);
                        counter++;
                    }
                })
            }
            else {
                this.state.data_questions.forEach((quest) => {
                    if (this.state.unanswer_filter_checked) {
                        if (quest.answers.length < 1) {
                            this.make_row(quest, tags_data, question_row);
                            counter++;
                        }
                    }
                    else {
                        console.log("make_row execute");
                        this.make_row(quest, tags_data, question_row);
                        counter++;
                    }

                });
            }

            if (counter > 1) q_string = 'questions';

            console.log("Counter: ", counter);
            console.log(counter / 5);

            return (
                <div>
                    {this.title_template()}
                    <div id='main_left'>
                        <br></br>
                        <br></br>
                        <button id='question_menu' className='side_content' style={{ backgroundColor: this.state.q_back_color }} onClick={(e) => {
                            e.preventDefault();
                            this.setState({ unanswer_filter_checked: false, tag_check: false, q_back_color: "lightgray", search_value: '' });
                        }}>Questions</button>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <button id='tag_menu' className='side_content' style={{ backgroundColor: this.state.t_back_color }} onClick={this.props.main_tag_page}>Tags</button>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <button id='user_menu' className='side_content' style={{ backgroundColor: this.props.u_back_color }} onClick={this.props.main_user_page}>Users</button>
                    </div>

                    <div id='main_right'>
                        <div>
                            <h2 id='allQ'>All Questions</h2>
                            <button className='askQ' id='askQ_main' onClick={() => {
                                if (this.props.username === "") {
                                    alert("You should login for asking the question");
                                }
                                else {
                                    this.props.ask_question();
                                }
                            }}>Ask Question</button>
                        </div>
                        <div id='number_and_sorting_buttons'>
                            <p id='numQ'>{counter + ' ' + q_string}</p>

                            <div id='sorting_btns'>
                                <button id='new_button' className='sort_buttons' onClick={this.newest_clicked}>Newest</button>
                                <button id='active_button' className='sort_buttons' onClick={this.active_clicked}>Active</button>
                                <button id='unanswer_button' className='sort_buttons' onClick={this.unanswered_clicked}>Unanswered</button>
                            </div>
                            <br></br>
                        </div>
                        {this.show_questions_template(question_row, counter)}
                    </div>
                </div>
            );
        }
    }
}