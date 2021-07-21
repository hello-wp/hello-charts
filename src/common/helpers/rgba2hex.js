/**
 * Converts an RGBA value to a hex code.
 *
 * @param {string}	rgba	The rgba value (the alpha channel will be stripped).
 * @return {string} A hex code.
 */
const rgba2hex = ( rgba ) => {
	const parts = rgba.replace( /^rgba?\(|\s+|\)$/g, '' ).split( ',' );

	if ( parts.length < 3 ) {
		return rgba;
	}

	const merge = ( 1 << 24 ) + ( parseInt( parts[ 0 ] ) << 16 ) + ( parseInt( parts[ 1 ] ) << 8 ) + parseInt( parts[ 2 ] );
	return `#${ merge.toString( 16 ).slice( 1 ) }`;
};

export default rgba2hex;
