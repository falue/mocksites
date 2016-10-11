function count(counter) {
	var was = document.getElementById('result_count').innerHTML.replace(/'/g, "");
	now = was.match(/\d+/);
	now = now - counter;
	
	if (now < 260000 && now > 120000) {
		document.getElementById('result_bar').style.width = "5%";
	} else if (now < 120000 && now > 50000) {
		document.getElementById('result_bar').style.width = "17%";
	} else if (now < 50000 && now > 1000) {
		document.getElementById('result_bar').style.width = "33%";
	} else if (now < 1000) {
		document.getElementById('result_bar').style.width = "100%";
	}
	
	if (now <= 0) {
		document.getElementById('result_count').innerHTML = "2 EINTR&Auml;GE";
	} else {
		document.getElementById('result_count').innerHTML = now.formatMoney(0,"'",".") + " EINTR&Auml;GE";
	}
}


Number.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator) {
    var n = this,
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSeparator = decSeparator == undefined ? "." : decSeparator,
        thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
        sign = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};