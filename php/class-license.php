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
	 * Option name of the license key.
	 *
	 * @var string
	 */
	const LICENSE_KEY_OPTION_NAME = 'hello_charts_license_key';

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
	 * The name of the license key transient.
	 *
	 * @var string
	 */
	const TRANSIENT_NAME = 'hello_charts_license';

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
	 * License constructor.
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', [ $this, 'license_key_styles' ] );
		add_action( 'after_plugin_row', [ $this, 'license_key_field' ], 10, 2 );
		add_filter( 'pre_update_option_' . self::LICENSE_KEY_OPTION_NAME, [ $this, 'save_license_key' ] );
	}

	/**
	 * Check that the license key is valid before saving.
	 *
	 * @param string $key The license key that was submitted.
	 *
	 * @return string
	 */
	public function save_license_key( $key ) {
		$this->activate_license( $key );
		$license = get_transient( self::TRANSIENT_NAME );

		if ( ! $this->is_valid() ) {
			$key = '';
			if ( isset( $license['license'] ) && self::REQUEST_FAILED === $license['license'] ) {
				// Do something.
			} else {
				// Do something.
			}
		} else {
			// Do something.
		}

		return $key;
	}

	/**
	 * Check if the license is valid.
	 *
	 * @return bool
	 */
	public function is_valid() {
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
	public function get_license() {
		$license = get_transient( self::TRANSIENT_NAME );

		if ( ! $license ) {
			$key = get_option( self::LICENSE_KEY_OPTION_NAME );
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
	public function activate_license( $key ) {
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
	 * Output custom CSS for the license key field.
	 */
	public function license_key_styles() {
		$custom_css = '.plugins tr[data-slug="hello-charts"] > * { box-shadow: none; }';
		wp_add_inline_style( 'list-tables', $custom_css );
	}

	/**
	 * Output the HTML for showing an input field for the license key.
	 *
	 * @param string $plugin_file Path to the plugin file relative to the plugins directory.
	 * @param array  $plugin_data An array of plugin data.
	 */
	public function license_key_field( $plugin_file, $plugin_data ) {
		unset( $plugin_file );

		if ( 'hello-charts' !== $plugin_data['TextDomain'] ) {
			return;
		}

		if ( ! current_user_can( 'update_plugins' ) ) {
			return;
		}

		?>
		<tr class="plugin-update-tr active">
			<td colspan="4" class="plugin-update colspanchange">
				<?php echo wp_kses_post( $this->license_success_message() ); ?>
			</td>
		</tr>
		<?php
	}

	/**
	 * Admin notice for correct license details.
	 *
	 * @return string
	 */
	public function license_success_message() {
		$message = __( 'Your Hello Charts license was activated!', 'hello-charts' );
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
	public function license_request_failed_message() {
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
	public function license_invalid_message() {
		$message = __( 'There was a problem activating your Hello Charts license.', 'hello-charts' );
		return sprintf( '<div class="notice inline notice-error"><p>%s</p></div>', esc_html( $message ) );
	}
}
