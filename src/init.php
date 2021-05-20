<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package Hello_Charts
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Create a custom block category
 *
 * @param array $categories List of current categories.
 * @return array
 */
function hello_charts_block_categories( $categories ) {
	return array_merge(
		$categories,
		[
			[
				'slug'  => 'charts',
				'title' => __( 'Charts', 'hello-charts' ),
			],
		]
	);
}
add_filter( 'block_categories', 'hello_charts_block_categories' );

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function hello_charts_block_assets() {
	$version = hello_charts_version();

	// Register block styles for both frontend + backend.
	wp_register_style(
		'hello-charts-style-css',
		plugins_url( '/build/style.css', dirname( __FILE__ ) ),
		is_admin() ? [ 'wp-editor' ] : null,
		$version
	);

	// Register chart.js styles.
	wp_register_style(
		'chart-js', // Handle.
		plugins_url( '/build/lib/chart.js/chart.min.css', dirname( __FILE__ ) ),
		[],
		$version
	);

	// Register block editor styles for backend.
	wp_register_style(
		'hello-charts-editor-css', // Handle.
		plugins_url( '/build/editor.css', dirname( __FILE__ ) ),
		[ 'chart-js', 'wp-edit-blocks' ],
		$version
	);

	// Register chart.js script.
	wp_register_script(
		'chart-js',
		plugins_url( '/build/lib/chart.js/chart.min.js', dirname( __FILE__ ) ),
		[],
		$version,
		true
	);

	// Register block editor script for backend.
	wp_register_script(
		'hello-charts-block-js',
		plugins_url( '/build/blocks.js', dirname( __FILE__ ) ),
		[ 'chart-js', 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ],
		$version,
		true
	);

	$block_type_args = [
		'style'         => 'hello-charts-style-css',
		'script'        => 'chart-js',
		'editor_style'  => 'hello-charts-editor-css',
		'editor_script' => 'hello-charts-block-js',
	];

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type( 'hello-charts/block-bar', $block_type_args );
	register_block_type( 'hello-charts/block-line', $block_type_args );
	register_block_type( 'hello-charts/block-pie', $block_type_args );
	register_block_type( 'hello-charts/block-radar', $block_type_args );
}

// Hook: Block assets.
add_action( 'init', 'hello_charts_block_assets' );

/**
 * Output the Chart.js initalizer in a <script> tag when the block is output.
 *
 * @param string $block_content The block content about to be appended.
 * @param array  $block         The full block, including name and attributes.
 * @return string Modified block content.
 */
function hello_charts_block_render( $block_content, $block ) {
	if ( is_admin() ) {
		return $block_content;
	}

	$data = '{}';
	if ( isset( $block['attrs']['chartData'] ) ) {
		$data = $block['attrs']['chartData'];
	}

	$options = '{}';
	if ( isset( $block['attrs']['chartOptions'] ) ) {
		$options = $block['attrs']['chartOptions'];
	}

	$type = 'line';
	if ( isset( $block['attrs']['chartType'] ) ) {
		$type = $block['attrs']['chartType'];
	}

	$id = '';
	if ( isset( $block['attrs']['blockId'] ) ) {
		$id = $block['attrs']['blockId'];
	}

	$script = "
		var ctx = document.getElementById('chart-${id}').getContext('2d');
		var chart = new Chart(ctx, {
			type: '${type}',
			data: ${data},
			options: ${options}
		});
	";

	wp_add_inline_script( 'chart-js', $script );

	return $block_content;
}
add_filter( 'render_block_hello-charts/block-bar', 'hello_charts_block_render', 10, 2 );
add_filter( 'render_block_hello-charts/block-line', 'hello_charts_block_render', 10, 2 );
add_filter( 'render_block_hello-charts/block-pie', 'hello_charts_block_render', 10, 2 );
add_filter( 'render_block_hello-charts/block-radar', 'hello_charts_block_render', 10, 2 );
