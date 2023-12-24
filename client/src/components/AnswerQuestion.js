import React from 'react';

export default class AnswerQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ans_text: '',
            ans_name: ''
        }
        this.handle_ans_text = this.handle_ans_text.bind(this);
        // this.handle_ans_name = this.handle_ans_name.bind(this);
    }

    handle_ans_text(e) {
        this.setState({ ans_text: this.props.answer_text_handler(e.target.value) });
        this.props.answer_text_handler(e.target.value);
    }

    // handle_ans_name(e) {
    //     this.setState({ ans_name: this.props.answer_name_handler(e.target.value) });
    //     this.props.answer_name_handler(e.target.value);
    // }

    render() {
        return (
            <div id='main_right'>
                <div id="answer_question_page">
                    {/* 
                    <h1>Username*</h1>
                    <textarea rows={"2"} cols={"50"} className="ans_font" id='ans_q_user' value={this.state.ans_name} onChange={this.handle_ans_name}></textarea> 
                    <br></br>
                    */}
                    <h1>Answer Text*</h1>
                    <textarea rows={"8"} cols={"50"} className="ans_font" id='ans_q_text' value={this.state.ans_text} onChange={this.handle_ans_text}></textarea>
                    <br></br>
                    <br></br>
                    <button id="ans_post_btn" onClick={this.props.post_answer}>Post Answer</button>
                    <p id="mandatory">* indicated mandatory fields</p>
                </div>
            </div>
        );
    }
}   