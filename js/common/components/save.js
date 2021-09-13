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
				titleColor,
				blockId,
				title,
			},
			className,
		} = this.props;

		const styles = {
			background: backgroundColor ? backgroundColor : 'none',
			color: titleColor ? titleColor : 'inherit',
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
