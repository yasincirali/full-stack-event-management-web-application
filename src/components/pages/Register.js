import React, { Component } from 'react';
import AppNav from './AppNav';
import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import Axios from "axios";
import AuthenticationService from "../Service/AuthenticationService";
import axios from "axios";
import {toast} from "react-toastify";

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    responseType: "json"
});
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

class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: null,
            surname: null,
            tcKimlikNo: null,
            password: null,
            formErrors: {
                firstName: "",
                lastName: "",
                tcKimlikNo: "",
                password: ""
            }
        };
    }
    handleSubmit = e => {
        const toastOptions = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        };
        e.preventDefault();

        if (formValid(this.state)) {
            const body ={
                name: this.state.name,
                surname: this.state.surname,
                tcKimlikNo: this.state.tcKimlikNo,
                password: this.state.password

            }

            api.post("/addUser",body, {
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log(response.data);
                if (response.data.messageType === "SUCCESS") {
                    this.props.history.push("/login");
                    toast.success(response.data.message, toastOptions);
                    //updateRows([...rows, inputData]);
                } else {
                    toast.error(response.data.message, toastOptions);
                }
                //Error u console a da yazırabilirdik
            }).catch(Error => toast.error("Someone already registered with this Tc Kimlik No!"));





            console.log(`
        --SUBMITTING--
        First Name: ${this.state.name}
        Last Name: ${this.state.surname}
        Tckimlik: ${this.state.tcKimlikNo}
        Password: ${this.state.password}
      `);
        } else {
            //this.props.history.push("/login");

            console.log(this.state.isLoginClicked);


            //console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
        }
    };
    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };

        switch (name) {
            case "name":
                formErrors.firstName =
                    value.length < 3 ? "minimum 3 characaters required" : "";
                break;
            case "surname":
                formErrors.lastName =
                    value.length < 3 ? "minimum 3 characaters required" : "";
                break;
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
            <h1 style={{display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:'80px',marginBottom:'80px', height: '60px',color:'white'}}>EVENT MANAGER</h1>

                <div className="form-wrapper">
                    <h1>Create Account</h1>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <div className="firstName">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                className={formErrors.firstName.length > 0 ? "error" : null}
                                placeholder="First Name"
                                type="text"
                                name="name"
                                noValidate
                                onChange={this.handleChange}
                            />
                            {formErrors.firstName.length > 0 && (
                                <span className="errorMessage">{formErrors.firstName}</span>
                            )}
                        </div>
                        <div className="lastName">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                className={formErrors.lastName.length > 0 ? "error" : null}
                                placeholder="Last Name"
                                type="text"
                                name="surname"
                                noValidate
                                onChange={this.handleChange}
                            />
                            {formErrors.lastName.length > 0 && (
                                <span className="errorMessage">{formErrors.lastName}</span>
                            )}
                        </div>
                        <div className="email">
                            <label htmlFor="email">TC Kimlik No</label>
                            <input
                                className={formErrors.tcKimlikNo.length > 0 ? "error" : null}
                                placeholder="Tc Kimlik No"
                                type="text"
                                name="tcKimlikNo"
                                noValidate
                                onChange={this.handleChange}
                            />
                            {formErrors.tcKimlikNo.length > 0 && (
                                <span className="errorMessage">{formErrors.tcKimlikNo}</span>
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
                            <button type="submit">Create Account</button>

                            <small>Already Have an Account?</small>
                            <div className="login">
                                <Button  component={Link} to="/login">LOGIN</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        );
    }
}

export default Register;