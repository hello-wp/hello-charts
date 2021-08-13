<?php
/**
 * Enable and validate licensing.
 *
 * @package Hello_Charts
 */

namespace Hello_Charts;

/**
 * Class License
 */
class License {

	/**
	 * The name of the license key transient.
	 *
	 * @var string
	 */
	const TRANSIENT_NAME = 'hello_charts_license';

	/**
	 * Option name of the license key.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'hello_charts_license_key';

	/**
	 * URL of the Hello Charts store.
	 *
	 * @var string
	 */
	const LICENSE_URL = 'https://hellocharts.co';

	/**
	 * Product slug of Hello Charts.
	 *
	 * @var string
	 */
	const PRODUCT_SLUG = 'hello-charts';

	/**
	 * The name of the $_GET parameter that indicates we should deregister the plugin.
	 *
	 * @var string
	 */
	const DEREGISTER_KEY = 'hello-charts-deregister';

	/**
	 * The transient 'license' value for when the request to validate the license failed.
	 *
	 * This is for when the actual POST request fails,
	 * not for when it returns that the license is invalid.
	 *
	 * @var string
	 */
	const REQUEST_FAILED = 'request_failed';

	/**
	 * Path to the plugin file relative to the plugins directory.
	 *
	 * @var string
	 */
	public $plugin_file;

	/**
	 * License constructor.
	 */
	public function __construct( $plugin_file ) {
		$this->plugin_file = $plugin_file;

		add_action( 'admin_enqueue_scripts', [ $this, 'license_key_styles' ] );
		add_action( 'after_plugin_row_' . $this->plugin_file, [ $this, 'license_key_field' ] );
		add_action( 'plugin_row_meta', [ $this, 'plugin_row_meta' ], 10, 2 );
		add_filter( 'pre_update_option_' . self::OPTION_NAME, [ $this, 'save_license_key' ] );

		if ( isset( $_GET[ self::DEREGISTER_KEY ] ) ) {
			add_action( 'admin_init', [ $this, 'remove_license' ] );
		}
	}

	/**
	 * Check that the license key is valid before saving.
	 *
	 * @param string $key The license key that was submitted.
	 *
	 * @return string
	 */
	public function save_license_key( string $key ): string {
		if ( ! current_user_can( 'update_plugins' ) ) {
			return '';
		}

		$this->activate_license( $key );
		$license = get_transient( self::TRANSIENT_NAME );

		if ( ! $this->is_valid() ) {
			$key = '';
			if ( isset( $license['license'] ) && self::REQUEST_FAILED === $license['license'] ) {
				add_filter( 'hello_charts_plugin_row_notice', [ $this, 'license_request_failed_message' ] );
			} else {
				add_filter( 'hello_charts_plugin_row_notice', [ $this, 'license_invalid_message' ] );
			}
		} else {
			add_filter( 'hello_charts_plugin_row_notice', [ $this, 'license_success_message' ] );
		}

		return $key;
	}

	/**
	 * Remove the saved license.
	 */
	public function remove_license() {
		if ( ! current_user_can( 'update_plugins' ) ) {
			return;
		}

		delete_transient( self::TRANSIENT_NAME );
		delete_option( self::OPTION_NAME );
		add_filter( 'hello_charts_plugin_row_notice', [ $this, 'license_remove_message' ] );
	}

	/**
	 * Check if the license is valid.
	 *
	 * @return bool
	 */
	public function is_valid(): bool {
		$license = $this->get_license();

		if ( isset( $license['license'] ) && 'valid' === $license['license'] ) {
			if ( isset( $license['expires'] ) && time() < strtotime( $license['expires'] ) ) {
				return true;
			}
		}

		return false;
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
		$api_params = [
			'edd_action' => 'activate_license',
			'license'    => $key,
			'item_name'  => rawurlencode( self::PRODUCT_SLUG ),
			'url'        => home_url(),
		];

		$response = wp_remote_post(
			self::LICENSE_URL,
			[
				'timeout'   => 10,
				'sslverify' => true,
				'body'      => $api_params,
			]
		);

		if ( is_wp_error( $response ) ) {
			$license = [ 'license' => self::REQUEST_FAILED ];
		} else {
			$license = json_decode( wp_remote_retrieve_body( $response ), true );
		}

		$expiration = DAY_IN_SECONDS;

		set_transient( self::TRANSIENT_NAME, $license, $expiration );
	}

	/**
	 * Add links to plugin row.
	 *
	 * @param  string[]  $plugin_meta An array of the plugin's metadata.
	 * @param  string  $plugin_file Path to the plugin file relative to the plugins directory.
	 *
	 * @return string[]
	 */
	public function plugin_row_meta( array $plugin_meta, string $plugin_file ): array {
		if ( $plugin_file !== $this->plugin_file ) {
			return $plugin_meta;
		}

		if ( ! current_user_can( 'update_plugins' ) ) {
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
	 * Output custom CSS for the license key field.
	 */
	public function license_key_styles() {
		$custom_css = '
			.plugins tr[data-slug="hello-charts"] > * { box-shadow: none; }
			.plugins tr[data-slug="hello-charts"] .deregister { color: #b32d2e; }
			.plugins .hello-charts-plugin-row td { padding-top: 0; }
			.plugins .hello-charts-plugin-row .dashicons-yes { color: #00a32a; }
		';
		wp_add_inline_style( 'list-tables', $custom_css );
	}

	/**
	 * Output the HTML for showing an input field for the license key.
	 *
	 * @param string $plugin_file Path to the plugin file relative to the plugins directory.
	 *
	 * @see https://developer.wordpress.org/reference/hooks/after_plugin_row_plugin_file/
	 */
	public function license_key_field( string $plugin_file ) {
		unset( $plugin_file );

		if ( ! current_user_can( 'update_plugins' ) ) {
			return;
		}

		?>
		<tr class="hello-charts-plugin-row active">
			<th class="check-column"></th>
			<td class="column-primary"></td>
			<td class="column-description">
				<?php
				echo wp_kses_post( apply_filters( 'hello_charts_plugin_row_notice', '' ) );
				if ( $this->is_valid() || true ) {
					echo wp_kses_post( $this->license_active_message() );
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
	public function license_active_message(): string {
		$message = __( 'Hello Charts is registered and receiving updates.', 'hello-charts' );
		return sprintf(
			'<p><span class="dashicons dashicons-yes"></span>%s</p>',
			$message
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
			__( 'There was a problem activating the license, but it may not be invalid. If the problem persists, please %s.', 'hello-charts' ),
			sprintf(
				'<a href="%1$s">%2$s</a>',
				'mailto:hi@hellocharts.co?subject=There was a problem activating my Hello Charts license',
				esc_html__( 'contact support', 'hello-charts' )
			)
		);

		return sprintf( '<div class="notice inline notice-error"><p>%s</p></div>', wp_kses_post( $message ) );
	}

	/**
	 * Admin notice for incorrect license details.
	 *
	 * @return string
	 */
	public function license_invalid_message(): string {
		$message = __( 'There was a problem activating your Hello Charts license.', 'hello-charts' );
		return sprintf( '<div class="notice inline notice-error"><p>%s</p></div>', esc_html( $message ) );
	}
}
