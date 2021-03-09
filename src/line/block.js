/**
 * BLOCK: Line Chart
 */

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { Component } = wp.element; // Extend component
const { ColorPalette, InspectorControls, RichText } = wp.blockEditor;
const {
	BaseControl,
	Button,
	Card,
	CardBody,
	CardHeader,
	Flex,
	FlexItem,
	FlexBlock,
	PanelBody,
	RangeControl,
	SelectControl,
	TextareaControl,
	ToggleControl,
} = wp.components;

const backgroundAlpha = 0.61;

class ChartLineBlock extends Component {
	componentDidMount() {
		// Setup the attributes
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse(chartData);
		const settings = wp.data.select('core/block-editor').getSettings();
		const boringColors = [
			'black',
			'gray',
			'dark-gray',
			'light-gray',
			'white',
		];

		parsedData.datasets.forEach((dataset, index) => {
			if ('generate' === dataset.data[0]) {
				parsedData.datasets[index].data = [];
				parsedData.datasets[index].data = [...Array(6)].map(() =>
					Math.ceil(Math.random() * 20)
				);
			}
			if (settings.hasOwnProperty('colors')) {
				if (!dataset.hasOwnProperty('borderColor')) {
					// Remove boring colors, like black & white.
					const themeColors = settings.colors.filter(
						(color) =>
							!boringColors.find(
								(boring) => boring === color.slug
							)
					);
					// Choose a random color.
					const color =
						themeColors[
							Math.floor(Math.random() * themeColors.length)
						].color;
					parsedData.datasets[index].borderColor = color;
					parsedData.datasets[index].pointBackgroundColor = color;
					parsedData.datasets[index].backgroundColor = this.hex2rgba(
						color,
						backgroundAlpha
					);
				}
			}
		});

		setAttributes({
			activeDatasetIndex: 0,
			chartData: JSON.stringify(parsedData),
		});
	}

	hex2rgba(hex, a) {
		const parts = hex.replace('#', '').match(/.{1,2}/g);
		return `rgba(${parseInt(parts[0], 16)},${parseInt(
			parts[1],
			16
		)},${parseInt(parts[2], 16)},${a})`;
	}

