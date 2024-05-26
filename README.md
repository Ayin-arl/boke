# 博客系统实验报告
## 我的博客系统
## 介绍

      使用css，html,javascript编写的博客系统

## 主要功能
      1.对文章的增删改查
      2.文章主要内容显示与html化

## 代码及实现过程
### 基础功能
#### 数据库
```js
mongoose.connect('mongodb://my-mongo/Chentingyu');
const articleSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: {type: Date, default: Date.now},
    markdown:String,
    html:String
});
```
通过mongose链接数据库。

#### 创建新文章
```ejs
<form action="/new" method="POST">

    <div>
    <label for="title">Title</label>
    <input required type="text" name="title" id="title" class="form-control">
    </div>

    <div>
    <label for="description">Description</label>
    <textarea name="description" id="description" class="form-control"></textarea>
    </div>

    <div>
    <label for="markdown">Markdown</label>
    <textarea name="markdown" id="markdown" class="form-control"></textarea>
    </div>

    <a href="/"  class="btn btn-secondary">Cancel</a>
    <button type="submit" class="btn btn-primary">Save</button>
    </form>
```
```js
app.get('/new', (req, res) => {
  res.render('new');
})
```
以表单形式创建文章，通过post方式将表单传递到数据库。
#### 更改文章内容
```ejs
 <form action="/<%= article._id %>?_method=PUT" method="POST">
      <div>
      <label for="title">Title</label>
      <input required value="<%= article.title %>" type="text" name="title" id="title" class="form-control">
      </div>

      <div>
      <label for="description">Description</label>
      <textarea name="description" id="description" class="form-control"><%= article.description %></textarea>
      </div>

      <div>
      <label for="markdown">Markdown</label>
      <textarea name="markdown" id="markdown" class="form-control"><%= article.markdown %></textarea>
      </div>

      <a href="/" class="btn btn-secondary">Cancel</a>
      <button type="submit" class="btn btn-primary">Save</button>
    </form>
```
```js
app.get('/edit/:id', async (req, res) => {
    const one = await article.findOne({ _id: req.params.id });
    res.render('edit', { article: one })
})
```
通过put的形式将更改后的表单传递至数据库。
#### 查看文章
```js
app.get('/display/:id', async (req, res) => {
  const one = await article.findOne({ _id: req.params.id });
  res.render('display', { article: one });
})
```
直接在display界面输出文章所有内容。
#### 删除文章
```ejs
<form action="/<%= article._id %>?_method=DELETE" method="POST" class="d-inline">
            <button type="submit" class="btn btn-danger">Delete</button>
```
```js
app.delete('/:id', async (req, res) => {
  await article.deleteMany({ _id: req.params.id });
  res.redirect('/')
})
```
all.ejs文件中显示删除按钮，js文件中通过delete方式删除该文章id下的所有内容。
### 其他功能
#### 将文章按时间倒序排列
```js
app.get('/', async (req, res) => {
  const all = await article.find().sort({createdAt:'desc'});
  res.render('all', { articles: all })
})
```
通过获取各个文章的创建时间并按照倒序排列。
#### 显示转译成html形式的markdown
```js
articleSchema.pre('validate', function(next) {
  if (this.markdown) {
    this.html = marked(this.markdown)
  }

  next()
})
```
```ejs

```
其中pre代表此过程在所有过程中优先级最高，检测markdown内容并通过marked函数转译为html。
## 工作量统计
| 工作量统计表  |  基础功能    | 新增功能1    |   新增功能2    | 新增功能3   |
| -----------  | ----------- | ----------- | -----------    | ----------- | 
 描述 | 文章数据增删查改|css美化|markdown添加|markdown转译为html表示
| 学时 | 8 | 3|1 | 1 
