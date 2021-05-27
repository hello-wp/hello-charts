/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	ToolbarButton,
	ToolbarGroup,
} = wp.components;

export default class EditDataToolbar extends Component {
	render() {
		const {
			attributes: { showChartTitle },
			setAttributes,
		} = this.props;

		return (
			<ToolbarGroup className="chart-formatting-toolbar" label={ __( 'Chart Formatting', 'hello-charts' ) }>
				<ToolbarButton
					icon="heading"
					label={ __( 'Toggle Chart Title', 'hello-charts' ) }
					onClick={
						() => setAttributes( { showChartTitle: showChartTitle ? false : true } )
					}
				/>
			</ToolbarGroup>
		);
	}
}
