/**
 * BLOCK: Line Chart
 */

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component } = wp.element; // Extend component
const { RichText } = wp.blockEditor;

export default class Save extends Component {
	render() {
		// Setup the attributes
		const {
			attributes: { title, blockId },
			className,
		} = this.props;

		return (
			<div className={ className }>
				<RichText.Content tagName="h3" placeholder={ __( 'Line Chart' ) } value={ title } />
				<canvas id={ `chart-${ blockId }` }></canvas>
			</div>
		);
	}
}
