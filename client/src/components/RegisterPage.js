import React from 'react';

export default class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.handle_name = this.handle_name.bind(this);
        this.handle_account = this.handle_account.bind(this);
        this.handle_pw = this.handle_pw.bind(this);
        this.handle_verify = this.handle_verify.bind(this);
    }

    handle_name(e) {
        this.props.name_handler(e.target.value);
    }

    handle_account(e) {
        this.props.account_handler(e.target.value);
    }

    handle_pw(e) {
        this.props.pw_handler(e.target.value);
    }

    handle_verify(e) {
        this.props.verify_handler(e.target.value);
    }

    render() {
        return (
            <>
                <div>
                    <h1 id='register_header'>Register</h1>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div>
                    <p id='register_titles'>Username</p>
                    <textarea rows={"1"} cols={"30"} id="register_username" placeholder="Username" onChange={this.handle_name}></textarea>
                    <br></br>
                </div>
                <div>
                    <p id='register_titles'>Account</p>
                    <textarea rows={"1"} cols={"30"} id="register_account" placeholder="example_user@stonybrook.edu" onChange={this.handle_account}></textarea>
                    <br></br>
                </div>
                <div>
                    <p id='register_titles'>Password</p>
                    <textarea rows={"1"} cols={"30"} id="register_pw" placeholder="" onChange={this.handle_pw}></textarea>
                    <br></br>
                </div>
                <div>
                    <p id='register_titles'>Password Verification</p>
                    <textarea rows={"1"} cols={"30"} id="register_pw_verify" placeholder="" onChange={this.handle_verify}></textarea>
                    <br></br>
                </div>
                <br></br>
                <br></br>
                <div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <button id='register_signUp_btn' onClick={this.props.add_user}>Sign Up</button>
                </div>
            </>
        )
    }
}