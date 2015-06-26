var util = require('util'),
    rss = require('parserss'),
    express = require('express'),
    app = express();

var svbtle_url = 'https://%s.svbtle.com/feed';

app.get('/:username/latest', function (req, res) {
    var username = req.params.username,
        url = util.format(svbtle_url, username);

    rss(url, 1, function (err, data) {
        if (err) {
            res.status(500).send();
            return;
        }

        if (data.articles && data.articles.length < 1) {
            res.status(404).send();
            return;
        }

        var article = data.articles[0],
            title = article.title,
            content = article.description,
            author = article.author,
            url = article.link;

        res.json({
            title: title,
            content: content,
            author: author,
            url: url
        });
    });
});

app.listen(process.env.PORT);
