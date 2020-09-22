import React, {Component} from 'react';
import AppNav from './AppNav';
import UserAppNav from "./UserAppNav";
import Axios from "axios";
import eventImage from "./eventImage.jpeg"

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userToken: '',
            userAuthority: '',

        };
        const token = window.localStorage.getItem("userToken");
        this.setState({userToken: token});
        this.state.userToken = token;
        this.componentDidMount = this.componentDidMount.bind(this);

    }

    async componentDidMount() {

        //const userInfo = this.props.history.location.state;
        //console.log(userInfo);
        //this.setState({
        //   tcKimlikNo: userInfo.tcKimlikNo,
        //   password: userInfo.password
        // });

        console.log(this.state.userToken);
        const tcPass = window.atob(this.state.userToken).split(":");

        let res = await Axios.get('http://localhost:8080/getUser/' + tcPass[0]);
        let data = res.data;
        this.setState({userAuthority: data.authorities[0].authority})
        //this.state.userAuthority = body1.authorities

        console.log(this.state.userAuthority);


    }

    render() {
        let nav;
        if (this.state.userAuthority === "USER") {
            nav = <UserAppNav/>;
        } else {
            nav = <AppNav/>;
        }

        return (
            <div>
                {nav}
                <h2 style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '20px',
                    marginBottom: '15px',
                    
                    color: 'primary'
                }}>
                    Welcome to Event Manager!
                </h2>
                <div className="container-div" >
                    <img class="imageEvent" src={eventImage} style={{width: 1500, height: 650}}/>
                </div>
            </div>
        );
    }
}

export default Home;