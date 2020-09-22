import React, {Component, useState} from 'react';
import {Table, Container, Input, Button, Label, Form, FormGroup} from 'reactstrap';
import {Link} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Moment from 'react-moment';
import "react-datepicker/dist/react-datepicker.css";
import AppNav from './AppNav';
import {toast, ToastContainer} from "react-toastify";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';


const api = axios.create({
    baseURL: 'http://localhost:3000/',
});

class EventForm extends Component {

    emptyItem = {
        id: '',
        title: '',
        startDate: new Date(),
        finishDate: new Date(),
        quota: '',
        users:null
    }

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            date: new Date(),
            isLoading: true,
            events: [],
            item: this.emptyItem,
            selection: {},
            regexp: /^[0-9\b]+$/
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.editEvent = this.editEvent.bind(this);
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
        event.preventDefault();

        const item = this.state.item;
        const body ={
            id: item.id,
            title: item.title,
            startDate: item.startDate,
            finishDate: item.finishDate,
            quota: item.quota,
            users: item.users

        }

        const sendData = JSON.stringify(body)
        console.log(body);
       const res = await axios.post('/createEvent',sendData, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response.data);
            if (response.data.messageType === "SUCCESS") {
                toast.success(response.data.message, toastOptions);
                //updateRows([...rows, inputData]);
            } else {
                toast.error(response.data.message, toastOptions);
            }
        }).catch(function ( error){
            console.log(error);
       });

        await this.componentDidMount();

        //this.props.history.push("/event");
    }

    handleChange(event) {
        if (event.target.name == "quota") {
            if (event.target.value === '' || this.state.regexp.test(event.target.value)) {
                console.log(event.target.value);
                const target = event.target;
                const value = target.value;
                const name = target.name;
                let item = {...this.state.item};
                item[name] = value;
                this.setState({item});
            }

        } else {
            const target = event.target;
            const value = target.value;
            const name = target.name;
            let item = {...this.state.item};
            item[name] = value;
            this.setState({item});
        }
    }

    handleDateChange(date) {

        const toastOptions = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        };
        let item = {...this.state.item};
        item.startDate = date;
        if (item.startDate > item.finishDate) {
            item.finishDate = date;
        }

        this.setState({item});
        console.log(this.state.item.startDate);

    }

    handleEndDateChange(date) {
        const toastOptions = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        };
        if (date < this.state.item.startDate) {
            toast.error("Invalid date!End Date can not paster than start date", toastOptions);

        } else {

            let item = {...this.state.item};
            item.finishDate = date;
            this.setState({item});
        }
    }

    async remove(event) {
        /*
        console.log(event);
        const id=event.id;
        const response = await fetch(`/events/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        try {
            const body = await response.json();
            if(body.httpStatus === "BAD_REQUEST") {
                console.log(body.message);
            } else {
                let updatedEvents = [...this.state.events].filter(i => i.id !== id);
                this.setState({ events: updatedEvents });
            }
        } catch(e) {}*/
        const toastOptions = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        };

        let res = await api.delete('/deleteEvent/' + event.id, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response.data);
            if (response.data.messageType === "SUCCESS") {
                toast.success(response.data.message, toastOptions);
                //updateRows([...rows, inputData]);
            } else {
                toast.error(response.data.message, toastOptions);
            }
        });

        this.componentDidMount();
    }

    //localstorage ı önlemek için buradakşi taktiği kullan
    editEvent(event) {
         window.localStorage.setItem("eventId", event.id);
        //this.setState({selection:{event}} );
        //this.state.selection = event;
        console.log(event);

        //console.log(this.state.selection);

        this.props.history.push({pathname:'/editEvent',state:{selection:this.state.selection}});
    }

    viewEvent(id) {
        window.localStorage.setItem("eventId", id);
        this.props.history.push('/viewEvent');
    }

    async componentDidMount() {
        const response = await fetch('/events');
        const body = await response.json();
        this.setState({events: body, isLoading: false});
    }

    render() {

        const today = new Date();

        let isPast ;


        const title = <h3 style={{marginTop: '10px'}}>Add Event</h3>
        const {events, isLoading} = this.state;

        if (isLoading)
            return (<div>Loading...</div>);

        let rows = events.map(event =>
            <tr key={event.id}>
                <td>{event.title}</td>
                <td><Moment date={event.startDate ? new Date(event.startDate) : null} format="DD/MM/yyyy"/></td>
                <td><Moment date={event.finishDate ? new Date(event.finishDate) : null} format="DD/MM/yyyy"/></td>
                <td>{event.quota}</td>

                <td><Button size="sm" color="secondary" disabled={today>new Date(event.startDate)? true:false}
                            onClick={() => this.editEvent(event)}>Modify</Button></td>
                <td><Button size="sm" color="info" onClick={() => this.viewEvent(event.id)}>View</Button></td>

                <td><Button size="sm" color="danger" onClick={() => this.remove(event)}>Delete</Button></td>
            </tr>
        )

        return (
            <div>
                <ToastContainer/>

                <AppNav/>
                <Container>
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input type="text" name="title" id="title" placeHolder={"Enter a title for the event"} value={this.state.item.title}
                                   onChange={this.handleChange} autoComplete="name"/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="startDate">Start Date</Label>
                            <br/>
                            <DatePicker selected={this.state.item.startDate}
                                        dateFormat="dd/MM/yyyy"
                                        onChange={this.handleDateChange}
                                        required={true}
                                        minDate={today}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        scrollableYearDropdown
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="finishDate">End Date</Label>
                            <br/>
                            <DatePicker selected={this.state.item.finishDate}
                                        dateFormat="dd/MM/yyyy"
                                        required={true}
                                        minDate={this.state.item.startDate}
                                        onChange={this.handleEndDateChange}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        scrollableYearDropdown
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="name">Quota</Label>
                            <Input type="numeric" name="quota"
                                   id="quota" placeHolder={"Please enter numeric value for quota"}
                                   value={this.state.item.quota}
                                   onChange={this.handleChange}
                                   autoComplete="quota"/>
                        </FormGroup>

                        <FormGroup>
                            <Button color="primary" type="submit">Create</Button>{' '}
                            <Button color="secondary" tag={Link} to="/admin">Cancel</Button>
                        </FormGroup>
                    </Form>
                </Container>

                {''}
                <Container>
                    <h3>Events List</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="30%">Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Quota</th>

                            <th width="10%">Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {rows}
                        </tbody>
                    </Table>

                </Container>
            </div>
        );
    }
}

export default EventForm;