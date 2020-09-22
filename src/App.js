import React, {Component, useEffect, useState} from 'react';
import PaginationTable from "./components/table/PaginationTable";
import axios from "axios";
import Button from "@material-ui/core/Button";
import PlusIcon from "@material-ui/icons/Add"

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactNotifications from 'react-notifications-component';
import {BrowserRouter as Router, Switch, Route,useHistory} from 'react-router-dom';

import Home from './components/pages/Home';
import Admin from "./components/pages/Admin";
import User from "./components/pages/User";
import AppNav from "./components/pages/AppNav";
import BookingForm from "./components/pages/BookingForm";
import EditEvent from "./components/pages/EditEvent";
import EventForm from "./components/pages/EventForm";
import ViewEvent from "./components/pages/ViewEvent";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import AuthenticatedRoute from "./components/Service/AuthenticatedRoute";


//toast.configure()
class App extends Component {
    render() {
        return (

            <Router>
                <ReactNotifications />
                <Switch>
                    <Route path='/' exact={true} component={Register} />
                    <Route path='/home' exact={true} component={Home} />
                    <Route path='/register' exact={true} component={Register} />
                    <Route path='/login' exact={true} component={Login} />
                    <Route path='/user' exact={true} component={User} />
                    <Route path='/admin' exact={true} component={Admin} />
                    <Route path='/event' exact={true} component={EventForm} />
                    <Route path='/booking' exact={true} component={BookingForm} />
                    <Route path='/editEvent' exact={true} component={EditEvent} />
                    <Route path='/viewEvent' exact={true} component={ViewEvent} />

                </Switch>
            </Router>

        );
    }
}

export default App;
