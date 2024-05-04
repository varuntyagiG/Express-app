const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Chat = require('./models/chats.js');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'public')));     // this is used to connect public(style.css) file to index.ejs
app.use(express.urlencoded({extended : true}));


let port = 8080;

app.listen(port,()=>{
    console.log('listen along the port 8080');
});

// const chat1 = new Chat({
//     from : 'Varun',
//     to : 'Anjali',
//     mssege : 'Hey! How are you ?',
//     created_at : new Date()
// });
// chat1.save().then((res)=>{
//     console.log(res);
// }).catch((err)=>{
//     console.log(err);
// });


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}
main().then((res)=>{
    console.log('Connected succesfully');
}).catch((err)=>{
    console.log(err);
})


app.get('/',(req,res)=>{
    res.send("server work");
})

// index route

app.get('/chats',async (req,res)=>{
    let chats = await Chat.find();
    console.log(chats);
    res.render('index.ejs',{chats});
});

// new route
app.get('/chats/new',(req,res)=>{
    res.render("new.ejs");
})

// create route
app.post('/chats',(req,res)=>{
    let{from,to,msg} = req.body;
    let newchat = new Chat({
        from : from,
        to : to,
        mssege : msg,
        created_at : new Date()
    })
    newchat.save().then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    });
    res.redirect('/chats');
});







