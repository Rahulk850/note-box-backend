const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();

const app = express();
const port = 5001;

app.use(cors())
app.use(express.json());// middleware

// app.get('/', (req, res) => {
//   res.send('Hello Rahul  bhGGGGGGG')
// })
// app.get('/api/login', (req, res) => {
//   res.send('Hello login !')
// })


// Available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
