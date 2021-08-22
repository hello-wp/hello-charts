/**
 * WordPress dependencies.
 */
const { Component } = wp.element;
const { RichText } = wp.blockEditor;

export default class Save extends Component {
	render() {
		// Setup the attributes
		const {
			attributes: { title, blockId, showChartBackground, chartSize },
			className,
		} = this.props;

		const styles = {
			width: chartSize ? chartSize : '',
			maxWidth: chartSize ? '100%' : '',
			margin: chartSize ? 'auto' : '',
		};

		return (
			<div className={ className }>
				<div className={ showChartBackground ? 'wrapper has-chart-background' : 'wrapper' } style={ styles }>
					<RichText.Content tagName="h3" className="chart-title" value={ title } />
					<canvas id={ `chart-${ blockId }` }></canvas>
				</div>
			</div>
		);
	}
}
