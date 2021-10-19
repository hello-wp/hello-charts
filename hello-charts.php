<?php
/**
 * Plugin Name: Hello Charts
 * Plugin URI: https://hellocharts.co/
 * Description: A library of blocks that make it super easy to add dynamic charts to your WordPress pages and posts.
 * Author: Hello Charts
 * Author URI: https://hellocharts.co/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Hello_Charts
 */

use Hello_Charts\Plugin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get plugin version.
 *
 * @return string
 */
function hello_charts_version(): string {
	return '1.0.0';
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'php/class-plugin.php';
require_once plugin_dir_path( __FILE__ ) . 'php/class-blocks.php';
require_once plugin_dir_path( __FILE__ ) . 'php/class-license.php';

/**
 * Return an instance of the Hello Charts plugin.
 *
 * @return Plugin
 */
function hello_charts(): Plugin {
	static $instance;

	if ( null === $instance ) {
		$instance = new Plugin();
	}

	return $instance;
};

hello_charts()->init( plugin_basename( __FILE__ ) );
