wp.hooks.addFilter(
	'blocks.getBlockDefaultClassName',
	'hello-charts/block-filters',
	( className, blockName ) => {
		if ( blockName.startsWith( 'hello-charts/' ) ) {
			return 'wp-block-hello-charts';
		}
		return className;
	}
);
