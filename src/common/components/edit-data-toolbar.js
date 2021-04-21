/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	Toolbar,
	ToolbarButton,
} = wp.components;

export default class EditDataToolbar extends Component {
	render() {
		const { toggleEditor } = this.props;

		return (
			<Toolbar>
				<ToolbarButton
					icon="editor-table"
					label={ __( 'Edit Chart Data' ) }
					onClick={ toggleEditor }
				/>
			</Toolbar>
		);
	}
}
