import React from 'react';

export default class WelcomePage extends React.Component {

    render() {
        return (
            <>
                <div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <h1 id='welcome_header'>Welcome to FakeStackOverflow</h1>
                </div>
                <div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <button id='welcome_register' onClick={this.props.register}>Register</button>
                    <br></br>
                    <br></br>
                    <br></br>
                    <button id='welcome_login' onClick={this.props.user_login}>Login</button>
                    <br></br>
                    <br></br>
                    <br></br>
                    <button id='welcome_guest' onClick={() => {
                        this.props.user_empty();
                        this.props.main_question_page();
                    }}>Guest login</button>
                </div>
            </>
        )
    }
}