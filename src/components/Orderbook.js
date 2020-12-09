import React, { useEffect, useState } from 'react'
import '../stylesheets/orderbook.css'

import { socket } from '../modules/socketClient';

export default function Orderbook() {
    const [bids, setBids] = useState("");
    const [asks, setAsks] = useState("");

    function setData(data) {
        // Get Best Buy
        let buystats = {};
        buystats.prices = data.buys.map(item => item.price);
        buystats.min = Math.min(...buystats.prices);
        buystats.indexMin = buystats.prices.lastIndexOf(buystats.min);

        // Get Best Sell Statistic
        let sellstats = {};
        sellstats.prices = data.sells.map(item => item.price);
        sellstats.max = Math.max(...sellstats.prices);
        sellstats.indexMax = sellstats.prices.lastIndexOf(sellstats.max);

        let buys = data.buys.map((item, index) => {
            let bestclass = "";
            bestclass = (item.price == buystats.min ?
                ("bestoption") : (""))

            return (
                <div key={index}
                    className={"ordercontent " + bestclass}>
                    <p className={"orderstock " + bestclass}> {item.stock} </p>
                    <p className={"separator" + bestclass}> : </p>
                    <p className={"orderprice " + bestclass}> {item.price} $ </p>
                </div>
            )
        })
        let sells = data.sells.map((item, index) => {
            let bestclass = "";
            bestclass = (item.price == sellstats.max ?
                ("bestoption") : (""))

            return (
                <div key={index}
                    className={"ordercontent " + bestclass}>
                    <p className={"orderstock " + bestclass}> {item.stock} </p>
                    <p className={"separator" + bestclass}> : </p>
                    <p className={"orderprice " + bestclass}> {item.price} $ </p>
                </div>
            )
        })
        // Updating the Sells
        setBids(sells);

        // Updating the Buys
        setAsks(buys);
    }

    // Load current market data on connection
    useEffect(() => {

        // Load data
        socket.on('orderdata', data => {
            setData(data);
        })
        return (() => {
            socket.off('orderdata');
            socket.off('newdata');
            socket.disconnect();
        })
    }, [])

    return (
        <div className='orderbook_container'>
            <div className='orderbuy'>
                <h4 className="orderheader"> Order Asks </h4>
                <div className='orderbuyheader'>
                    <h4> Stocks </h4>
                    <h4> Prices </h4>
                </div>
                <hr className="lineseparator" />
                {asks}
            </div>
            <div className='ordersell'>
                <h4 className="orderheader"> Order Bids </h4>
                <div className='orderbuyheader'>
                    <h4> Stocks </h4>
                    <h4> Prices </h4>
                </div>
                <hr className="lineseparator" />
                {bids}
            </div>
        </div>
    )
}
