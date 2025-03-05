require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));

app.set('view engine', 'ejs');


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));


app.get('/',function(req,res){
    res.render("login");
});




app.get('/login',function(req,res){
    res.render("login");
});



app.get('/signup',function(req,res){
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.redirect('/login');
  });

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      req.session.userId = user._id;
      res.redirect('/profile');
    } else {
      res.redirect('/login');
    }
  });

app.get('/profile', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    const user = await User.findById(req.session.userId);
    const messages = await Message.find({ receiverId: user.username });
    res.render('profile', { user, messages });
  });

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Could not log out.');
      }
      res.redirect('/login'); // Redirect to login page after logout
    });
  });

app.post('/send-message', async (req, res) => {
    const { receiverId, message, subject } = req.body;
    if (!req.session.userId) return res.redirect('/login');
    const newMessage = new Message({ senderId: req.session.userId, receiverId, subject, content: message });
    await newMessage.save();
    res.redirect('/profile');
  });


app.get('/send',function(req,res){
    res.render('send');
  });

app.listen(3000,function(req,res){
    console.log("Server is working");
});