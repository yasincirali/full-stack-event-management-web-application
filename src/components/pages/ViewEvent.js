import React, {Component, useState} from 'react';
import {Container, Input, Button, Label, Form, FormGroup, Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import DatePicker from 'react-datepicker';

import AppNav from './AppNav';
import moment from "moment";
import PaginationTable from "../table/PaginationTable";
import Moment from "react-moment";

class EditEvent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            finishDate: new Date(),
            startDate: new Date(),
            users: [],
            quota: ''


        }

        this.loadEvent = this.loadEvent.bind(this);
    }


    componentDidMount() {
        this.loadEvent();
        //console.log(this.state.id);

    }


    async loadEvent() {

        const id = window.localStorage.getItem("eventId");
        this.state.id = id;
        // console.log(id);
        const response = await fetch("/events/" + window.localStorage.getItem("eventId"));
        const event = await response.json();


        //this.setState({event});


        this.setState({
            id: event.id,
            title: event.title,
            startDate: event.startDate,
            finishDate: event.finishDate,
            quota: event.quota,
            users: event.users
        });


        //console.log(this.state.users);
    }


    render() {
        //console.log(this.state.title);
        //console.log(this.state.quota);
        //const {events, isLoading}=useState([]);
        const {events, isLoading} = this.state;
        if (isLoading)
            return (<div>Loading...</div>);
        //console.log(this.state.users);
        let rows;
        if (this.state.users.length > 0) {
            rows = this.state.users.map(event =>
                <tr key={this.state.users.id}>
                    <td>{this.state.users.name}</td>
                    <td>{this.state.users.surname}</td>
                    <td>{this.state.users.tcKimlikNo}</td>

                </tr>
            )
        } else {
            rows = ''
        }
        //console.log(this.state.users);


        const title = <h2>{this.state.title + " - List of Attenders"}</h2>
        return (
            <div>
                <AppNav/>
                <Container>
                    {title}
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="30%">Name</th>
                            <th>Surname</th>
                            <th>Tc kimlik No</th>
                        </tr>
                        </thead>

                        <tbody>
                        {
                            this.state.users.map(user =>
                                <tr key={this.state.users.id}>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.tcKimlikNo}</td>

                                </tr>)
                        }
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default EditEvent;