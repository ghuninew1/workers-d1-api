// convert obj to html
export const convertTohtml = (obj) => {
	//convert obj to ul
	let tr = '';
	for (let key in obj) {
		if (typeof obj[key] === 'object') {
			tr += `<li><span class="key">${key} :: </span> <span class="obj"> ${convertTohtml(obj[key])}</span></li>`;
		} else {
			tr += `<li><span class="key">${key} :: </span> <span class="obj"> ${(obj[key])}</span></li>`;
		}
	}
	tr += '</>';

	return tr;
};

// html template
export const htmlTemp = (obj) => {
	let html = `<!DOCTYPE html>
	<html lang="en">
	<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="theme-color" content="#000">
	<link rel="icon" type="image/png" href="https://raw.githubusercontent.com/ghuninew1/ghuninew1/main/img/favicon.png"/>
	<link rel="apple-touch-icon" type="image/x-icon" href="https://raw.githubusercontent.com/ghuninew1/ghuninew1/main/img/favicon.ico"/>
	<link rel="manifest" href="https://raw.githubusercontent.com/ghuninew1/ghuninew1/main/img/manifest.json" />
	<title>GhuniNew</title>
	<style>
		*{
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body{
			background: #000;
			color: #fff;
			font-family: sans-serif;
			padding: 0;
			margin: 0 auto;
			width: 100%;
		}
		.api{
			margin: 0 auto;
			max-width: 1200px;
			padding: 10px;
		}
		ul {
			list-style: none;
			justify-content: center;
			align-items: center;
		}
		li {
			list-style: none;
			text-align: start;
		}
		ul li {
			padding: 10px;
			border: 0.1px solid #5b52522a;
			list-style: none;
			font-size: 14px;
		}
		.key{
			color: skyblue;
			font-weight: bold;
			font-size: 16px;
		}
		.obj{
			color: darkorange;
			font-size: 14px;
		}
		</style>
	</head>
	<body>
		<div class="api">
			<ul>${obj}</ul>
		</div>
	</body>
	</html>`;
	return html;
}

// insert convertTohtml to htmlTemp
export const toHtml = (obj) => {
	return htmlTemp(convertTohtml(obj));
}
