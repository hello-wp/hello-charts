/**
 * BLOCK: Pie Chart
 */

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { Card } = wp.components;
/**
 * Registers this as a block.
 *
 * @see https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('hello-charts/block-pie', {
	title: __('Pie Chart'),
	icon: 'chart-pie',
	category: 'charts',
	keywords: [__('charts'), __('graph'), __('data')],

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @see https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @return {*} JSX Component.
	 */
	edit: (props) => {
		return (
			<Card className={props.className}>
				<p>Pie Chart</p>
			</Card>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @see https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @return {*} JSX Frontend HTML.
	 */
	save: (props) => {
		return (
			<Card className={props.className}>
				<p>Pie Chart</p>
			</Card>
		);
	},
});
