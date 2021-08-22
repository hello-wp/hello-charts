/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		return (
			<PanelBody title={ __( 'Chart Styles', 'hello-charts' ) } initialOpen={ true }>
			</PanelBody>
		);
	}
}
