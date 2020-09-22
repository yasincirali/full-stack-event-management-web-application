import React, {Component} from 'react';
import {Button, Container, Table} from 'reactstrap';
import Moment from 'react-moment';
import Axios from "axios";
import AppNav from './AppNav';
import axios from "axios";
import UserAppNav from "./UserAppNav";
const api = axios.create({
    baseURL: 'http://localhost:8080/',
    responseType: "json"
});
class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userToken:'',
            userAuthority:'',
            eventsJoined:[],
            isLoading: true,
            Events: []
        }

        const token = window.localStorage.getItem("userToken");
        this.setState({userToken:token});
         this.state.userToken =token;
        this.bookEvent = this.bookEvent.bind(this);
        this.componentDidMount=this.componentDidMount.bind(this);

    }
    //BookForm a eventID yi yolluyor
    bookEvent(id) {
        window.localStorage.setItem("eventId", id);
        this.props.history.push('/booking');
    }

    async componentDidMount() {


        console.log(this.state.userToken);
        const tcPass = window.atob(this.state.userToken).split(":");

        //user ın kayıtlı oldupu eventler çekilir
        const responseJoined = await Axios.get('http://localhost:8080/getUserEvents/'+tcPass[0]);
        const bodyJoined =responseJoined.data;
        this.setState({eventsJoined: bodyJoined});

        //tc ye sahip user çekilir(Authority kullanılır NavBar için)
        let res = await Axios.get('http://localhost:8080/getUser/'+tcPass[0]);
        let data = res.data;
        this.setState({userAuthority:data.authorities[0].authority})
        //this.state.userAuthority = body1.authorities

        //console.log(this.state.userAuthority);

        const response = await fetch('/events');
        //const response = Axios.get('/events');
        const body = await response.json();
        this.setState({Events: body, isLoading: false});
    }

    render() {
        let nav;
        //console.log(this.props.data);
        if(this.state.userAuthority==="USER"){
            nav=<UserAppNav/>;
        }
        else{
            nav = <AppNav/>;
        }
        const {eventsJoined, isLoading,Events} = this.state;

        if (isLoading)
            return (<div>Loading...</div>);
        const {events} = this.state;

        let rows = eventsJoined.map(event =>
            <tr key={event.id}>
                <td>{event.title}</td>
                <td><Moment date={event.startDate ? new Date(event.startDate) : null} format="DD/MM/yyyy"/></td>
                <td><Moment date={event.finishDate ? new Date(event.finishDate) : null} format="DD/MM/yyyy"/></td>
                <td>{event.quota}</td>

            </tr>
        )
        const today=new Date();
        return (
            <div>
                {nav}
                <Table>
                {
                    Events.map(event =>
                        <div id={event.id} className="boxed" style={{justifyContent: 'center'}}>
                            <h3>{event.name}</h3>
                            <p>{event.title}</p>

                            <hr/>
                            <Moment format="DD/MM/YYYY">{event.startDate}</Moment>
                            <br/>
                            <Button
                                disabled={today>new Date(event.finishDate)? true:false}
                                color="primary"
                                onClick={() => this.bookEvent(event.id)}
                            >
                                {today>new Date(event.finishDate)? "Not Available" : "JOIN" }
                            </Button>
                        </div>


                    )
                }
                </Table>
                {''}
                <br/>
                <Container>

                    <h3>Joined Events List</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="30%">Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Quota</th>


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

export default User;