var rlib = {
    setPage: (page) => {
        $('.page').removeClass('show');
        $('.page[data-page="'+page+'"]').addClass('show');
    },
    getPage: () => {
        return $('.page.show').data('page');
    },
};
function _json_decode(str, def = {}) {
	if (str === undefined || str === null)
		return def;
	if (typeof str != "string")
		return str; //already decoded?
	let obj = def;
	if (str == "")
		return obj;
	try {
		obj = JSON.parse(str);
	} catch (error) {
		console.warn("Invalid json " + str);
	}
	return obj;
}
function _json_encode(obj) {
	return JSON.stringify(obj);
}
function millis() {
    var d = new Date();
    return d.getTime();
}