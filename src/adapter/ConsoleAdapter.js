"use strict";


function stdout(data, bit) {

	bit = bit || 8;

	for (let i = 0; i < data.length; i += bit) {

		const arr = [];

		for (let j = 0; j < bit && i + j < data.length; j++) {
			arr.push(data[i + j]);
		}

		console.log(
			arr
				.map(b => b.toString(16).toUpperCase())
				.map(b => b.length === 1 ? '0' + b : b)
				.join(' ')
		);

	}

	console.log();

}


class ConsoleAdapter {

	constructor(handler) {
		this.handler = handler || stdout;
	}

	open() {
		return new Promise((resolve, reject) => {
			return resolve();
		});
	}

	write(data) {

		return new Promise((resolve, reject) => {

			this.handler && this.handler(data);

			return resolve();

		});

	}

}

export default ConsoleAdapter;
