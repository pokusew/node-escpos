"use strict";

import EventEmitter from 'events';
import os from 'os';
import usb from 'usb';


/**
 * [USB Class Codes]
 * @type {Object}
 * @docs http://www.usb.org/developers/defined_class
 */
const CLASS_CODE = {
	AUDIO: 0x01,
	HID: 0x03,
	PRINTER: 0x07,
	HUB: 0x09
};

function isSupportedDevice(device) {

	try {

		// tests if the device has any printer interfaces
		return !!device.configDescriptor.interfaces.filter(ifaces => !!ifaces.filter(iface => iface.bInterfaceClass === CLASS_CODE.PRINTER).length).length;

		// console.log('test result', test, device.deviceDescriptor.idVendor);

	} catch (err) {

		// console.log('test error');

		return false;
	}

}


function findSupportedDevices() {

	const devices = usb.getDeviceList();

	return devices.filter((device) => isSupportedDevice(device));

}

class USBAdapter extends EventEmitter {

	constructor() {
		super();

		if (arguments.length === 2) {

			const [vid, pid] = arguments;

			this.device = usb.findByIds(vid, pid);

		} else if (arguments.length === 1) {

			const [device] = arguments;

			this.device = device;

		} else if (arguments.length < 1) {

			const devices = findSupportedDevices();

			if (devices.length > 0) {
				this.device = devices[0];
			}

		}

		if (!this.device) {
			throw new Error('Cannot find any supported device.');
		}

	}

	open() {

		return new Promise((resolve, reject) => {

			try {

				this.device.open();

				this.device.interfaces.forEach((iface) => {

					iface.setAltSetting(iface.altSetting, () => {

						// http://libusb.sourceforge.net/api-1.0/group__dev.html#gab14d11ed6eac7519bb94795659d2c971
						// libusb_kernel_driver_active / libusb_attach_kernel_driver / libusb_detach_kernel_driver : "This functionality is not available on Windows."
						if ('win32' !== os.platform()) {

							if (iface.isKernelDriverActive()) {

								try {
									iface.detachKernelDriver();
								} catch (err) {
									console.error('[ERROR] Could not detatch kernel driver: %s', err);
								}

							}

						}

						iface.claim(); // must be called before using any endpoints of this interface

						iface.endpoints.filter((endpoint) => {
							if (endpoint.direction === 'out') {
								this.endpoint = endpoint;
								resolve();
							}
						});

						if (!this.endpoint) {
							throw new Error('Can not find endpoint from printer');
						}

					});

				});

			} catch (err) {

				reject(new Error('Opening device error', err));

			}

		});

	}

	write(data) {

		return new Promise((resolve, reject) => {

			this.endpoint.transfer(data, (err, res) => {

				if (err) {
					return reject(err);
				}

				return resolve(res);

			});

		});

	}

	// TODO: close

	// TODO: events

}

export default USBAdapter;
