"use strict";

import { Printer, USBAdapter, ConsoleAdapter, Image } from '../../src/index';

const adapter = new USBAdapter();

adapter.open().then(() => {

	const printer = new Printer(adapter);

	// printer
	// 	.font('a')
	// 	.align('ct')
	// 	.style('bu')
	// 	.size(1, 1)
	// 	.text('The quick brown fox jumps over the lazy dog')
	// 	.print('jjuju')
	// 	.print('jjuju')
	// 	.print('jjuju')
	// 	.print('jjuju')
	// 	.print('jjuju')
	// 	.print('jjuju')
	// 	.print('jjuju');

	Image.load(__dirname + '/nfctron_printer.png', function (image) {

		printer
			.align('ct')
			.raster(image)
			.cut();

	});

});


