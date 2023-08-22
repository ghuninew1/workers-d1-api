const cache = (c, o = true) => {
	if (o === true) {
		c.header('Expires', '0');
		c.header('Pragma', 'no-cache');
		c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
		return;
	} else if (o === false) {
		c.header('Expires', new Date(Date.now() + 3600 * 1000).toLocaleString());
		c.header('Cache-Control', 'public, max-age=3600, immutable' );

	}
};
export default cache;
