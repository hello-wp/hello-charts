<?php
/**
 * Primary plugin file.
 *
 * @package Hello_Charts
 */

namespace Hello_Charts;

/**
 * Class Plugin.
 */
class Plugin {
	/**
	 * The plugin's block initializer.
	 *
	 * @var Blocks
	 */
	public $blocks;

	/**
	 * The plugin's license validation.
	 *
	 * @var License
	 */
	public $license;

	/**
	 * Path to the plugin file relative to the plugins directory.
	 *
	 * @var string
	 */
	public $plugin_file;

	/**
	 * Plugin initializer.
	 *
	 * @param string The plugin's basename.
	 */
	public function init( $plugin_file ) {
		$this->plugin_file = $plugin_file;
		$this->license     = new License();
		$this->blocks      = new Blocks();
	}
}
