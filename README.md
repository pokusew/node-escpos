# ESCPOS

[![npm](https://img.shields.io/npm/v/@pokusew/escpos.svg?maxAge=2592000)](https://www.npmjs.com/package/@pokusew/escpos)
[![escpos channel on discord](https://img.shields.io/badge/discord-join%20chat-61dafb.svg)](https://discord.gg/bg3yazg)

ESC/POS Printer driver for Node.js


## Installation

Using npm

````bash
npm install @pokusew/escpos --save
````

If you use USBAdapter:

+ On Linux, you'll need `libudev` to build libusb.
+ On Ubuntu/Debian: `sudo apt-get install build-essential libudev-dev`.
+ On Windows, Use [Zadig](http://sourceforge.net/projects/libwdi/files/zadig/) to install the WinUSB driver for your USB device.

Otherwise you will get `LIBUSB_ERROR_NOT_SUPPORTED` when attempting to open devices.

## Example

````javascript

````

## API


### USBAdapter

#### open


### Printer


#### text("text")

Prints raw text. Raises TextError exception.

#### control("align")

Carrier feed and tabs.

align is a string which takes any of the following values:

+ LF for Line Feed
+ FF for Form Feed
+ CR for Carriage Return
+ HT for Horizontal Tab
+ VT for Vertical Tab


#### align("align")

Set text properties.

align set horizontal position for text, the possible values are:

+ CENTER
+ LEFT
+ RIGHT

Default: left

font type could be A or B. Default: A
width is a numeric value, 1 is for regular size, and 2 is twice the standard size. Default: 1
height is a numeric value, 1 is for regular size and 2 is twice the standard size. Default: 1

#### barcode("code", "barcode_type", width, height, "position", "font")

Prints a barcode.

code is an alphanumeric code to be printed as bar code
barcode_type must be one of the following type of codes:

+ UPC-A
+ UPC-E
+ EAN13
+ EAN8
+ CODE39
+ ITF
+ NW7

width is a numeric value in the range between (1,255) Default: 64
height is a numeric value in the range between (2,6) Default: 3
position is where to place the code around the bars, could be one of the following values:

+ ABOVE
+ BELOW
+ BOTH
+ OFF

Default: BELOW

font is one of the 2 type of fonts, values could be:

+ A
+ B

Default: A

Raises BarcodeTypeError, BarcodeSizeError, BarcodeCodeError exceptions.

#### cut("mode")

Cut paper.

mode set a full or partial cut. Default: full
Partial cut is not implemented in all printers.

#### cashdraw(pin)

Sends a pulse to the cash drawer in the specified pin.

pin is a numeric value which defines the pin to be used to send the pulse, it could be 2 or 5.
Raises `CashDrawerError()``


## Thanks

+ Part of code from [@taoyuan](https://github.com/taoyuan)


## Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3


## License

[MIT](/LICENSE.md)
