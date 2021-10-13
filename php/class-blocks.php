<?php
/**
 * Blocks Initializer
 *
 * @package Hello_Charts
 */

namespace Hello_Charts;

/**
 * Block initializer class. Enqueue CSS/JS of all the blocks.
 */
class Blocks {
	/**
	 * The plugin's block namespace.
	 *
	 * @var string
	 */
	const BLOCK_NAMESPACE = 'hello-charts';

	/**
	 * The blocks to register.
	 *
	 * @var array
	 */
	const BLOCK_SLUGS = [
		'block-bar',
		'block-line',
		'block-pie',
		'block-polar-area',
		'block-radar',
	];

	/**
	 * Blocks constructor.
	 */
	public function __construct() {
		add_filter( 'block_categories', [ $this, 'block_categories' ] );
		add_action( 'init', [ $this, 'block_assets' ] );

		foreach ( self::BLOCK_SLUGS as $block_slug ) {
			$namespace = self::BLOCK_NAMESPACE;
			add_filter( "render_block_$namespace/$block_slug", [ $this, 'render_block' ], 10, 2 );
		}
	}

	/**
	 * Create a custom block category
	 *
	 * @param array $categories List of current categories.
	 *
	 * @return array
	 */
	public function block_categories( array $categories ): array {
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
	 */
	public function block_assets() {
		$version = hello_charts_version();

		// Register block styles for both frontend + backend.
		wp_register_style(
			'hello-charts-style-css',
			plugins_url( '/build/style.css', dirname( __FILE__ ) ),
			is_admin() ? [ 'wp-editor' ] : null,
			$version
		);

		// Register block editor styles for backend.
		wp_register_style(
			'hello-charts-editor-css', // Handle.
			plugins_url( '/build/editor.css', dirname( __FILE__ ) ),
			[ 'wp-edit-blocks' ],
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
			[ 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ],
			$version,
			true
		);

		wp_localize_script(
			'hello-charts-block-js',
			'helloChartsAllowedBlockTypes',
			hello_charts()->license->get_valid_blocks()
		);

		$this->register_block_types();
	}

	/**
	 * Register the blocks.
	 */
	public function register_block_types() {
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
		 */
		foreach ( hello_charts()->license->get_valid_blocks() as $block_slug ) {
			$namespace = self::BLOCK_NAMESPACE;
			register_block_type( "$namespace/$block_slug", $block_type_args );
		}
	}

	/**
	 * Output the Chart.js initalizer in a <script> tag when the block is output.
	 *
	 * @param string $block_content The block content about to be appended.
	 * @param array  $block         The full block, including name and attributes.
	 *
	 * @return string Modified block content.
	 */
	public function render_block( string $block_content, array $block ): string {
		global $current_screen;
		if ( $current_screen && $current_screen->is_block_editor() ) {
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
		var ctx = document.getElementById('chart-$id').getContext('2d');
		var chart = new Chart(ctx, {
			type: '$type',
			data: $data,
			options: $options
		});
		";

		wp_add_inline_script( 'chart-js', $script );

		return $block_content;
	}
}
