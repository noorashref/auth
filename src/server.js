const express = require('express');
const bodyParser = require('body-parser');
const AuthSDK = require('./index');
const path = require('path');

const app = express();
const auth = new AuthSDK();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use('/auth', auth.router());

app.get('/profile', auth.authenticate.bind(auth), (req, res) => {
  res.json({ user: req.user.username });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Auth server listening on port ${port}`);
});
