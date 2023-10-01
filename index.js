const express = require('express');
const app = express();
const port = 8080;

const db = require('./config/mongoose');

const ShortUrl = require('./models/shortUrl');

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({
        full: req.body.fullURL
    })
    return res.redirect('/');
})

app.get('/', async (req, res) => {
    const ShortUrlList = await ShortUrl.find({});
    return res.render('index', {shortUrls: ShortUrlList})
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrlData = await ShortUrl.findOne({short: req.params.shortUrl});
    if(shortUrlData == null){
        return res.render('notfound');
    }
    shortUrlData.clicks++;
    shortUrlData.save();
    return res.redirect(shortUrlData.full);
})

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
        return;
    }
    console.log(`Successfully running on port : ${port}`);
})