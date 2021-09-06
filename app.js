const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

const indexRouter = require('./routes/index');


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser());
app.use(session({
  secret: '8u54trgh9but349rgjoi53eigrpj4wegrjpo', 
  resave: false,
  saveUninitialized: false,
  name: 'nbaStatSession',
  cookie: { secure: false },
  store: new FileStore({}),
}));

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`server started PORT: ${PORT}`);
});
