/**
 * BLOCK: Line Chart
 */

/**
 * WordPress dependencies.
 */
const { Component } = wp.element;
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
				<RichText.Content tagName="h3" className="chart-title" value={ title } />
				<canvas id={ `chart-${ blockId }` }></canvas>
			</div>
		);
	}
}
