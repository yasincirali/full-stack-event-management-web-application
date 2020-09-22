import React, {Component} from 'react';
import {Container, Input, Button, Label, Form, FormGroup} from 'reactstrap';
import {Link} from 'react-router-dom';
import {store} from 'react-notifications-component';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';
import AppNav from './AppNav';
import Axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import QRCode from "../notifications/QRCode"
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import UserAppNav from "./UserAppNav";


const api = Axios.create({
    baseURL: 'http://localhost:3000/',
    responseType: "json"
})

toast.configure();

class BookingForm extends Component {

    emptyItem = {
        name: '',
        surname: '',
        tcKimlikNo: '',
        event_id: ''

    }

    constructor(props) {
        super(props);

        this.state = {
            QRCode:false,
            isJoined:false,
            userToken:'',
            userAuthority:'',
            isLoading: true,
            item: this.emptyItem,
            regexp: /^[0-9\b]+$/
        }

        const token = window.localStorage.getItem("userToken");
        this.setState({userToken:token});
        this.state.userToken =token;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentDidMount=this.componentDidMount.bind(this);

        //this.handleChange = this.handleChange.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        const toastOptions = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        };

        const item = this.state.item;

        //console.log(this.state.item.event_id);
        console.log(item);
        const body = JSON.stringify(item)
        //const body = item;
        await api.put('/addEventToUser', body, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.data.messageType === "SUCCESS") {

                toast.success(response.data.message, toastOptions);
                console.log(response.data);
                //updateRows([...rows, inputData]);
            } else {
                toast.error(response.data.message, toastOptions);
            }
        });
//BURADA YENİ kullanıcı ekleme değil sadece bu user ın events ve last event kısmı modify olacak
    }
/*
    handleChange=(event) => {

        if (event.target.name == "tcKimlikNo") {

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

 */

    async componentDidMount() {
       // console.log(this.state.userToken);

        const tcPass = window.atob(this.state.userToken).split(":");

        let res = await Axios.get('http://localhost:8080/getUser/'+tcPass[0]);
        let data = res.data;
        //console.log(data);

        this.state.item.tcKimlikNo=data.tcKimlikNo;
        this.state.item.name=data.tcKimlikNo;
        this.state.item.surname=data.tcKimlikNo;
        //console.log(this.state);
        let item = {...this.state.item};
        const eventID = window.localStorage.getItem("eventId");
        const response = await fetch('/events/' + eventID);
        const body = await response.json();
        this.setState({eventApplied: body.title});
        //console.log(eventID);
        this.state.item.event_id = eventID;
        this.setState({item:{name:data.name,
                            surname:data.surname,
                            tcKimlikNo:data.tcKimlikNo,
                            event_id:eventID},
                            userAuthority:data.authorities[0].authority,
                            eventApplied: body.title})
    }
    handleShow = ()=>{
        this.setState({
            QRCode: true
        })
    }

    handleJoin = ()=>{
        this.setState({
            isJoined: true
        })
    }
    render() {
        let url = "https://www.google.com.tr/" + this.state.eventApplied + " | " + this.state.item.tcKimlikNo + " | ";

        const style = {
            width: '20vw',
            height: '20vw',

        }
        const containerStyle = {
            position: 'relative',
            width: '20vw',
            height: '20vw%'
        }
       let position;
        if (this.state.item.event_id%2==0) {
            position = {
                lat: 38.418720,
                lng: 27.129601

            }
        }
        else{
            position = {
                lat: 40.986150,
                lng: 29.028500

            }
        }
        const title = <h3>Booking Form-{this.state.eventApplied}</h3>
        let nav;
        //console.log(this.state.userAuthority);
        if(this.state.userAuthority==="USER"){
            nav=<UserAppNav/>;
        }
        else{
            nav = <AppNav/>;
        }
        return (
            <div style={{width: "100vw", height: "100vh"}}>
                <ToastContainer/>
                {nav}
                <Container>
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="first_name">First Name</Label>
                            <Input type="text" name="name" id="name" value={this.state.item.name}
                                   autoComplete="name"
                                   disabled={true}
                                   placeholder={"Please enter your name"}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="last_name">Last Name</Label>
                            <Input type="text" name="surname" id="surname" value={this.state.item.surname}
                                   autoComplete="name"
                                   disabled={true}
                                   placeholder={"Please enter your surname"}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="tcKimlikNo">TC Kimlik No</Label>
                            <Input type="text" name="tcKimlikNo" id="tcKimlikNo"
                                   value={this.state.item.tcKimlikNo}
                                   disabled={true}
                                   placeholder={"Please enter a valid Tc Kimlik No"}

                            />
                        </FormGroup>

                        <FormGroup>
                            <Button
                                color="primary"
                                type="submit"
                                onClick={this.handleJoin}
                            >
                                JOIN
                            </Button>{' '}

                            <Button color="secondary" tag={Link}
                                    to="/user">Cancel</Button>{' '}

                            {this.state.isJoined ? <Button color="info"
                                                           disabled={false}
                                                           onClick={this.handleShow}>QR Code</Button> : null}
                        </FormGroup>
                    </Form>
                    <br/>

                    {this.state.QRCode ? <QRCode url={url}/> : null}

                </Container>
                <br/>
                <Map google={this.props.google}
                     style={style}
                     containerStyle={containerStyle}
                     zoom={5}
                     initialCenter={position}
                >

                    <Marker name={"Event Location"}
                            position={position}/>

                </Map>

            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyAlPo7I_HDbakUFkrc_nrhsvjI6Tc_cK-M")
})(BookingForm)