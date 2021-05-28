const icons = {
	bar: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M17.857,4.114C17.857,3.497 18.228,2.989 18.679,2.989L20.032,3.011C20.483,3.011 20.854,3.519 20.854,4.136L20.854,19.886C20.854,20.503 20.483,21.011 20.032,21.011L18.679,20.989C18.228,20.989 17.857,20.481 17.857,19.864L17.857,4.114Z" />
			<path d="M3.146,14.464C3.146,13.847 3.517,13.339 3.968,13.339L5.295,13.352C5.746,13.352 6.117,13.86 6.117,14.477L6.117,19.877C6.117,20.493 5.746,21.002 5.295,21.002L3.968,20.989C3.517,20.989 3.146,20.481 3.146,19.864L3.146,14.464Z" />
			<path d="M8.08,7.939C8.08,7.322 8.451,6.814 8.902,6.814L10.255,6.821C10.706,6.821 11.077,7.329 11.077,7.946L11.077,19.871C11.077,20.488 10.706,20.996 10.255,20.996L8.902,20.989C8.451,20.989 8.08,20.481 8.08,19.864L8.08,7.939Z" />
			<path d="M13.014,11.539C13.014,10.922 13.385,10.414 13.836,10.414L15.189,10.414C15.64,10.414 16.011,10.922 16.011,11.539L16.011,19.864C16.011,20.481 15.64,20.989 15.189,20.989L13.836,20.989C13.385,20.989 13.014,20.481 13.014,19.864L13.014,11.539Z" />
		</svg>
	),
	line: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<circle cx="4.485" cy="19.077" r="1.499" />
			<circle cx="8.709" cy="11.676" r="1.494" />
			<circle cx="15.189" cy="14.73" r="1.502" />
			<circle cx="19.459" cy="4.867" r="1.48" />
			<path d="M5.17,19.467L9.016,12.474C9.016,12.474 14.858,15.566 14.858,15.566C15.043,15.664 15.261,15.68 15.459,15.61C15.656,15.54 15.816,15.391 15.898,15.198L20.177,5.19C20.339,4.809 20.162,4.368 19.782,4.206C19.401,4.043 18.96,4.22 18.797,4.6L14.839,13.859C14.839,13.859 9.066,10.802 9.066,10.802C8.704,10.611 8.255,10.745 8.058,11.104L3.856,18.744C3.656,19.106 3.789,19.563 4.152,19.762C4.514,19.962 4.971,19.829 5.17,19.467Z" />
		</svg>
	),
	pie: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={ { fillRule: 'evenodd' } }>
			<path d="M3,12C3,7.062 7.062,3 12,3L12,12L21,12C21,16.937 16.938,21 12,21C7.062,21 3,16.937 3,12ZM4.5,12C4.5,8.398 7.094,5.355 10.5,4.652C10.5,4.652 10.5,12 10.5,12C10.5,12.828 11.171,13.5 12,13.5L19.347,13.5C18.644,16.906 15.602,19.5 12,19.5C7.885,19.5 4.5,16.114 4.5,12Z" />
			<path d="M14.015,9.984L14.015,3C17.398,3.947 20.052,6.601 21,9.984L14.015,9.984Z" />
		</svg>
	),
	radar: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M12.375,3.095C12.143,2.961 11.857,2.961 11.625,3.095L4.476,7.223C4.244,7.357 4.101,7.605 4.101,7.872L4.101,16.128C4.101,16.395 4.244,16.643 4.476,16.777L11.625,20.905C11.857,21.039 12.143,21.039 12.375,20.905L19.524,16.777C19.756,16.643 19.899,16.395 19.899,16.128L19.899,7.872C19.899,7.605 19.756,7.357 19.524,7.223L12.375,3.095ZM12,4.611L18.399,8.305C18.399,8.305 18.399,15.695 18.399,15.695C18.399,15.695 12,19.389 12,19.389C12,19.389 5.601,15.695 5.601,15.695C5.601,15.695 5.601,8.305 5.601,8.305L12,4.611Z" />
			<path d="M7.531,10.286L15.719,15.013C16.078,15.22 16.537,15.097 16.744,14.739C16.951,14.38 16.828,13.921 16.469,13.714L8.281,8.987C7.922,8.78 7.463,8.903 7.256,9.261C7.049,9.62 7.172,10.079 7.531,10.286Z" />
			<path d="M15.719,8.987L7.531,13.714C7.172,13.921 7.049,14.38 7.256,14.739C7.463,15.097 7.922,15.22 8.281,15.013L16.469,10.286C16.828,10.079 16.951,9.62 16.744,9.261C16.537,8.903 16.078,8.78 15.719,8.987Z" />
			<path d="M11.25,7.272L11.25,16.728C11.25,17.142 11.586,17.478 12,17.478C12.414,17.478 12.75,17.142 12.75,16.728L12.75,7.272C12.75,6.858 12.414,6.522 12,6.522C11.586,6.522 11.25,6.858 11.25,7.272Z" />
		</svg>
	),
	chartBackgroundOff: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M20.735,4.015C20.735,3.601 20.399,3.265 19.985,3.265L4.015,3.265C3.601,3.265 3.265,3.601 3.265,4.015L3.265,19.985C3.265,20.399 3.601,20.735 4.015,20.735L19.985,20.735C20.399,20.735 20.735,20.399 20.735,19.985L20.735,4.015ZM19.235,4.765L19.235,19.235C19.235,19.235 4.765,19.235 4.765,19.235C4.765,19.235 4.765,4.765 4.765,4.765L19.235,4.765Z" />
			<path d="M16.763,7.987C16.763,7.573 16.427,7.237 16.013,7.237L7.987,7.237C7.573,7.237 7.237,7.573 7.237,7.987L7.237,16.013C7.237,16.427 7.573,16.763 7.987,16.763L16.013,16.763C16.427,16.763 16.763,16.427 16.763,16.013L16.763,7.987ZM15.263,8.737L15.263,15.263C15.263,15.263 8.737,15.263 8.737,15.263C8.737,15.263 8.737,8.737 8.737,8.737L15.263,8.737Z" />
		</svg>
	),
	chartBackgroundOn: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M20.735,4.015C20.735,3.601 20.399,3.265 19.985,3.265L4.015,3.265C3.601,3.265 3.265,3.601 3.265,4.015L3.265,19.985C3.265,20.399 3.601,20.735 4.015,20.735L19.985,20.735C20.399,20.735 20.735,20.399 20.735,19.985L20.735,4.015ZM19.235,4.765L19.235,19.235C19.235,19.235 4.765,19.235 4.765,19.235C4.765,19.235 4.765,4.765 4.765,4.765L19.235,4.765Z" />
			<path d="M16.737,7.987C16.737,7.573 16.401,7.237 15.987,7.237L7.987,7.237C7.573,7.237 7.237,7.573 7.237,7.987L7.237,15.987C7.237,16.401 7.573,16.737 7.987,16.737L15.987,16.737C16.401,16.737 16.737,16.401 16.737,15.987L16.737,7.987Z" />
		</svg>
	),
	chartTitleOff: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={ { fillRule: 'evenodd' } }>
			<path d="M14.812,3.001C13.88,3.001 13.125,3.756 13.125,4.688L13.125,8.85C13.125,8.85 10.875,8.85 10.875,8.85C10.875,8.85 10.875,4.688 10.875,4.688C10.875,3.756 10.12,3.001 9.188,3.001L6.375,3.001C5.443,3.001 4.688,3.756 4.688,4.688L4.688,19.312C4.688,20.244 5.443,20.999 6.375,20.999L9.188,20.999C10.12,20.999 10.875,20.244 10.875,19.312L10.875,15.15C10.875,15.15 13.125,15.15 13.125,15.15C13.125,15.15 13.125,19.312 13.125,19.312C13.125,20.244 13.88,20.999 14.812,20.999L17.625,20.999C18.557,20.999 19.312,20.244 19.312,19.312L19.312,4.688C19.312,3.756 18.557,3.001 17.625,3.001L14.812,3.001ZM14.812,4.688L14.812,10.538L9.188,10.538L9.188,4.688L6.375,4.688L6.375,19.312L9.188,19.312L9.188,13.462L14.812,13.462L14.812,19.312L17.625,19.312L17.625,4.688L14.812,4.688Z" />
		</svg>
	),
	chartTitleOn: (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M14.812,4.688L14.812,10.538L9.188,10.538L9.188,4.688L6.375,4.688L6.375,19.312L9.188,19.312L9.188,13.462L14.812,13.462L14.812,19.312L17.625,19.312L17.625,4.688L14.812,4.688Z" />
		</svg>
	),
};

export default icons;
