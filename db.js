const mongoose = require('mongoose');
const mongoURI = `mongodb+srv://rahulkumar8505067715:Rahul2001@cluster0.qwhdvk4.mongodb.net/?retryWrites=true&w=majority`
const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Mongo Successfully");
    })
}
module.exports = connectToMongo;


// mongoose returns promises