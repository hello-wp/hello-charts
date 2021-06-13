/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	ToolbarButton,
	ToolbarGroup,
} = wp.components;

/**
 * Internal dependencies.
 */
import { icons } from '../../common/helpers';

/**
 * External dependencies
 */
import classnames from 'classnames';

export default class ChartFormattingToolbar extends Component {
	render() {
		const {
			attributes: { showChartTitle, showChartBackground, chartOptions },
			setAttributes,
		} = this.props;

		const parsedOptions = JSON.parse( chartOptions );
		const legendPosition = parsedOptions.plugins.legend.position;
		const legendPositions = [
			{
				icon: icons.legendTop,
				title: __( 'Top', 'hello-charts' ),
				position: 'top',
			},
			{
				icon: icons.legendBottom,
				title: __( 'Bottom', 'hello-charts' ),
				position: 'bottom',
			},
			{
				icon: icons.legendLeft,
				title: __( 'Left', 'hello-charts' ),
				position: 'left',
			},
			{
				icon: icons.legendRight,
				title: __( 'Right', 'hello-charts' ),
				position: 'right',
			},
		];
		const legendAligns = [
			{
				icon: 'top' === legendPosition || 'bottom' === legendPosition ? icons.legendLeft : icons.legendTop,
				title: __( 'Start', 'hello-charts' ),
				align: 'start',
			},
			{
				icon: 'top' === legendPosition || 'bottom' === legendPosition ? icons.legendCenter : icons.legendMiddle,
				title: __( 'Center', 'hello-charts' ),
				align: 'center',
			},
			{
				icon: 'top' === legendPosition || 'bottom' === legendPosition ? icons.legendRight : icons.legendBottom,
				title: __( 'End', 'hello-charts' ),
				align: 'end',
			},
		];

		function toggleLegendDisplay() {
			const options = JSON.parse( chartOptions );
			options.plugins.legend.display = options.plugins.legend.display ? false : true;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateLegendPosition( position ) {
			const options = JSON.parse( chartOptions );
			options.plugins.legend.position = position;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateLegendAlign( align ) {
			const options = JSON.parse( chartOptions );
			options.plugins.legend.align = align;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		return (
			<ToolbarGroup className="chart-formatting-toolbar" label={ __( 'Chart Formatting', 'hello-charts' ) }>
				<ToolbarButton
					icon={ showChartBackground ? icons.backgroundOn : icons.backgroundOff }
					label={ showChartBackground ? __( 'Hide Chart Background', 'hello-charts' ) : __( 'Show Chart Background', 'hello-charts' ) }
					onClick={
						() => setAttributes( { showChartBackground: showChartBackground ? false : true } )
					}
				/>
				<ToolbarButton
					icon={ showChartTitle ? icons.titleOn : icons.titleOff }
					label={ showChartTitle ? __( 'Hide Chart Title', 'hello-charts' ) : __( 'Show Chart Title', 'hello-charts' ) }
					onClick={
						() => setAttributes( { showChartTitle: showChartTitle ? false : true } )
					}
				/>
				<DropdownMenu
					popoverProps={ { isAlternate: true } }
					icon={ parsedOptions.plugins.legend.display ? icons.legendOn : icons.legendOff }
					label={ __( 'Legend Position' ) }
				>
					{ () => (
						<Fragment>
							<MenuGroup>
								<MenuItem
									icon={ parsedOptions.plugins.legend.display ? icons.legendOn : icons.legendOff }
									onClick={ toggleLegendDisplay }
								>
									{ parsedOptions.plugins.legend.display ? __( 'Hide Legend', 'hello-charts' ) : __( 'Show Legend', 'hello-charts' ) }
								</MenuItem>
							</MenuGroup>
							{ parsedOptions.plugins.legend.display && (
								<Fragment>
									<MenuGroup>
										{ legendPositions.map( ( item ) => (
											<MenuItem
												key={ `legend-position-${ item.position }` }
												icon={ item.icon }
												onClick={ () => updateLegendPosition( item.position ) }
												isSelected={ item.position === parsedOptions.plugins.legend.position }
												className={ classnames(
													'components-menu-item',
													{
														'is-active': item.position === parsedOptions.plugins.legend.position,
													}
												) }
											>
												{ item.title }
											</MenuItem>
										) ) }
									</MenuGroup>
									<MenuGroup>
										{ legendAligns.map( ( item ) => (
											<MenuItem
												key={ `legend-align-${ item.align }` }
												icon={ item.icon }
												onClick={ () => updateLegendAlign( item.align ) }
												isSelected={ item.align === parsedOptions.plugins.legend.align }
												className={ classnames(
													'components-menu-item',
													{
														'is-active': item.align === parsedOptions.plugins.legend.align,
													}
												) }
											>
												{ item.title }
											</MenuItem>
										) ) }
									</MenuGroup>
								</Fragment>
							) }
						</Fragment>
					) }
				</DropdownMenu>
			</ToolbarGroup>
		);
	}
}
