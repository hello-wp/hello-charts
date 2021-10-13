<?php
/**
 * Enable and validate licensing.
 *
 * @package Hello_Charts
 */

namespace Hello_Charts;

use WP_Error;

/**
 * Class License
 */
class License {

	/**
	 * The name of the license key transient.
	 *
	 * @var string
	 */
	private const TRANSIENT_NAME = 'hello_charts_license';

	/**
	 * Option name of the license key.
	 *
	 * @var string
	 */
	private const OPTION_NAME = 'hello_charts_license_key';

	/**
	 * URL of the Hello Charts store.
	 *
	 * @var string
	 */
	private const LICENSE_URL = 'https://hellocharts.co';

	/**
	 * Product slug of Hello Charts.
	 *
	 * @var string
	 */
	private const PRODUCT_SLUG = 'hello-charts';

	/**
	 * The product price IDs mapped to blocks. The "all" slug is used for "all access" bundles.
	 */
	private const PRICE_IDS = [
		1 => 'block-bar',
		2 => 'block-line',
		3 => 'block-pie',
		4 => 'block-polar-area',
		5 => 'block-radar',
		6 => 'all',
		7 => 'all',
	];

	/**
	 * The name of the GET parameter that indicates we should register the plugin.
	 *
	 * @var string
	 */
	private const REGISTER_KEY = 'hello-charts-register';

	/**
	 * The name of the GET parameter that indicates we should deregister the plugin.
	 *
	 * @var string
	 */
	private const DEREGISTER_KEY = 'hello-charts-deregister';

	/**
	 * The transient 'license' value for when the request to validate the license failed.
	 *
	 * This is for when the actual POST request fails,
	 * not for when it returns that the license is invalid.
	 *
	 * @var string
	 */
	private const REQUEST_FAILED = 'request_failed';

	/**
	 * License constructor.
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', [ $this, 'license_key_styles' ] );
		add_action( 'after_plugin_row_' . hello_charts()->plugin_file, [ $this, 'license_key_field' ], 10, 2 );
		add_action( 'plugin_row_meta', [ $this, 'plugin_row_meta' ], 10, 2 );

		add_filter( 'pre_set_site_transient_update_plugins', [ $this, 'update_plugins' ] );
		add_filter( 'plugins_api', [ $this, 'plugins_api' ], 10, 3 );

		if ( filter_input( INPUT_GET, self::REGISTER_KEY, FILTER_SANITIZE_STRING ) ) {
			add_action( 'admin_init', [ $this, 'add_license' ] );
		}

		if ( filter_input( INPUT_GET, self::DEREGISTER_KEY, FILTER_SANITIZE_STRING ) ) {
			add_action( 'admin_init', [ $this, 'remove_license' ] );
		}
	}

	/**
	 * Add a license submitted via the register license form.
	 */
	public function add_license() {
		if ( ! current_user_can( 'update_plugins' ) ) {
			return;
		}

		$key = filter_input( INPUT_GET, self::REGISTER_KEY, FILTER_SANITIZE_STRING );
		$this->save_license( $key );
	}

	/**
	 * Remove the saved license.
	 */
	public function remove_license() {
		if ( ! current_user_can( 'update_plugins' ) ) {
			return;
		}

		$response = $this->api_request( 'deactivate_license' );

		if ( ! is_wp_error( $response ) ) {
			delete_transient( self::TRANSIENT_NAME );
			delete_option( self::OPTION_NAME );
			add_filter( 'hello_charts_plugin_row_notice', [ $this, 'license_remove_message' ] );
		} else {
			add_filter( 'hello_charts_plugin_row_notice', [ $this, 'license_request_failed_message' ] );
		}
	}

	/**
	 * Check that the license key is valid before saving.
	 *
	 * @param string $key The license key that was submitted.
	 */
	private function save_license( string $key ) {
		$this->activate_license( $key );
		$license = get_transient( self::TRANSIENT_NAME );

		if ( ! $this->is_valid() ) {
			if ( isset( $license->license ) && self::REQUEST_FAILED === $license->license ) {
				add_filter( 'hello_charts_plugin_row_notice', [ $this, 'license_request_failed_message' ] );
			} else {
				add_filter( 'hello_charts_plugin_row_notice', [ $this, 'license_invalid_message' ] );
			}
		} else {
			add_filter( 'hello_charts_plugin_row_notice', [ $this, 'license_success_message' ] );
		}
	}

