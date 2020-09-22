import React, { Component } from 'react';
import AppNav from './AppNav';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import AuthenticationService from "../Service/AuthenticationService";
import Axios from "axios";
import axios from "axios";
import {toast} from "react-toastify";
const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const tcKimlikNoRegex = RegExp(
    /^[1-9]{1}[0-9]{9}[02468]{1}$/
);
const formValid = ({ formErrors, ...rest }) => {
    let valid = true;

    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    // validate the form was filled out
    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};
const api = axios.create({
    baseURL: 'http://localhost:8080/',
});
class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tcKimlikNo: "",
            password: "",
            userToken:"",
            formErrors: {
                tcKimlikNo: "",
                password: "",
                email:""

            }
        };
    }
    handleSubmit = e => {
        e.preventDefault();
        const toastOptions = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        };


        if (formValid(this.state)) {

            //backend e basic token yollanır
            const body = AuthenticationService.createBasicAuthToken(this.state.tcKimlikNo,this.state.password);
            api.post("/tokenAuth",body).then(response => {
                console.log(response.data);
                if (response.data.messageType === "SUCCESS") {
                    toast.success(response.data.message, toastOptions);
                    window.localStorage.setItem("userToken", body);

                    const tcPass = window.atob(body).split(":");
                    window.localStorage.setItem("tcKimlikNo", tcPass[0]);

                    AuthenticationService.registerSuccessfulLogin(this.state.tcKimlikNo, this.state.password);
                    this.props.history.push(`/home`,this.state)
                    //updateRows([...rows, inputData]);
                } else {
                    toast.error(response.data.message, toastOptions);
                }
            });


            /*
            AuthenticationService
                .executeBasicAuthenticationService(this.state.tcKimlikNo, this.state.password)
                .then(() => {

                    AuthenticationService.registerSuccessfulLogin(this.state.tcKimlikNo, this.state.password)
                    this.props.history.push(`/user`)
                }).catch(() => {
                this.setState({ showSuccessMessage: false })
                this.setState({ hasLoginFailed: true })
            })

             */


        } else {
            if (this.state.isLoginClicked){
                this.props.history.push("/login");

                console.log(this.state.isLoginClicked);

            }
            else {
                console.log(this.state.isLoginClicked);

            }
        }
    };
    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };

        switch (name) {
            case "tcKimlikNo":
                formErrors.tcKimlikNo = tcKimlikNoRegex.test(value)
                    ? ""
                    : "invalid Tc Kimlik No";
                break;
            case "password":
                formErrors.password =
                    value.length < 6 ? "minimum 6 characaters required" : "";
                break;
            default:
                break;
        }
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    };
    render() {
        const { formErrors } = this.state;

        return (
            <div className="wrapper">
                <h1 style={{display: 'flex', justifyContent: 'center', alignItems: 'center',marginBottom:'200px', height: '60px',color:'white'}}>EVENT MANAGER</h1>

                <div className="form-wrapper">

                    <h1>LOGIN</h1>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <div className="tcKimlikNo">
                            <label htmlFor="tcKimlikNo">TC Kimlik No</label>
                            <input
                                className={formErrors.tcKimlikNo.length > 0 ? "error" : null}
                                placeholder="Tc Kimlik No"
                                type="text"
                                name="tcKimlikNo"
                                noValidate
                                onChange={this.handleChange}
                            />
                            {formErrors.email.length > 0 && (
                                <span className="errorMessage">{formErrors.email}</span>
                            )}
                        </div>
                        <div className="password">
                            <label htmlFor="password">Password</label>
                            <input
                                className={formErrors.password.length > 0 ? "error" : null}
                                placeholder="Password"
                                type="password"
                                name="password"
                                noValidate
                                onChange={this.handleChange}
                            />
                            {formErrors.password.length > 0 && (
                                <span className="errorMessage">{formErrors.password}</span>
                            )}
                        </div>
                        <div className="createAccount">
                            <Button onClick={this.handleSubmit} >LOGIN</Button>
                            <small>Dont you have an account?</small>
                            <div className="login">
                                <Button  component={Link} to="/">Create an account</Button>
                            </div>

                        </div>


                    </form>
                </div>
            </div>

        );
    }
}

export default Login;