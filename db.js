const mongoose = require('mongoose');
// const mongoURI = `mongodb+srv://c5xDnSBYgERXMvAY:Rahul2oo1@cluster0.qwhdvk4.mongodb.net/?retryWrites=true&w=majority`
const mongoURI = `mongodb+srv://NOTEBOXPROJECT:NOTEBOX@cluster0.s8ymqli.mongodb.net/?retryWrites=true&w=majority`

const connectToMongo = () => {
    mongoose.connect(mongoURI).then(() => {
        console.log("Connected to Mongo Successfully");
    })
    .catch(err=> console.log(err))
}
module.exports = connectToMongo;

// mongoose returns promises