const express = require('express');
// const authRoutes = require('./src/routes/authRoutes')
const adminRoutes = require('./src/routes/adminRoutes');
const pageRoutes = require('./src/routes/pageRoutes');
//const createEmail = require('./src/controllers/withoutexpress')
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const session = require('express-session');
const app = express();
//const sql = require('./controllers/sql');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded({
//     extended: false
// }));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: 'realEstate'
}));


const port = process.env.PORT || 5000;

//app.use('/register', authRoutes);




// app.get('/testconnection', (req, res) => {
//     sql.connect().then(() => {
//         res.send('connected');
//     }).catch(error => {
//         res.send(error);
//     })
// });


// app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', pageRoutes);

app.listen(port, () => {
    console.log(`App listening on ${port}!`);
});