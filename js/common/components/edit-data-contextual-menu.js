/**
 * WordPress dependencies.
 */
const { __, sprintf } = wp.i18n;
const { Component } = wp.element;
const {
	DropdownMenu,
	MenuItem,
	MenuGroup,
} = wp.components;

export default class EditDataContextualMenu extends Component {
	render() {
		const {
			props: {
				add,
				duplicate,
				index,
				itemIconKey,
				itemName,
				onClick,
				remove,
			},
		} = this;

		/**
		 * This is tied to the onBlur event of MenuItems inside DropDownMenus.
		 * This workaround is needed due to a bug affecting DropDownMenus.
		 * The default behaviour is to hide the DropDown's Popover when it
		 * loses focus, but this doesn't work in a Modal.
		 *
		 * @param {Event}			event	The triggering event.
		 * @param {function():void}	close	The callback function.
		 * @see https://github.com/WordPress/gutenberg/issues/32128
		 */
		function maybeClose( event, close ) {
			if ( ! event.relatedTarget || 'menuitem' !== event.relatedTarget.getAttribute( 'role' ) ) {
				setTimeout( close, 200 );
			}
		}

		return (
			<DropdownMenu
				icon="ellipsis"
				label={ __( 'Data Set Actions', 'hello-charts' ) }
				disableOpenOnArrowDown={ true }
				toggleProps={ { onClick } }
			>
				{ ( { onClose } ) => (
					<MenuGroup>
						<MenuItem
							icon={ `table-${ itemIconKey }-after` }
							onClick={ () => duplicate( index ) }
							onBlur={ ( event ) => maybeClose( event, onClose ) }
						>
							{
								/* Translators: Placeholder describes a row ("row") or column ("data set") */
								sprintf( __( 'Duplicate %s', 'hello-charts' ), itemName )
							}
						</MenuItem>
						<MenuItem
							icon={ `table-${ itemIconKey }-before` }
							onClick={ () => add( index ) }
							onBlur={ ( event ) => maybeClose( event, onClose ) }
						>
							{
								/* Translators: Placeholder describes a row ("row") or column ("data set") */
								sprintf( __( 'Add %s Before', 'hello-charts' ), itemName )
							}
						</MenuItem>
						<MenuItem
							icon={ `table-${ itemIconKey }-after` }
							onClick={ () => add( index + 1 ) }
							onBlur={ ( event ) => maybeClose( event, onClose ) }
						>
							{
								/* Translators: Placeholder describes a row ("row") or column ("data set") */
								sprintf( __( 'Add %s After', 'hello-charts' ), itemName )
							}
						</MenuItem>
						<MenuItem
							icon={ `table-${ itemIconKey }-delete` }
							onClick={ () => remove( index ) }
							onBlur={ ( event ) => maybeClose( event, onClose ) }
						>
							{
								/* Translators: Placeholder describes a row ("row") or column ("data set") */
								sprintf( __( 'Delete %s', 'hello-charts' ), itemName )
							}
						</MenuItem>
					</MenuGroup>
				) }
			</DropdownMenu>
		);
	}
}
