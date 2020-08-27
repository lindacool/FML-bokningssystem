import React, { useState, useEffect } from 'react';
import './booking.scss';
import DateComponent from './date/date';
import TimeComponent from './time/time';
import ContactComponent from './contact/contact';
import axios from 'axios';

export default function Booking() {

    class userClass {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: number;
        constructor(fname: string, lname: string, email:string, phoneNumber: number){
            this.firstName = fname;
            this.lastName = lname;
            this.email = email;
            this.phoneNumber = phoneNumber;
        }
    }

    const [date, setDate] = useState(new Date());
    const [people, setPeople] = useState(0);
    const [sitting, setSitting] = useState([18, 21]);
    const [user, setUser] = useState(new userClass("", "", "", 0));

    function updateDateFromChild(date: Date) {
        setDate(date);
        // Render Time component instead of Date
    }

    function updatePeopleFromChild(people: number) {
        setPeople(people);
    }

    function updateSittingFromChild(sitting: number[]) {
        setSitting(sitting);
        // Render Contact component instead of Time
    }

    function updateUserFromChild(firstName: string, lastName: string, email: string, phoneNumber: number) {
        let user = new userClass(firstName, lastName, email, phoneNumber);
        setUser(user);

        axios.get("http://localhost:4000/getAvailability/1/20201111").then(axiosObject => {
            console.log(axiosObject.data); // data from API within the Axios object
        })
    }

    return (
        <div>
            <hr/>
            <h2>Data som skickas till parent (Booking)</h2>
            <p>{date.toString()}</p>
            <p>{people.toString()}</p>
            <p>{sitting.toString()}</p>
            <p>{JSON.stringify(user)}</p>
            <hr/>
            <DateComponent updateDate={updateDateFromChild} updatePeople={updatePeopleFromChild} />
            <hr/>
            <TimeComponent updateSitting={updateSittingFromChild} date={date} people={people} sitting={sitting}></TimeComponent>
            <ContactComponent updateUser={updateUserFromChild} date={date} people={people} sitting={sitting}></ContactComponent>
        </div>
        
    );
}