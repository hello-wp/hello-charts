/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
} = wp.components;

export default class EditDataToolbar extends Component {
	render() {
		const { toggleEditor } = this.props;

		return (
			<Toolbar>
				<ToolbarGroup className="edit-data-toolbar" label={ __( 'Chart Options' ) }>
					<ToolbarButton
						icon="editor-table"
						label={ __( 'Edit Chart Data' ) }
						onClick={ toggleEditor }
					/>
				</ToolbarGroup>
			</Toolbar>
		);
	}
}
