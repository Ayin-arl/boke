const express = require('express');
const app = express();
const marked=require('marked');

const mongoose = require('mongoose');
mongoose.connect('mongodb://my-mongo/Chentingyu');
const articleSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: {type: Date, default: Date.now},
    markdown:String,
    html:String
});

articleSchema.pre('validate', function(next) {
  if (this.markdown) {
    this.html = marked(this.markdown)
  }

  next()
})

const article = mongoose.model('article', articleSchema);

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const all = await article.find().sort({createdAt:'desc'});
  res.render('all', { articles: all })
})

app.get('/new', (req, res) => {
  res.render('new');
})

app.get('/display/:id', async (req, res) => {
  const one = await article.findOne({ _id: req.params.id });
  res.render('display', { article: one });
})

app.get('/edit/:id', async (req, res) => {
    const one = await article.findOne({ _id: req.params.id });
    res.render('edit', { article: one })
})

app.use(express.urlencoded({ extended: false }))

app.post('/new', async (req,res) => {
    one = new article({ title: req.body.title, description: req.body.description,markdown:req.body.markdown });
    await one.save();
    res.render('display', { article: one })
})

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.delete('/:id', async (req, res) => {
  await article.deleteMany({ _id: req.params.id });
  res.redirect('/')
})

app.put('/:id', async (req, res) => {
    let data = {}
    data.title = req.body.title
    data.description = req.body.description
    data.markdown=req.body.markdown

    var one = await article.findOne({ _id: req.params.id });
    if (one != null) {
        one.title = data.title;
        one.description = data.description;
        one.markdown=data.markdown;
        await one.save();       
    }  
    res.redirect(`/display/${req.params.id}`);
})

app.listen(12316)