const mongoose = require('mongoose')

var listSchema = new mongoose.Schema({
    items:[
        {
            item: String,
            quantity: Number
        }
    ],
    deliveryDate: Date,
    status: Number // 0/ 1 / 2
})

const List = mongoose.model("List", listSchema)
module.exports = List