import React, {useEffect, useState} from 'react';
import PaginationTable from "../table/PaginationTable";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { Link } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppNav from "./AppNav";
import EventIcon from '@material-ui/icons/Event';
import LineChart from "../table/BarChart";
import BarChart from "../table/BarChart";
export default function App(props) {

    const studentDialogFields = [
        {id: "name", label: "Name", type: "text"},
        {id: "surname", label: "Surname", type: "text"},
        {id: "tcKimlikNo", label: "TC Kimlik No", type: "text"}
    ];


    const [rows, updateRows] = useState([]);

    const toastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
    };

    useEffect(() => {
        axios.get("/events")
            .then(response => {
                updateRows(response.data)
            })
    }, [])

    let titles = rows.map((row)=>row.title);
    let numberOfAttenders = rows.map((row)=>row.users.length);
    console.log(rows);
    const studentTableColumns = [
        {id: 'name', label: 'Name', minWidth: 150, align: "center"},
        {id: 'surname', label: 'Surname', minWidth: 200,align: "center"},
        {id: 'tcKimlikNo', label: 'TC Kimlik No', minWidth: 200, align: 'center'}

    ];

    let data;
    data = {
        labels: titles,
        datasets: [
            {
                label: "ATTENDANCE FOR EACH EVENT(PERSON)",
                data: numberOfAttenders,

                pointBorderColor:'rgba(255,206,86,0.2)'
            }
        ]
    }


    return (
        <div className="Admin">
            <AppNav/>
            <Button variant="contained" color="primary" component={Link} to="/event"
                    style={{margin: '10px', float: 'right'}}
                startIcon={<EventIcon/>}  >EVENT PANEL</Button>
            {''}
            <BarChart data={data}/>
            <ToastContainer/>
        </div>
    );

}