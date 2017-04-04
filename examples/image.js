"use strict";

import { USBAdapter, Printer, Image } from '../src';


const device = new USBAdapter();
const printer = new Printer(device);

Image.load(__dirname + '/tux.png', function (image) {

	device.open(function () {

		printer
			.align('ct')

			.image(image, 's8')
			//.image(image, 'd8')
			//.image(image, 's24')
			//.image(image, 'd24')

			//.raster(image)
			//.raster(image, 'dw')
			//.raster(image, 'dh')
			//.raster(image, 'dwdh')

			.cut();

	});

});
