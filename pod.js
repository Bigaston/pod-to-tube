var Jimp = require('jimp');
const config = require("./config.json")
var express = require('express');
var Parser = require('rss-parser');
const fetch = require('node-fetch');
var download = require('download-file')
var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
var command = ffmpeg();

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post("/start", function(req, res) {
	let parser = new Parser();
	parser.parseURL(req.body.rss, function(err, feed) {
			console.log("Flux récupéré")
			console.log("Image en cours de création")
			createImage(feed.items[req.body.ep], feed.title);
			res.send("Flux envoyé au serveur. Episode : " + feed.items[req.body.ep].title)

		}
	)
})

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/web/index.html")
})

function createImage(episode, title) {
	Jimp.read('./assets/background.png', (err, back) => {
		if (err) throw err;
	
		Jimp.read(episode.itunes.image, (err, logo) => {
			if (err) throw err;
	
			logo.resize(600,600);
	
			console.log("> Début de la copie du logo")
			for (x = 0; x < 600; x++) {
				for (y = 0; y < 600; y++) {
					back.setPixelColor(logo.getPixelColor(x, y), x+100, y+260)
				}
			}

			console.log("> Fin de la copie du logo")
	
			text_line = 0

			Jimp.loadFont("./assets/title.fnt", (err, font) => {
				if (err) console.log(err);
				if (730 + Jimp.measureText(font, episode.title) > 1600) {
					splited = episode.title.split(" ");
					chaine = "";
					for (i = 0; i < splited.length; i++) {
						if (730 + Jimp.measureText(font, chaine) > 1600) {
							back.print(font, 730, 300 + text_line * 64, chaine);
							text_line++;
							chaine = "";
						}

						chaine = chaine + splited[i] + " ";
					}
					back.print(font, 730, 300 + text_line * 64, chaine);
					text_line++;
				} else {
					back.print(font, 730, 300, episode.title);
					text_line++;
				}
				console.log("> Ecriture du titre : " + episode.title)
	
				Jimp.loadFont("./assets/subtitle.fnt", (err, font) => {
					if (err) console.log(err);

					if (730 + Jimp.measureText(font, title) > 1600) {
						splited = title.split(" ");
						chaine = "";
						for (i = 0; i < splited.length; i++) {
							if (730 + Jimp.measureText(font, chaine) > 1600) {
								back.print(font, 730, 300 + text_line * 64, chaine);
								text_line++;
								chaine = "";
							}
	
							chaine = chaine + splited[i] + " ";
						}
						back.print(font, 730, 300 + text_line * 64, chaine);
						text_line++;
					} else {
						back.print(font, 730, 300 + text_line * 64, title);
						text_line++;
					}
					console.log("> Ecriture du nom du podcast : " + title)
	
					back.write("./export/background.png");
					console.log("> Image sauvegardée")
					dlAudio(episode, title)
				})
	
			})
		})
	});	
}

function dlAudio(episode, title) {
	console.log("Génération de la vidéo")
	console.log("> Démarage du téléchargement de l'audio")
	fetch(episode.enclosure.url).then(response => {
		download(response.url, {directory: "./export/",filename: "audio.mp3"}, function(err){
			if (err) throw err
			console.log("> Fin du téléchargement de l'audio")
			createVideo(episode, title);
		})
	})
}

var timemark = null;

function createVideo(episode, title) {
	console.log("Création de la vidéo")
	command
		.on('end', onEnd )
		.on('progress', onProgress)
		.on('error', onError)
		.input("./export/background.png")
		.loop(1)
		.input('./export/audio.mp3')
		.output('./export/video.mp4')
		.outputFPS(30)
		.run();
}

function onProgress(progress){
	if (progress.timemark != timemark) {
		timemark = progress.timemark;
		console.log('Time mark: ' + timemark + "...");
	}
}
   
function onError(err, stdout, stderr) {
	console.log('Cannot process video: ' + err.message);
}
   
function onEnd() {
	console.log('Finished processing');
}

app.listen(config.port);