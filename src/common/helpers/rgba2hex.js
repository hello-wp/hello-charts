/**
 * Converts an RGBA value to a hex code.
 *
 * @param {string}	rgba	The rgba value (the alpha channel will be stripped).
 * @return {string} A hex code.
 */
const rgba2hex = ( rgba ) => {
	const parts = rgba.replace( /^rgba?\(|\s+|\)$/g, '' ).split( ',' ).slice( 0, 3 );

	if ( parts.length < 3 ) {
		return rgba;
	}

	const merge = parts.map( ( x, i ) => i === 3 ? parseInt( 255 * parseFloat( x ) ).toString( 16 ) : parseInt( x ).toString( 16 ) ).join( '' );
	return `#${ merge }`;
};

export default rgba2hex;
