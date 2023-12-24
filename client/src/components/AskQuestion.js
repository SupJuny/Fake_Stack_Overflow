import React from 'react';

export default class AskQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title_value: '',
            text_value: '',
            // user_value: '',
            tag_value: '',
            summary_value: ''
        }
        this.handle_title = this.handle_title.bind(this);
        this.handle_text = this.handle_text.bind(this);
        // this.handle_user = this.handle_user.bind(this);
        this.handle_tag = this.handle_tag.bind(this);
        this.handle_summary = this.handle_summary.bind(this);
    }

    handle_title(e) {
        this.props.title_handler(e.target.value);
        this.setState({ title_value: this.props.title_handler(e.target.value) });
    }

    handle_text(e) {
        this.props.text_handler(e.target.value);
        this.setState({ text_value: this.props.text_handler(e.target.value) });
    }

    handle_tag(e) {
        this.props.tag_handler(e.target.value);
        this.setState({ tag_value: this.props.tag_handler(e.target.value) });
    }

    // handle_user(e) {
    //     this.props.user_handler(e.target.value);
    //     this.setState({ user_value: this.props.user_handler(e.target.value) });
    // }

    handle_summary(e) {
        this.props.summary_handler(e.target.value);
        this.setState({ summary_value: this.props.summary_handler(e.target.value) });
    }

    render() {
        return (
            <div id='main_right'>
                <div id='ask_question_page'>
                    <h1>Question Title*</h1>
                    <p className="askQ_italic"> Limit title to 50 characters or less</p>
                    <textarea rows={"2"} cols={"50"} className='askQ_textarea' id='new_q_title' value={this.state.title_value} onChange={this.handle_title}></textarea>
                    <h1>Question Summary*</h1>
                    <p className="askQ_italic"> Limit summary to 140 characters or less</p>
                    <textarea rows={"8"} cols={"50"} className='askQ_textarea' id='new_q_summary' value={this.state.summary_value} onChange={this.handle_summary}></textarea>
                    <h1>Question Text*</h1>
                    <p className="askQ_italic"> Add details</p>
                    <textarea rows={"8"} cols={"50"} className='askQ_textarea' id='new_q_text' value={this.state.text_value} onChange={this.handle_text}></textarea>
                    <h1>Tags*</h1>
                    <p className="askQ_italic"> Add keywords seperated by whitespace</p>
                    <textarea rows={"2"} cols={"50"} className='askQ_textarea' id='new_q_tag' value={this.state.tag_value} onChange={this.handle_tag}></textarea>
                    <br></br>
                    <br></br>
                    <button id="post_btn" onClick={this.props.add_question}> Post Question </button>
                    <p id="mandatory">* indicated mandatory fields</p>
                </div>
            </div>
        );
    }
}