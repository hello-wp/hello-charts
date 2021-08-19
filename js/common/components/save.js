/**
 * WordPress dependencies.
 */
const { Component } = wp.element;
const { RichText } = wp.blockEditor;

export default class Save extends Component {
	render() {
		// Setup the attributes
		const {
			attributes: { title, blockId, chartBackground },
			className,
		} = this.props;

		const styles = {
			background: chartBackground ? chartBackground : 'none',
		};

		return (
			<div className={ className }>
				<div
					className={ className }
					style={ styles }
				>
					<RichText.Content tagName="h3" className="chart-title" value={ title } />
					<canvas id={ `chart-${ blockId }` }></canvas>
				</div>
			</div>
		);
	}
}
