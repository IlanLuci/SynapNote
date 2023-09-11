// Status Codes:
// 200 -> success
// 201 -> created successfully
// 401 -> invalid auth
// 403 -> forbidden
// 409 -> unique field already in use
// 422 -> incomplete or invalid information submitted
// 500 -> any server errors such as database problems

const cookieParser = require('cookie-parser');
const express = require('express');
const nunjucks = require('nunjucks')

nunjucks.configure({ autoescape: true });

import requestMethod from './middleware/requestMethod';
import v1 from './v1';

const port = 3000;
const app = express();

nunjucks.configure('static', {
    autoescape: true,
    express: app
});

app.get('/', function(req, res) {
    res.render('index.html');
});
app.get('/register', function(req, res){
    res.render('register.html')
});
app.get('/login', function(req, res){
    res.render('login.html')
});

app.use(express.static('static'))
app.use(express.json());
app.use(cookieParser());
app.use(requestMethod)

app.use('/api/v1', v1);

// start http server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});