	/**
	 * Check if the license is valid.
	 *
	 * @return bool
	 */
	private function is_valid(): bool {
		$license = $this->get_license();

		if ( isset( $license->license ) && 'valid' === $license->license && isset( $license->expires ) ) {
			if ( time() < strtotime( $license->expires ) || 'lifetime' === $license->expires ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Return an array of valid block slugs.
	 *
	 * @return array
	 */
	public function get_valid_blocks(): array {
		$all_blocks   = hello_charts()->blocks::BLOCK_SLUGS;
		$valid_blocks = [];
		$price_id     = $this->get_license()->price_id;

		if ( ! isset( self::PRICE_IDS[ $price_id ] ) ) {
			return $valid_blocks;
		}

		if ( 'all' === self::PRICE_IDS[ $price_id ] ) {
			return $all_blocks;
		}
		foreach ( $all_blocks as $block_slug ) {
			if ( self::PRICE_IDS[ $price_id ] === $block_slug ) {
				$valid_blocks[] = $block_slug;
			}
		}

		return $valid_blocks;
	}

	/**
	 * Retrieve the license data.
	 *
	 * @return mixed
	 */
	private function get_license() {
		$license = get_transient( self::TRANSIENT_NAME );

		if ( ! $license ) {
			$key = get_option( self::OPTION_NAME );
			if ( ! empty( $key ) ) {
				$this->activate_license( $key );
				$license = get_transient( self::TRANSIENT_NAME );
			}
		}

		return $license;
	}

	/**
	 * Try to activate the license.
	 *
	 * @param string $key The license key to activate.
	 */
	private function activate_license( string $key ) {
		$response = $this->api_request( 'activate_license', [ 'license' => $key ] );

		if ( is_wp_error( $response ) ) {
			$license = [ 'license' => self::REQUEST_FAILED ];
		} else {
			$license = $response;
		}

		$expiration = DAY_IN_SECONDS;

		update_option( self::OPTION_NAME, $key );
		set_transient( self::TRANSIENT_NAME, $license, $expiration );
	}

	/**
	 * Add links to plugin row.
	 *
	 * @param string[] $plugin_meta An array of the plugin's metadata.
	 * @param string   $plugin_file Path to the plugin file relative to the plugins directory.
	 *
	 * @return string[]
	 */
	public function plugin_row_meta( array $plugin_meta, string $plugin_file ): array {
		if ( $plugin_file !== $this->plugin_file ) {
			return $plugin_meta;
		}

		if ( ! current_user_can( 'update_plugins' ) || ! $this->is_valid() ) {
			return $plugin_meta;
		}

		$plugin_meta[] = sprintf(
			'<a href="%1$s" class="deregister">%2$s</a>',
			add_query_arg(
				self::DEREGISTER_KEY,
				true,
				admin_url( 'plugins.php' )
			),
			__( 'Deregister', 'hello-charts' )
		);

		$plugin_meta[] = sprintf(
			'<a href="%1$s" target="_blank">%2$s</a>',
			'https://hellocharts.co/checkout/purchase-history/',
			__( 'Manage license', 'hello-charts' )
		);

		return $plugin_meta;
	}

	/**
	 * Check for Updates and modify the update array.
	 *
	 * @param mixed $value New value of site transient.
	 *
	 * @return mixed Modified update array with custom plugin data.
	 *
	 * @see https://developer.wordpress.org/reference/hooks/pre_set_site_transient_transient/
	 */
	public function update_plugins( $value ) {
		if ( ! $this->is_valid() ) {
			return $value;
		}

		if ( empty( $value ) ) {
			return $value;
		}

		$response = $this->api_request( 'get_version' );

		if ( ! is_wp_error( $response ) && isset( $response->new_version ) ) {
			if ( version_compare( hello_charts_version(), $response->new_version, '<' ) ) {
				$value->response[ hello_charts()->plugin_file ] = $response;
			}
		}

		return $value;
	}

	/**
	 * Updates information on the "View version details" page with custom data.
	 *
	 * @param mixed  $data   The result object or array.
	 * @param string $action The type of information being requested from the Plugin Installation API.
	 * @param object $args   Plugin API arguments.
	 *
	 * @return mixed $data
	 *
	 * @see https://developer.wordpress.org/reference/hooks/\/
	 */
	public function plugins_api( $data, string $action, $args ) {
		if (
			! $this->is_valid() ||
			'plugin_information' !== $action ||
			! isset( $args->slug ) ||
			self::PRODUCT_SLUG !== $args->slug
		) {
			return $data;
		}

		$response = $this->api_request( 'get_version' );

		if ( ! is_wp_error( $response ) ) {
			$data = $response;
		}

		return $data;
	}

	/**
	 * Calls the API and, if successful, returns the object delivered by the API.
	 *
	 * @param string $action The requested action.
	 * @param array  $data Optional API data.
	 *
	 * @return object|WP_Error
	 */
	private function api_request( string $action, array $data = [] ) {
		$api_params = [
			'edd_action' => $action,
			'license'    => $data['license'] ?? get_option( self::OPTION_NAME ),
			'item_name'  => rawurlencode( self::PRODUCT_SLUG ),
			'url'        => home_url(),
		];

		$request = wp_remote_post(
			self::LICENSE_URL,
			[
				'timeout'   => 10,
				'sslverify' => true,
				'body'      => $api_params,
			]
		);

		if ( ! is_wp_error( $request ) ) {
			$response = json_decode( wp_remote_retrieve_body( $request ) );

			if ( $response && $response->success ) {
				$response->sections = maybe_unserialize( $response->sections || '' );
				$response->banners  = maybe_unserialize( $response->banners || '' );
				$response->icons    = maybe_unserialize( $response->icons || '' );
			}

			return $response;
		}

		return $request;
	}

	/**
	 * Output custom CSS for the license key field.
	 */
	public function license_key_styles() {
		$custom_css = '
			.plugins tr[data-slug="hello-charts"] > * { box-shadow: none; }
			.plugins tr[data-slug="hello-charts"] .deregister { color: #b32d2e; }
			.plugins .hello-charts-plugin-row td { padding-top: 0; }
			.plugins .hello-charts-plugin-row.update td { padding-bottom: 0; }
			.plugins .hello-charts-plugin-row .dashicons-yes { color: #00a32a; }
			.plugins .hello-charts-plugin-row .license-key { font-family: monospace; width: 18rem; margin-right: 0.5rem; }
		';
		wp_add_inline_style( 'list-tables', $custom_css );
	}

	/**
	 * Output the HTML for showing an input field for the license key.
	 *
	 * @param string $plugin_file Path to the plugin file relative to the plugins directory.
	 * @param array  $plugin_data An array of plugin data.
	 *
	 * @see https://developer.wordpress.org/reference/hooks/after_plugin_row_plugin_file/
	 */
	public function license_key_field( string $plugin_file, array $plugin_data ) {
		unset( $plugin_file );

		if ( ! current_user_can( 'update_plugins' ) ) {
			return;
		}

		$class = 'hello-charts-plugin-row active';
		if ( isset( $plugin_data['update'] ) && $plugin_data['update'] ) {
			$class .= ' update';
		}

		?>
		<tr class="<?php echo esc_attr( $class ); ?>">
			<th class="check-column"></th>
			<td class="column-primary"></td>
			<td class="column-description">
				<?php
				echo wp_kses_post( apply_filters( 'hello_charts_plugin_row_notice', '' ) );
				if ( $this->is_valid() ) {
					echo wp_kses_post( $this->license_active_message() );
				} else {
					echo wp_kses(
						$this->license_inactive_message(),
						[
							'p'     => [],
							'input' => [
								'type'    => true,
								'class'   => true,
								'value'   => true,
								'onclick' => true,
							],
						]
					);
				}
				?>
			</td>
			<td class="column-auto-updates"></td>
		</tr>
		<?php
	}

	/**
	 * Message for a valid license.
	 *
	 * @return string
	 */
	private function license_active_message(): string {
		$message = __( 'Hello Charts is registered and receiving updates.', 'hello-charts' );
		return sprintf(
			'<p><span class="dashicons dashicons-yes"></span>%1$s</p>',
			$message
		);
	}

	/**
	 * Message for a valid license.
	 *
	 * @return string
	 */
	private function license_inactive_message(): string {
		$message = __( 'Enter your license keys to use Hello Charts and receive plugin updates:', 'hello-charts' );
		return sprintf(
			'<p>%1$s</p><p>%2$s%3$s</p>',
			$message,
			'<input type="text" class="license-key" />',
			sprintf(
				'<input type="button" class="button" value="%1$s" %2$s />',
				__( 'Save', 'hello-charts' ),
				sprintf(
					'onclick="window.location=\'%1$s?%2$s=\' + this.previousElementSibling.value;"',
					admin_url( 'plugins.php' ),
					self::REGISTER_KEY
				)
			)
		);
	}

	/**
	 * Admin notice for correct license details.
	 *
	 * @return string
	 */
	public function license_success_message(): string {
		$message = __( 'Your Hello Charts license was activated!', 'hello-charts' );
		return sprintf( '<div class="notice inline notice-success"><p>%s</p></div>', esc_html( $message ) );
	}

	/**
	 * Admin notice for correct license details.
	 *
	 * @return string
	 */
	public function license_remove_message(): string {
		$message = __( 'Your Hello Charts license was removed.', 'hello-charts' );
		return sprintf( '<div class="notice inline notice-success"><p>%s</p></div>', esc_html( $message ) );
	}

	/**
	 * Admin notice for the license request failing.
	 *
	 * This is for when the validation request fails entirely, like with a 404.
	 * Not for when it returns that the license is invalid.
	 *
	 * @return string
	 */
	public function license_request_failed_message(): string {
		$message = sprintf(
			/* translators: %s is an HTML link to contact support */
			__( 'There was a problem communicating with the license validation server. If the problem persists, please %s.', 'hello-charts' ),
			sprintf(
				'<a href="%1$s">%2$s</a>',
				'mailto:hi@hellocharts.co?subject=There was a problem activating my Hello Charts license',
				esc_html__( 'contact support', 'hello-charts' )
			)
		);

		return sprintf( '<div class="notice inline notice-warning"><p>%s</p></div>', wp_kses_post( $message ) );
	}

	/**
	 * Admin notice for incorrect license details.
	 *
	 * @return string
	 */
	public function license_invalid_message(): string {
		$message = __( 'The Hello Charts license you entered is not valid.', 'hello-charts' );
		return sprintf( '<div class="notice inline notice-warning"><p>%s</p></div>', esc_html( $message ) );
	}
}