	render() {
		// Setup the attributes
		const {
			attributes: { title, activeDatasetIndex, chartData, chartOptions },
			className,
			setAttributes,
			instanceId,
		} = this.props;

		const hex2rgba = this.hex2rgba;

		const parsedData = JSON.parse(chartData);
		const parsedOptions = JSON.parse(chartOptions);

		function updateChartJSON(json) {
			try {
				const data = JSON.parse(json);
				setAttributes({ chartData: JSON.stringify(data) });
			} catch (e) {
				return false;
			}
		}

		function updateShowLine(state) {
			const data = JSON.parse(chartData);
			data.datasets.forEach((dataset, index) => {
				data.datasets[index].showLine = state;
			});
			setAttributes({ chartData: JSON.stringify(data) });
		}

		function updateShowBackground(state) {
			const data = JSON.parse(chartData);
			data.datasets.forEach((dataset, index) => {
				data.datasets[index].fill = state;
			});
			setAttributes({ chartData: JSON.stringify(data) });
		}

		function updateShowGridLines(state, axis) {
			const options = JSON.parse(chartOptions);

			if ('x' === axis) {
				options.scales.xAxes[0].gridLines.display = state;
			}

			if ('y' === axis) {
				options.scales.yAxes[0].gridLines.display = state;
			}

			setAttributes({ chartOptions: JSON.stringify(options) });
		}

		function updatePointRadius(radius) {
			const data = JSON.parse(chartData);
			data.datasets.forEach((dataset, index) => {
				data.datasets[index].pointRadius = radius;
				data.datasets[index].hoverRadius = radius;
			});
			setAttributes({ chartData: JSON.stringify(data) });
		}

		function updateLineTension(tension) {
			const data = JSON.parse(chartData);
			data.datasets.forEach((dataset, index) => {
				data.datasets[index].lineTension = tension;
			});
			setAttributes({ chartData: JSON.stringify(data) });
		}

		function updateDatasetLabel(text, index) {
			const data = JSON.parse(chartData);
			data.datasets[index].label = text;
			setAttributes({ chartData: JSON.stringify(data) });
		}

		function updateDatasetColor(color, index) {
			const data = JSON.parse(chartData);
			data.datasets[index].borderColor = color;
			data.datasets[index].pointBackgroundColor = color;
			data.datasets[index].backgroundColor = hex2rgba(
				color,
				backgroundAlpha
			);
			setAttributes({ chartData: JSON.stringify(data) });
		}

		function updateDatasetPointStyle(style, index) {
			const data = JSON.parse(chartData);
			data.datasets[index].pointStyle = style;
			setAttributes({ chartData: JSON.stringify(data) });
		}

		function updateShowLegend(state) {
			const options = JSON.parse(chartOptions);
			options.legend.display = state;
			setAttributes({ chartOptions: JSON.stringify(options) });
		}

		function updateLegendPosition(position) {
			const options = JSON.parse(chartOptions);
			options.legend.position = position;
			setAttributes({ chartOptions: JSON.stringify(options) });
		}

		function updateLegendAlign(align) {
			const options = JSON.parse(chartOptions);
			options.legend.align = align;
			setAttributes({ chartOptions: JSON.stringify(options) });
		}

		function incrementActiveDataset() {
			setAttributes({ activeDatasetIndex: activeDatasetIndex + 1 });
		}

		function decrementActiveDataset() {
			setAttributes({ activeDatasetIndex: activeDatasetIndex - 1 });
		}

		return [
			<InspectorControls key="inspector">
				<PanelBody title="Chart Styles" initialOpen={true}>
					<ToggleControl
						label="Show Line"
						checked={parsedData.datasets[0].showLine}
						onChange={(state) => updateShowLine(state)}
					/>
					<ToggleControl
						label="Show Background"
						checked={parsedData.datasets[0].fill}
						onChange={(state) => updateShowBackground(state)}
					/>
					<ToggleControl
						label="Show X Axis Grid Lines"
						checked={
							parsedOptions.scales.xAxes[0].gridLines.display
						}
						onChange={(state) => updateShowGridLines(state, 'x')}
					/>
					<ToggleControl
						label="Show Y Axis Grid Lines"
						checked={
							parsedOptions.scales.yAxes[0].gridLines.display
						}
						onChange={(state) => updateShowGridLines(state, 'y')}
					/>
					<RangeControl
						label="Point Size"
						value={parsedData.datasets[0].pointRadius}
						onChange={(radius) => updatePointRadius(radius)}
						min={0}
						max={10}
					/>
					<RangeControl
						label="Curve"
						value={parsedData.datasets[0].lineTension * 20}
						onChange={(tension) => updateLineTension(tension / 20)}
						min={0}
						max={10}
					/>
				</PanelBody>
				<PanelBody title="Data Styles" initialOpen={false}>
					<Card>
						<CardHeader>
							<Flex>
								<FlexBlock>
									<RichText
										value={
											parsedData.datasets[
												activeDatasetIndex
											].label
										}
										onChange={(text) =>
											updateDatasetLabel(
												text,
												activeDatasetIndex
											)
										}
									/>
								</FlexBlock>
							</Flex>
						</CardHeader>
						{(parsedData.datasets[activeDatasetIndex].pointRadius >
							0 ||
							parsedData.datasets[activeDatasetIndex]
								.showLine) && (
							<CardBody>
								{parsedData.datasets[activeDatasetIndex]
									.pointRadius > 0 && (
									<SelectControl
										label="Point Style"
										value={
											parsedData.datasets[
												activeDatasetIndex
											].pointStyle
										}
										options={[
											{
												label: 'Circle',
												value: 'circle',
											},
											{
												label: 'Rectangle',
												value: 'rect',
											},
											{
												label: 'Rounded Rectangle',
												value: 'rectRounded',
											},
											{
												label: 'Diamond',
												value: 'rectRot',
											},
											{
												label: 'Triangle',
												value: 'triangle',
											},
										]}
										onChange={(style) =>
											updateDatasetPointStyle(
												style,
												activeDatasetIndex
											)
										}
									/>
								)}
								{parsedData.datasets[activeDatasetIndex]
									.showLine && (
									<BaseControl
										label="Color"
										id={`inspect-chart-line-border-color-${instanceId}`}
									>
										<ColorPalette
											value={
												parsedData.datasets[
													activeDatasetIndex
												].borderColor
											}
											clearable={false}
											onChange={(color) =>
												updateDatasetColor(
													color,
													activeDatasetIndex
												)
											}
										/>
									</BaseControl>
								)}
							</CardBody>
						)}
					</Card>
					<Flex>
						<FlexItem>
							<Button
								disabled={0 === activeDatasetIndex}
								isSmal={true}
								icon="arrow-left-alt2"
								label="Previous Dataset"
								onClick={decrementActiveDataset}
							/>
						</FlexItem>
						<FlexItem>
							<span>
								{activeDatasetIndex + 1} /{' '}
								{parsedData.datasets.length}
							</span>
						</FlexItem>
						<FlexItem>
							<Button
								disabled={
									activeDatasetIndex ===
									parsedData.datasets.length - 1
								}
								isSmal={true}
								icon="arrow-right-alt2"
								label="Next Dataset"
								onClick={incrementActiveDataset}
							/>
						</FlexItem>
					</Flex>
				</PanelBody>
				<PanelBody title="Legend" initialOpen={false}>
					<ToggleControl
						label="Show Legend"
						checked={parsedOptions.legend.display}
						onChange={(state) => updateShowLegend(state)}
					/>
					{parsedOptions.legend.display && (
						<SelectControl
							label="Legend Position"
							value={parsedOptions.legend.position}
							options={[
								{ label: 'Top', value: 'top' },
								{ label: 'Left', value: 'left' },
								{ label: 'Bottom', value: 'bottom' },
								{ label: 'Right', value: 'right' },
							]}
							onChange={(position) =>
								updateLegendPosition(position)
							}
						/>
					)}
					{parsedOptions.legend.display && (
						<SelectControl
							label="Legend Align"
							value={parsedOptions.legend.align}
							options={[
								{ label: 'Start', value: 'start' },
								{ label: 'Center', value: 'center' },
								{ label: 'End', value: 'end' },
							]}
							onChange={(align) => updateLegendAlign(align)}
						/>
					)}
				</PanelBody>
				<PanelBody title="Data" initialOpen={false}>
					<TextareaControl
						label="JSON"
						help="This is still a WIP"
						value={chartData}
						onChange={(json) => updateChartJSON(json)}
					/>
				</PanelBody>
			</InspectorControls>,
			<div className={className} key="editor">
				<RichText
					tagName="h3"
					placeholder="Line Chart"
					value={title}
					onChange={(value) => setAttributes({ title: value })}
				/>
				<div data={parsedData} options={parsedOptions} />
			</div>,
		];
	}
}

