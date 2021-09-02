/**
 * WordPress dependencies.
 */
const { Component } = wp.element;
const { RichText } = wp.blockEditor;

export default class Save extends Component {
	render() {
		// Setup the attributes
		const {
			attributes: {
				backgroundColor,
				blockId,
				title,
			},
			className,
		} = this.props;

		const styles = {
			background: backgroundColor ? backgroundColor : 'none',
		};

		return (
			<div className={ className }>
				<div style={ styles }>
					<RichText.Content tagName="h3" className="chart-title" value={ title } />
					<canvas id={ `chart-${ blockId }` }></canvas>
				</div>
			</div>
		);
	}
}
