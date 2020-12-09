import React, { useEffect, useState } from 'react'

import '../stylesheets/clock.css';


function Clock() {

    const [clock, setClock] = useState((new Date()).toLocaleTimeString())

    useEffect(() => {
        let clock_track = setInterval(() => {
            setClock((new Date()).toLocaleTimeString());
        }, 100)

        return (() => {
            clearInterval(clock_track);
        })
    });

    return (
        <div className="clock_container">
            <h3> {clock} </h3>
        </div>
    )
}

export default Clock
