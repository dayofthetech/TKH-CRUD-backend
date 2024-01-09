const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const PORT = 3000;


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());

app.post('/users',(req, res) => {
    console.log(req.body);;
})

app.listen(PORT, function() {
	console.log(`Server is live and update! Listening at port ${PORT}`);

})


