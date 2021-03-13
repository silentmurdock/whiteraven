function onStart() {
	// TODO : Add your Initilize code here
	sf.scene.show('Main');
	sf.scene.focus('Main');
}

function onDestroy () {
	// stop your XHR or Ajax operation and put codes to distroy your application here
	sf.scene.hide('Main');
}
