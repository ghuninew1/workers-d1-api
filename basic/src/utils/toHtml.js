export const convertTohtml = (obj) => {
	let html = '<ul>';
	for (let key in obj) {
		if (typeof obj[key] === 'object') {
			html += `<li>${key}: ${convertTohtml(obj[key])}</li>`;
		} else {
			html += `<li>${key}: ${obj[key]}</li>`;
		}
	}
	html += '</ul>';
	return html;
};
