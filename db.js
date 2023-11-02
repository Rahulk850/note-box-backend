const mongoose = require('mongoose');
const mongoURI = `mongodb+srv://rahulkumar8505067715:Rahul2oo1@cluster0.qwhdvk4.mongodb.net/?retryWrites=true&w=majority`
const connectToMongo = () => {
    mongoose.connect(mongoURI).then(() => {
        console.log("Connected to Mongo Successfully");
    })
    .catch(err=> console.log(err))
}
module.exports = connectToMongo;

// mongoose returns promises