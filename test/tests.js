"use strict";

import test from 'ava';


test('first', t => {

	const result = crypto.generatePKP(
		PRIVATE_KEY,
		'CZ1212121218',
		'273',
		'/5546/RO24',
		'0/6460/ZQ42',
		'2016-08-05T00:30:12+02:00',
		'34113.00'
	);

	t.is(true, true);

});
