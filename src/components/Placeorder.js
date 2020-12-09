import React, { useEffect, useState } from 'react'
import { socket } from '../modules/socketClient';

import '../stylesheets/placeorder.css'

export default function Placeorder() {

    const [ordernumbers, setOrdernumbers] = useState();
    const [orderlimitprice, setOrderlimitprice] = useState();
    const [ordertype, setOrdertype] = useState("")

    const [orderstatus, setOrderstatus] = useState("");
    const [orderonhold, setOrderonhold] = useState(false);

    // Update input handler
    function updateInput(name, value) {
        if (name == 'numberoforders') {
            try {
                setOrdernumbers(parseInt(value, 10))
            } catch (e) { }

        }
        if (name == 'limitprice') {
            try {
                setOrderlimitprice(parseFloat(value));
            } catch (e) { }

        }
    }

    // Place order handler
    function placeOrder(e) {
        let orderdata = {
            ordertype,
            ordernumbers,
            orderlimitprice,
        }
        if (ordertype && orderlimitprice && ordernumbers) {
            socket.emit('order', orderdata);
        }
        else {
            alert("Please declare all parameters!");
        }
    }

    function processStoporder() {
        // PROCESSIONS STOP
        setOrderonhold(false);
    }


    useEffect(() => {
        let statustrack;
        try {
            clearTimeout(statustrack);
        } catch (e) { }

        socket.on('orderonhold', res => {
            setOrderonhold(res == "orderonhold");
            setOrderstatus(res);

            statustrack = setTimeout(() => {
                setOrderstatus("");
            }, 2000);
        })
    }, [])

    return (
        <div className="placeorder_container">
            <form className="placeorder_form" method='POST' action=''>
                <div>
                    <label> Number of Orders </label>
                    <input type="number"
                        name='numberoforders'
                        value={ordernumbers}
                        onChange={e => { updateInput(e.target.name, e.target.value) }}
                    />
                </div>
                <div>
                    <label> Limit Price </label>
                    <input type="number"
                        name='limitprice'
                        value={orderlimitprice}
                        onChange={e => { updateInput(e.target.name, e.target.value) }}
                    />
                </div>
                <div>
                    <label>
                        <span> Choose order type </span>
                        <div className="radiocontainer"
                            onChange={(e) => setOrdertype(e.target.value)}>

                            <label htmlFor="order_buy"> Buy </label>
                            <input id="order_buy" type="radio" name="type" value="buy" />

                            <label htmlFor="order_sell"> Sell </label>
                            <input id="order_sell" type="radio" name="type" value="sell" />

                        </div>
                    </label>
                </div>
            </form>

            <input
                onClick={placeOrder}
                value="Place Order"
                type='button'
            />
            {
                orderonhold ?
                    <div style={{ float: "right" }}>
                        holding order until next limit price
                        <input
                            onClick={processStoporder}
                            value="Stop Order"
                            type='button'
                        />
                    </div>
                    :
                    ""
            }
            {
                (orderstatus && !orderonhold) ?
                    (<p style={{ float: 'right', marginRight: '40px', color: "rgb(41, 212, 41)", fontSize: '15pt', fontWeight: '500' }}>
                        {orderstatus}
                    </p>)
                    :
                    ""
            }
            <br />
            <br />
        </div >
    )
}
