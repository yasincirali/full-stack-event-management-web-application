import React, { Component } from 'react';
import { Container, Input, Button, Label, Form, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';

import AppNav from './AppNav';
import {toast} from "react-toastify";

class EditEvent extends Component {

    constructor(props){
        super(props);
        this.state ={
            id: '',
            title: '',
            finishDate:new Date(),
            startDate:new Date(),
            quota:'',
            selection:{},
            regexp: /^[0-9\b]+$/

        }
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.loadEvent = this.loadEvent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        console.log(this.state.id);
    }

    async handleSubmit(event) {
        const toastOptions = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        };
        //console.log(new Date(this.state.startDate)>new Date(this.state.finishDate));
        if (new Date(this.state.startDate)>new Date(this.state.finishDate)){
            event.preventDefault();
            toast.error("Invalid date!End Date can not paster than start date", toastOptions);

        }
        else {
            event.preventDefault();
            const item = this.state;
            console.log(item.finishDate);
            console.log(item.startDate);

            await fetch('/modifyEvent/' + this.state.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            });
            this.props.history.push("/event");
            toast.success("Event successfully updated", toastOptions);

        }
    }

    componentDidMount() {
        this.loadEvent();
    }

    handleStartDateChange(date) {
        //this.state.startDate= date;
        this.setState({ startDate: date });

    }
    handleEndDateChange(date) {
        this.setState({ finishDate: date });
        //console.log(this.state.finishDate);
    }


    async loadEvent() {

        //console.log(this.props);
        //const {defEvent} = this.props.location.state.selection;

        //const id=defEvent.id;
        //this.state.id=id;
        //console.log(defEvent);
        const response = await fetch("/events/"+ window.localStorage.getItem("eventId"));
        const event = await response.json();
        console.log(event);
        this.setState({
            id: event.id,
            title: event.title,
            startDate: event.startDate,
            finishDate: event.finishDate,
            quota: event.quota
        });

    }


    onChange = (e) =>(e.target.value === '' || this.state.regexp.test(e.target.value)) ? this.setState({ [e.target.name]: e.target.value }):null;

    render() {
        const today = new Date();

        //console.log(this.state.title);
        //console.log(this.state.quota);
        const title = <h3>Update Event</h3>
        return (
            <div>
                <AppNav />
                <Container>
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="name">Title</Label>
                            <Input type="text" name="title" id="title" value={this.state.title}
                                   onChange={this.onChange} autoComplete="title" />
                        </FormGroup>

                        <FormGroup>
                            <Label for="startDate">Start Date</Label>
                            <br/>
                            <DatePicker selected={this.state.startDate ? new Date(this.state.startDate):null}
                                        dateFormat="dd/MM/yyyy"
                                        onChange={this.handleStartDateChange}
                                        required={true}
                                        minDate={today}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        scrollableYearDropdown/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="finishDate">End Date</Label>
                            <br/>
                            <DatePicker selected={this.state.finishDate ? new Date(this.state.finishDate):null}
                                        dateFormat="dd/MM/yyyy"
                                        onChange={this.handleEndDateChange}
                                        required={true}
                                        minDate={this.state.startDate}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        scrollableYearDropdown/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="quota">Quota</Label>
                            <Input type="numeric" name="quota" id="quota" value={this.state.quota}
                                   onChange={this.onChange} autoComplete="quota" />
                        </FormGroup>

                        <FormGroup>
                            <Button color="primary" type="submit">Update</Button>{' '}
                            <Button color="secondary" tag={Link} to="/event">Cancel</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default EditEvent;