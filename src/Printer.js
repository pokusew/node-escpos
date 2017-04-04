"use strict";

import qr from 'qr-image';
import iconv from 'iconv-lite';
import getPixels from 'get-pixels';
import Buffer from 'mutable-buffer';
import EventEmitter from 'events';
import Image from './Image';
import _ from './commands';


class Printer extends EventEmitter {

	constructor(adapter) {
		super();

		console.log('test');

		this.adapter = adapter;
		this.buffer = new Buffer();

		return this;

	}

	/**
	 * Fix bottom margin
	 * @param {[String]} size
	 */
	marginBottom(size) {
		this.buffer.write(_.MARGINS.BOTTOM);
		this.buffer.writeUInt8(size);
		return this;
	}

	/**
	 * Fix left margin
	 * @param  {[String]} size
	 */
	marginLeft(size) {
		this.buffer.write(_.MARGINS.LEFT);
		this.buffer.writeUInt8(size);
		return this;
	}

	/**
	 * Fix right margin
	 * @param  {[String]} size
	 */
	marginRight(size) {
		this.buffer.write(_.MARGINS.RIGHT);
		this.buffer.writeUInt8(size);
		return this;
	}

	/**
	 * Send data to hardware and flush buffer
	 * @param  {Function} callback
	 * @return printer instance
	 */
	flush() {

		const data = this.buffer.flush();

		console.log('data', data);

		const res = this.adapter.write(data);

		return res;

	}

	/**
	 * [function print]
	 * @param  {[String]}  content  [description]
	 * @param  {[String]}  encoding [description]
	 * @return printer instance
	 */
	print(content) {

		this.buffer.write(content);

		return this;
	}

	/**
	 * [function println]
	 * @param  {[String]}  content  [description]
	 * @param  {[String]}  encoding [description]
	 * @return printer instance
	 */
	println(content) {
		return this.print([content, _.EOL].join(''));
	}


	/**
	 * [function Print alpha-numeric text]
	 * @param  {[String]}  content  [description]
	 * @param  {[String]}  encoding [description]
	 * @return printer instance
	 */
	text(content, encoding) {

		console.log('juju');

		return this.print(iconv.encode(content + _.EOL, encoding || 'GB18030'));
	}

	/**
	 * [line feed]
	 * @param  {[type]}    lines   [description]
	 * @return {[Printer]} printer [description]
	 */
	feed(n) {

		this.buffer.write(new Array(n || 1).fill(_.EOL).join(''));

		return this.flush();
	}

	/**
	 * [feed control sequences]
	 * @param  {[type]}    ctrl     [description]
	 * @return printer instance
	 */
	control(ctrl) {

		this.buffer.write(_.FEED_CONTROL_SEQUENCES[
		'CTL_' + ctrl.toUpperCase()
			]);

		return this;

	}

	/**
	 * [text align]
	 * @param  {[type]}    align    [description]
	 * @return printer instance
	 */
	align(align) {

		this.buffer.write(_.TEXT_FORMAT['TXT_ALIGN_' + align.toUpperCase()]);

		return this;

	};

	/**
	 * [font family]
	 * @param  {[type]}    family  [description]
	 * @return {[Printer]} printer [description]
	 */
	font(family) {

		console.log('hej');

		this.buffer.write(_.TEXT_FORMAT[
		'TXT_FONT_' + family.toUpperCase()
			]);

		return this;

	}

	/**
	 * [font style]
	 * @param  {[type]}    type     [description]
	 * @return printer instance
	 */
	style(type) {

		switch (type.toUpperCase()) {

			case 'B':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
				break;
			case 'I':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
				break;
			case 'U':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
				break;
			case 'U2':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
				break;

			case 'BI':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
				break;
			case 'BIU':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
				break;
			case 'BIU2':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
				break;
			case 'BU':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
				break;
			case 'BU2':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
				break;
			case 'IU':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
				break;
			case 'IU2':
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
				break;

			case 'NORMAL':
			default:
				this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
				this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
				break;

		}

		return this;
	}

	/**
	 * [font size]
	 * @param  {[String]}  width   [description]
	 * @param  {[String]}  height  [description]
	 * @return {[Printer]} printer [description]
	 */
	size(width, height) {

		if (2 >= width && 2 >= height) {

			this.buffer.write(_.TEXT_FORMAT.TXT_NORMAL);

			if (2 == width && 2 == height) {
				this.buffer.write(_.TEXT_FORMAT.TXT_4SQUARE);
			}
			else if (1 == width && 2 == height) {
				this.buffer.write(_.TEXT_FORMAT.TXT_2HEIGHT);
			}
			else if (2 == width && 1 == height) {
				this.buffer.write(_.TEXT_FORMAT.TXT_2WIDTH);
			}

		}
		else {

			this.buffer.write(_.TEXT_FORMAT.TXT_SIZE);
			this.buffer.write(_.TEXT_FORMAT.TXT_WIDTH[(8 >= width) ? width : 8]);
			this.buffer.write(_.TEXT_FORMAT.TXT_HEIGHT[(8 >= height) ? height : 8]);

		}

		return this;

	}

	/**
	 * [set line spacing]
	 * @param  {[type]} n [description]
	 * @return {[type]}   [description]
	 */
	lineSpace(n) {
		if (n === undefined || n === null) {
			this.buffer.write(_.LINE_SPACING.LS_DEFAULT);
		} else {
			this.buffer.write(_.LINE_SPACING.LS_SET);
			this.buffer.writeUInt8(n);
		}
		return this;
	}

