const express = require('express');

import { register, login, logout } from './routes/v1/auth_router';

import { auth, noauth } from './middleware/auth';

const v1 = new express.Router();

v1.post('/register', noauth, register);
v1.post('/login', noauth, login);
v1.post('/logout', auth, logout);

export default v1;