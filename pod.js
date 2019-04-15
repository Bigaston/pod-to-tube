var Jimp = require('jimp');

Jimp.read('./assets/background.png', (err, back) => {
	if (err) throw err;

	Jimp.read("https://image.ausha.co/pL9cqbTR4kI6ciNduKKX9Q29nECTCmUrjXxIa4uC_1400x1400.jpeg?t=1555156194", (err, logo) => {
		if (err) throw err;

		logo.resize(600,600);

		for (x = 0; x < 600; x++) {
			for (y = 0; y < 600; y++) {
				//console.log(logo.getPixelColor(x, y))
				back.setPixelColor(logo.getPixelColor(x, y), x+100, y+260)
			}
		}

		Jimp.loadFont("./assets/title.fnt", (err, font) => {
			if (err) console.log(err);
			back.print(font, 730, 300, 'Noix Noire : Bombsliger');

			Jimp.loadFont("./assets/subtitle.fnt", (err, font) => {
				if (err) console.log(err);
				back.print(font, 730, 370, 'La Chronique de Bigaston');

				back.write("./export/background.png");
			})

		})
	})
});

