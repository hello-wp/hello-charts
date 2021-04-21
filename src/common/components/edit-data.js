/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	Button,
	Card,
	CardBody,
} = wp.components;

export default class EditData extends Component {
	render() {
		const { toggleEditor } = this.props;

		return (
			<Card isBorderless className="edit-data-card">
				<CardBody className="edit-data-card-body">
					<Button
						isSecondary
						label={ __( 'Toggle Data Editor' ) }
						onClick={ toggleEditor }
					>
						{ __( 'Edit Chart Data' ) }
					</Button>
				</CardBody>
			</Card>
		);
	}
}
