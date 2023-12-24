import React from 'react';

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.handle_account = this.handle_account.bind(this);
        this.handle_pw = this.handle_pw.bind(this);
    }

    handle_account(e) {
        this.props.account_handler(e.target.value);
    }

    handle_pw(e) {
        this.props.pw_handler(e.target.value);
    }

    render() {
        return (
            <>
                <div>
                    <h1 id='login_header'>Login before Use</h1>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div>
                    <p id='login_titles'>Account</p>
                    <input type="text" id="login_account" placeholder="example_user@stonybrook.edu" onChange={this.handle_account}></input>
                    {/* 
                    <textarea rows={"1"} cols={"30"} id="login_account" placeholder="example_user@stonybrook.edu" onChange={this.handle_account}></textarea>
                    */}
                    <br></br>
                </div>
                <br></br>
                <div>
                    <p id='login_titles'>Password</p>
                    <input type="password" id="login_pw" placeholder="" onChange={this.handle_pw}></input>
                    {/*
                    <textarea rows={"1"} cols={"30"} id = "login_pw" placeholder="" onChange={this.handle_pw}></textarea>
                    */}
                    <br></br>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div>
                    <button id='login_signIn_btn' onClick={this.props.try_login}>Log in</button>
                    <br></br>
                </div>
            </>
        )
    }
}