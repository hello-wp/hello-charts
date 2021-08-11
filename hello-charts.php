<?php
/**
 * Plugin Name: Hello Charts
 * Plugin URI: https://github.com/hello-charts/
 * Description: A library of blocks that make it super easy to add dynamic charts to your WordPress pages and posts.
 * Author: Hello Charts
 * Author URI: https://github.com/hello-charts/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Hello_Charts
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get plugin version.
 */
function hello_charts_version() {
	return '1.0.0';
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'php/init.php';
