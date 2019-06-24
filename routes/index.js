var express = require('express');
var router = express.Router();
var fs = require('fs');

var file = "output.txt";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/great_news', function(req, res, next) {
  res.render('buy_me_a_coffee');
});
router.get('/privacy', function(req, res, next) {
  res.render('privacy');
});

router.get('/terms', function(req, res, next) {
  res.render('terms');
});

router.post('/emailswriter', function(req, res, next) {
	var body = req.body.name + ": " + req.body.email;
    fs.exists(file, function (exists) {
        if(!exists) {
        	create(body);
        	res.send('1')
        }
    	else {
    		rewrite(body, res);
    		res.send('1')
        }
	});
})

function create(str){
	fs.writeFile(file, str, function (err) {
        if (err) throw err;
        console.log('It\'s saved! in same location.');
    });
}

function rewrite(str, res){
	data = str + "\r\n";

	fs.readFile(file, 'utf8', function (err, output) {
		if(err) console.log(err);

		fs.appendFile(file, data, function (err) {
			if(err) console.log(err);
		});

	});
}

module.exports = router;
