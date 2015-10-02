var util = require('util'),
    rss = require('parserss'),
    express = require('express'),
    md = require('to-markdown'),
    app = express();

var svbtle_url = 'https://%s.svbtle.com/feed';

function parseArticle (article) {
    var title = article.title,
        content = article.description,
        markdown = md(content),
        author = article.author,
        timestamp = article.date.valueOf(),
        url = article.link;

    return {
        title: title,
        content: content,
        markdown: markdown,
        author: author,
        timestamp: timestamp,
        url: url
    };
}

function getRSSFeed (username, limit, callback) {
    var url = util.format(svbtle_url, username);

    rss(url, limit, function (err, data) {
        callback(err, data);
    });
}

function handleError (res, err, data) {
    if (err) {
        res.status(500).send();
        return true;
    }

    if (data.articles && data.articles.length < 1) {
        res.status(404).send();
        return true;
    }
}

app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/:username/latest', function (req, res) {
    getRSSFeed(req.params.username, 1, function (err, data) {
        if (handleError(res, err, data)) return;
        res.json(parseArticle(data.articles[0]));
    });
});

app.get('/:username/latest/:number', function (req, res) {
    if (('' + parseFloat(req.params.number)) !== req.params.number) {
        res.status(400).send();
        return;
    }

    getRSSFeed(req.params.username, +req.params.number, function (err, data) {
        if (handleError(res, err, data)) return;
        res.json(data.articles.map(parseArticle));
    });
});

app.get('ping', function (req, res) {
    res.send('pong');
});

app.listen(process.env.PORT);
