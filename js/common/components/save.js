/**
 * WordPress dependencies.
 */
const { Component } = wp.element;

export default class Save extends Component {
	render() {
		// Setup the attributes
		const {
			attributes: {
				backgroundColor,
				blockId,
			},
			className,
		} = this.props;

		const styles = {
			background: backgroundColor ? backgroundColor : 'none',
		};

		return (
			<div className={ className }>
				<div style={ styles }>
					<canvas id={ `chart-${ blockId }` }></canvas>
				</div>
			</div>
		);
	}
}
