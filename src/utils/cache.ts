const cache = (c: any, o = true) =>{
	if (o === true) {
		c.header('Expires', '0');
		c.header('Pragma', 'no-cache');
		c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
		return;
	} else if (o === false) {
		c.header('Expires', new Date(Date.now() + 3600 * 1000).toLocaleString());
		c.header('Cache-Control', 'public, max-age=3600, immutable' );
		// c.header('Accept-Encoding', 'gzip, deflate, br');
		// c.header('Vary', 'Accept-Encoding');
		// c.header('Pragma', 'cache');
		// c.header('Last-Modified', new Date(Date.now() - 3600 * 1000).toLocaleString() );
		// c.header('Cache-Control', 's-maxage=10, immutable' );
		return;
	}
};
export default cache;
