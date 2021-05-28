/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	ToolbarButton,
	ToolbarGroup,
} = wp.components;

/**
 * Components and dependencies.
 */
import { icons } from '../../common/helpers';

export default class EditDataToolbar extends Component {
	render() {
		const {
			attributes: { showChartTitle, showChartBackground },
			setAttributes,
		} = this.props;

		return (
			<ToolbarGroup className="chart-formatting-toolbar" label={ __( 'Chart Formatting', 'hello-charts' ) }>
				<ToolbarButton
					icon={ showChartTitle ? icons.chartTitleOn : icons.chartTitleOff }
					label={ showChartTitle ? __( 'Hide Chart Title', 'hello-charts' ) : __( 'Show Chart Title', 'hello-charts' ) }
					onClick={
						() => setAttributes( { showChartTitle: showChartTitle ? false : true } )
					}
				/>
				<ToolbarButton
					icon={ showChartBackground ? icons.chartBackgroundOn : icons.chartBackgroundOff }
					label={ showChartBackground ? __( 'Hide Chart Background', 'hello-charts' ) : __( 'Show Chart Background', 'hello-charts' ) }
					onClick={
						() => setAttributes( { showChartBackground: showChartBackground ? false : true } )
					}
				/>
			</ToolbarGroup>
		);
	}
}
