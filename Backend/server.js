console.clear();

// File system
const fs = require('fs');
const process = require('process');


// Express
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors);

const port = process.env.PORT || 8080;

// Creating an http server for listening to request
const server = require("http").createServer(app);

// Creating a socket client attached to the server
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.end("App running");
})


// --------------    APP PROGEAMMING    ------------
// setting up demo data
let data = fs.readFileSync('data.json', 'utf-8');
data = JSON.parse(data);

// Sorting the Data ascendingly
function sortData() {
    data.buys.sort((a, b) => {
        return (a.price - b.price)
    })
    data.sells.sort((a, b) => {
        return (a.price - b.price)
    })
}
sortData();

// process an order
function processData(orderdata) {
    let type = orderdata.ordertype
    let quantity = orderdata.ordernumbers;
    let limit = orderdata.orderlimitprice;

    sortData();

    console.log(orderdata);

    if (type == "buy") {
        let buyingitem = data.buys[0];
        let itemindex = data.buys.indexOf(buyingitem);

        if (limit >= buyingitem.price && buyingitem.stock >= quantity) {
            data.buys[itemindex].stock -= Number(quantity);
            return "Buy Success";
        }
        else if (buyingitem.stock < quantity) {
            return 'outofstock';
        }
    }

    if (type == "sell") {
        let sellingitem = data.sells[data.sells.length - 1];
        let itemindex = data.sells.indexOf(sellingitem);

        if (limit <= sellingitem.price) {
            data.sells[itemindex].stock += Number(quantity);
            return "Sell Success";
        }
    }
    return "orderonhold";
}


// Socket connection initialization
let client = 0;
io.on("connection", (socket) => {
    console.log(socket.id);
    io.emit('orderdata', (data));

    // Process Order
    socket.on('order', orderdata => {
        // update the stocks
        let response = processData(orderdata);

        // Send data book updated
        io.emit('orderdata', (data));

        // response order hold 
        socket.emit('orderonhold', response);
    })
})

// Starting the server
server.listen(port, () => { })
