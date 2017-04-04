"use strict";

import { Printer, USBAdapter, ConsoleAdapter } from '../src';

const device = new USBAdapter();
const printer = new Printer(device);

device
	.open()
	.then(() => {

		printer
			.font('a')
			.align('ct')
			.style('bu')
			.size(1, 1)
			.text('The quick brown fox jumps over the lazy dog')
			.text('敏捷的棕色狐狸跳过懒狗')
			.barcode('12345678', 'EAN8')
			.cut();

	});
