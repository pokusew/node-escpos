'use strict';

import getPixels from 'get-pixels';


class Image {

	get size() {

		return {
			width: this.pixels.shape[0],
			height: this.pixels.shape[1],
			colors: this.pixels.shape[2],
		};

	}

	constructor(pixels) {

		this.pixels = pixels;

		this.data = [];

		function rgb(pixel) {
			return {
				r: pixel[0],
				g: pixel[1],
				b: pixel[2],
				a: pixel[3]
			};
		}


		for (let i = 0; i < this.pixels.data.length; i += this.size.colors) {
			this.data.push(rgb(new Array(this.size.colors).fill(0).map((_, b) => this.pixels.data[i + b])));
		}

		this.data = this.data.map((pixel) => {
			if (pixel.a == 0) return 0;
			return pixel.r !== 0xFF || pixel.g !== 0xFF || pixel.b !== 0xFF ? 1 : 0;
		});

	}


	static load(url, type, callback) {

		if (typeof type === 'function') {
			callback = type;
			type = null;
		}

		getPixels(url, type, function (err, pixels) {
			if (err) return callback(err);
			callback(new Image(pixels));
		});

	}

	toBitmap(density) {

		density = density || 24;

		let ld;
		const result = [];
		let x, y, b, l, i;
		const c = density / 8;

		// n blocks of lines
		const n = Math.ceil(this.size.height / density);

		for (y = 0; y < n; y++) {
			// line data
			ld = result[y] = [];

			for (x = 0; x < this.size.width; x++) {

				for (b = 0; b < density; b++) {
					i = x * c + (b >> 3);

					if (ld[i] === undefined) {
						ld[i] = 0;
					}

					l = y * density + b;
					if (l < this.size.height) {
						if (this.data[l * this.size.width + x]) {
							ld[i] += (0x80 >> (b & 0x7));
						}
					}
				}
			}
		}

		return {
			data: result,
			density: density
		};

	}


	toRaster() {

		const result = [];
		const width = this.size.width;
		const height = this.size.height;
		const data = this.data;

		// n blocks of lines
		const n = Math.ceil(width / 8);
		let x, y, b, c, i;

		for (y = 0; y < height; y++) {

			for (x = 0; x < n; x++) {

				for (b = 0; b < 8; b++) {
					i = x * 8 + b;

					if (result[y * n + x] === undefined) {
						result[y * n + x] = 0;
					}

					c = x * 8 + b;
					if (c < width) {
						if (data[y * width + i]) {
							result[y * n + x] += (0x80 >> (b & 0x7));
						}
					}
				}
			}
		}

		return {
			data: result,
			width: n,
			height: height
		};

	}

}


export default Image;
