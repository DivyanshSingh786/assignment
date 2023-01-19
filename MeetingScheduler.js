// This component makes a GET request to the /view-timings API endpoint to retrieve the available timings when the component first mounts. It also has a form that allows the user to select a day and time and make a POST request to the /schedule-meeting API endpoint. The component also has a message state variable that is used to display success or error messages to the user.

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MeetingScheduler = () => {
  const [timings, setTimings] = useState({});
  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("9am");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get available timings on component mount
    getTimings();
  }, []);

  const getTimings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/view-timings');
      setTimings(res.data.data);
    } catch (err) {
      setMessage("Error retrieving timings");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/schedule-meeting', { day, time });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Error scheduling meeting");
    }
  }

  return (
    <div>
      <h1>Meeting Scheduler</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Day:
          <select value={day} onChange={e => setDay(e.target.value)}>
            {Object.keys(timings).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label>
          Time:
          <select value={time} onChange={e => setTime(e.target.value)}>
            {Object.keys(timings[day]).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <button type="submit">Schedule Meeting</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
};

export default MeetingScheduler;
