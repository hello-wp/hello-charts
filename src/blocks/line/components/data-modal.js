/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { useState } = wp.element;
const {
	Button,
	Modal,
	TextareaControl,
} = wp.components;

const DataModal = ( data ) => {
	const [ isOpen, setOpen ] = useState( false );

	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	return (
		<>
			<Button isSecondary className="edit-data" onClick={ openModal }>
				Edit Chart Data
			</Button>
			{ isOpen && (
				<Modal title={ __( 'Chart Data' ) } className="edit-data-modal" isDismissible focusOnMount shouldCloseOnEsc onRequestClose={ closeModal }>
					<TextareaControl label={ __( 'Data' ) } value={ data.data.datasets[ 0 ].data.join( ', ' ) + '\n' + data.data.datasets[ 1 ].data.join( ', ' ) } />
				</Modal>
			) }
		</>
	);
};

export default DataModal;

