const { unregisterBlockType } = wp.blocks;

wp.domReady( () => {
	if ( ! window.hasOwnProperty( 'helloChartsDisallowedBlockTypes' ) ) {
		return;
	}
	Object.values( window.helloChartsDisallowedBlockTypes ).forEach(
		( blockSlug ) => unregisterBlockType( `hello-charts/${ blockSlug }` )
	);
} );
