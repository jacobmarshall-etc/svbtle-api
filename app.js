var util = require('util'),
    rss = require('parserss'),
    express = require('express'),
    app = express();

var svbtle_url = 'https://%s.svbtle.com/feed';

function parseArticle (article) {
    var title = article.title,
        content = article.description,
        author = article.author,
        url = article.link;

    return {
        title: title,
        content: content,
        author: author,
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

app.get('/:username/latest', function (req, res) {
    //console.log(res);
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

app.listen(process.env.PORT);
