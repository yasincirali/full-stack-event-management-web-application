import React, { Component } from 'react';
import {Nav, Navbar,NavItem, NavbarBrand, NavLink} from 'reactstrap';
import EventIcon from "@material-ui/icons/Event";
import Button from "@material-ui/core/Button";
class UserAppNav extends Component {

    render() {
        return (

            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="/home">Event Manager</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="/home" >Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/user" >User</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink style={{
                                fontWeight: "bold",
                                color: "cyan"
                            }} href="/login"  >Logout</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>

        );

    }
}

export default UserAppNav;