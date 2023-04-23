let express = require(`express`);
let app = express();
let port = 3000;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})


// Раздача статики
app.use(express.static(`public`));


// Настройка handlebars
const hbs = require('hbs');
app.set('views', 'views');
app.set('view engine', 'hbs');

//Подключение MongoBD
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/itube');

let videoSchema = new mongoose.Schema({
    title: String,
    author: String,
    preview: String,
    likes: Number,
    youtube: String
});
let video = mongoose.model('video',videoSchema);

let bloggerSchema = new mongoose.Schema({
    username: String,
    avatar: String,
    followers: Number
});
let blogger = mongoose.model('blogger',bloggerSchema);

app.get('/',async (req,res)=>{
    let data = await video.find()
                        .sort({likes: -1})
                        .limit(10);
    res.render('index',{data: data});
});


app.get('/video',async (req,res)=>{
    let id = req.query.id;
    let data = await video.findOne({_id: id});

    let array = await video.find({
        author: data.author,
        _id: {$ne: data._id}
    }).limit(3);

    res.render('video',{
        video: data,
        array: array
    });
});


app.get('/blogger',async (req,res)=>{
    let username = req.query.usename;
    let data = await blogger.findOne({
        username: username
    });
    let array = await video.find({
        author: username
    }).sort({likes: 1});
    
    res.render('blogger',{
        blogger: data,
        array: array
    });
}); 