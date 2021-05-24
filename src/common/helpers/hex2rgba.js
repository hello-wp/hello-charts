/**
 * Converts a hex code to an RGBA value.
 *
 * @param {string}	hex	The hex code (works with and without a # at the beginning).
 * @param {number}	a	The alpha value of the RGBA output.
 * @return {string} An RGBA value.
 */
const hex2rgba = ( hex, a ) => {
	const parts = hex.replace( '#', '' ).match( /.{1,2}/g );
	return `rgba(${ parseInt( parts[ 0 ], 16 ) },${ parseInt(
		parts[ 1 ],
		16
	) },${ parseInt( parts[ 2 ], 16 ) },${ a })`;
};

export default hex2rgba;
