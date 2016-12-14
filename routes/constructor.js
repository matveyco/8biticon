var express = require('express');
var router = express.Router();
var im = require('imagemagick');
var uuid = require('node-uuid');
var fs = require('fs');
var path = require("path");

var structure = require('../public/static/8bit/js/8settings.json');

/* GET home page. */
router.post('/download', function(req, res, next) {
	var data = req.body.data || {},
			gender = ['male', 'female'].indexOf(req.body.gender) === -1
				? 'male'
				: req.body.gender;

		try {
			data = JSON.parse(data);
		} catch (e) {}

		var image_dir = path.join(__dirname, '../', '/public/static/8bit/img/') + gender + '/',
			output_image = path.join(__dirname, '../', '/public/static/media/') + uuid.v1() + '.jpg',
			command = ['-size', '400x400', 'xc:white'];

		structure[gender].slice(0).reverse().forEach(function (layer) {
			command.push(image_dir + layer.name + (data[layer.name] || 1) + '.png', '-composite');
		});

		command.push('-fill', 'white', '-draw', 'rectangle 0,388 400,400');
		command.push('-fill', '#636363', '-pointsize', '10', "-font", "DejaVu-Sans", '-draw', 'gravity NorthWest text 290,388 \'made by 8biticon.com\'');
		command.push(output_image);

		im.convert(command, function (err, stdout, stderr) {
			if (err) {
				throw err;
			}

			res.download(output_image, '8biticon.jpg', function () {
				fs.unlink(output_image);
			});
	});
});

module.exports = router;
