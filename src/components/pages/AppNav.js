import React, {Component} from 'react';
import {Nav, Navbar, NavItem, NavbarBrand, NavLink} from 'reactstrap';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import {toast} from "react-toastify";

let stompClient=null;
class AppNav extends Component {

    constructor(props) {
        super(props);
        this.connect();
        this.connect = this.connect.bind(this);
        this.onConnected = this.onConnected.bind(this);

    }

    connect=()=>{
        let baseURL='http://localhost:8080/';
        this.SockJS= new SockJS(baseURL+'admin/webSocket');
        stompClient=Stomp.over(this.SockJS);
        stompClient.connect({},this.onConnected,this.onError)

    }
    onConnected=()=>{
        const toastOptions = {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        };
        console.log("It is connected!!");
        //Modify the message ,use event
        stompClient.subscribe('/topic/joinEvent/'+window.localStorage.getItem("tcKimlikNo"), (user)=>{toast.info(/*{...JSON.parse(user.body)}["name"]+" "+{...JSON.parse(user.body)}["surname"]*/user.body/*+" is joined to "*/, toastOptions);console.log(user);})
    }

    render() {
        return (

            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="/home">Event Manager</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="/home">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/user">User</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/admin">Admin</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink style={{
                                fontWeight: "bold",
                                color: "cyan"
                            }} href="/login">Logout</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>

        );

    }
}

export default AppNav;