	/**
	 * [hardware]
	 * @param  {[type]}    hw       [description]
	 * @return printer instance
	 */
	hardware(hw) {

		this.buffer.write(_.HARDWARE['HW_' + hw]);

		return this.flush();

	}

	/**
	 * [barcode]
	 * @param  {[type]}    code     [description]
	 * @param  {[type]}    type     [description]
	 * @param  {[type]}    width    [description]
	 * @param  {[type]}    height   [description]
	 * @param  {[type]}    position [description]
	 * @param  {[type]}    font     [description]
	 * @return printer instance
	 */
	barcode(code, type, width, height, position, font) {
		if (width >= 1 || width <= 255) {
			this.buffer.write(_.BARCODE_FORMAT.BARCODE_WIDTH);
		}
		if (height >= 2 || height <= 6) {
			this.buffer.write(_.BARCODE_FORMAT.BARCODE_HEIGHT);
		}
		this.buffer.write(_.BARCODE_FORMAT[
		'BARCODE_FONT_' + (font || 'A').toUpperCase()
			]);
		this.buffer.write(_.BARCODE_FORMAT[
		'BARCODE_TXT_' + (position || 'BLW').toUpperCase()
			]);
		this.buffer.write(_.BARCODE_FORMAT[
		'BARCODE_' + ((type || 'EAN13').replace('-', '_').toUpperCase())
			]);
		this.buffer.write(code);
		return this;
	}

	/**
	 * [print qrcode]
	 * @param  {[type]} code    [description]
	 * @param  {[type]} version [description]
	 * @param  {[type]} level   [description]
	 * @param  {[type]} size    [description]
	 * @return {[type]}         [description]
	 */
	qrcode(code, version, level, size) {
		this.buffer.write(_.CODE2D_FORMAT.TYPE_QR);
		this.buffer.write(_.CODE2D_FORMAT.CODE2D);
		this.buffer.writeUInt8(version || 3);
		this.buffer.write(_.CODE2D_FORMAT[
		'QR_LEVEL_' + (level || 'L').toUpperCase()
			]);
		this.buffer.writeUInt8(size || 6);
		this.buffer.writeUInt16LE(code.length);
		this.buffer.write(code);
		return this;
	}

	/**
	 * [print qrcode image]
	 * @param  {[type]}   content  [description]
	 * @param  {[type]}   options  [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	qrimage(content, options, callback) {
		const self = this;
		if (typeof options == 'function') {
			callback = options;
			options = null;
		}
		options = options || { type: 'png', mode: 'dhdw' };
		const buffer = qr.imageSync(content, options);
		const type = ['image', options.type].join('/');
		getPixels(buffer, type, function (err, pixels) {
			if (err) return callback && callback(err);
			self.raster(new Image(pixels), options.mode);
			callback && callback.call(self, null, self);
		});
		return this;
	}

	/**
	 * [image description]
	 * @param  {[type]} image   [description]
	 * @param  {[type]} density [description]
	 * @return {[type]}         [description]
	 */
	image(image, density) {
		if (!(image instanceof Image))
			throw new TypeError('Only escpos.Image supported');
		density = density || 'd24';
		const n = !!~['d8', 's8'].indexOf(density) ? 1 : 3;
		const header = _.BITMAP_FORMAT['BITMAP_' + density.toUpperCase()];
		const bitmap = image.toBitmap(n * 8);
		const self = this;
		this.lineSpace(0); // set line spacing to 0
		bitmap.data.forEach(function (line) {
			self.buffer.write(header);
			self.buffer.writeUInt16LE(line.length / n);
			self.buffer.write(line);
			self.buffer.write(_.EOL);
		});
		// restore line spacing to default
		return this.lineSpace();
	}

	/**
	 * [raster description]
	 * @param  {[type]} image [description]
	 * @param  {[type]} mode  [description]
	 * @return {[type]}       [description]
	 */
	raster(image, mode) {

		if (!(image instanceof Image))
			throw new TypeError('Only escpos.Image supported');
		mode = mode || 'normal';
		if (mode === 'dhdw' ||
			mode === 'dwh' ||
			mode === 'dhw') mode = 'dwdh';
		const raster = image.toRaster();
		const header = _.GSV0_FORMAT['GSV0_' + mode.toUpperCase()];
		this.buffer.write(header);
		this.buffer.writeUInt16LE(raster.width);
		this.buffer.writeUInt16LE(raster.height);
		this.buffer.write(raster.data);
		return this;
	}

	/**
	 * [function Cut paper]
	 * @param  {[type]} part [description]
	 * @return printer instance
	 */
	cut(part, feed) {

		this.feed(feed || 3);

		this.buffer.write(_.PAPER[part ? 'PAPER_PART_CUT' : 'PAPER_FULL_CUT']);

		return this.flush();

	}

	/**
	 * [function Send pulse to kick the cash drawer]
	 * @param  {[type]} pin [description]
	 * @return printer instance
	 */
	cashdraw(pin) {

		this.buffer.write(_.CASH_DRAWER[
		'CD_KICK_' + (pin || 2)
			]);

		return this.flush();

	};

	// TODO close

}


export default Printer;