/**
 * Registers this as a block.
 *
 * @see https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('hello-charts/block-line', {
	title: __('Line Chart'),
	icon: 'chart-line',
	category: 'charts',
	keywords: [__('charts'), __('graph'), __('data')],
	attributes: {
		title: {
			type: 'string',
			default: '',
		},
		activeDatasetIndex: {
			type: 'integer',
			default: 0,
		},
		chartData: {
			type: 'string',
			default: JSON.stringify({
				labels: ['1', '2', '3', '4', '5', '6'],
				datasets: [
					{
						label: 'A',
						fill: false,
						showLine: true,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: ['generate'],
					},
					{
						label: 'B',
						fill: false,
						showLine: true,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: ['generate'],
					},
				],
			}),
		},
		chartOptions: {
			type: 'string',
			default: JSON.stringify({
				legend: {
					display: true,
					position: 'top',
					align: 'center',
				},
				scales: {
					xAxes: [
						{
							gridLines: {
								display: true,
							},
						},
					],
					yAxes: [
						{
							gridLines: {
								display: true,
							},
						},
					],
				},
			}),
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @see https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @return {*} JSX Component.
	 */
	edit: ChartLineBlock,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @see https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @return {*} JSX Frontend HTML.
	 */
	save: (props) => {
		return (
			<div className={props.className}>
				<RichText.Content
					tagName="h3"
					placeholder="Line Chart"
					value={props.title}
				/>
				<div data={props.chartData} />
			</div>
		);
	},
});
