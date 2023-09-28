
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
	if(typeof obj === 'string'){
		return obj;
	}
	return JSON.stringify(obj);
}
function _json_clone(obj){
	return _json_decode(_json_encode(obj));
}
function millis() {
	var d = new Date();
	return d.getTime();
}