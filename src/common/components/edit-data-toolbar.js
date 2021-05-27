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
		const { toggleEditor } = this.props;

		return (
			<ToolbarGroup className="edit-data-toolbar" label={ __( 'Chart Options', 'hello-charts' ) }>
				<ToolbarButton
					icon="editor-table"
					label={ __( 'Edit Chart Data', 'hello-charts' ) }
					onClick={ toggleEditor }
				/>
			</ToolbarGroup>
		);
	}
}
