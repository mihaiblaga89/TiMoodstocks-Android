// Open a heavy-weight window
var win = Ti.UI.createWindow({
  fullscreen: false,
  navBarHidden: true
});
var view = Ti.UI.createScrollView({
  backgroundColor: 'black',
  opacity: 0.80
});
var label = Ti.UI.createLabel({
  color: 'white',
  width: Ti.UI.FILL,
  height: Ti.UI.FILL,
  text: 'Starting...',
  left: 10,
  right: 10,
  top: 10,
  bottom: 10,
});

// Helper
log = function(out){
  label.setText(label.getText()+'\n'+out);
};

// The module
var timoodstocks = require('com.kenhkan.timoodstocks.android');

// Events
timoodstocks.addEventListener('scannerOpenFailed', function(e){
  log('Failed to open scanner');
  log(e.code+' : '+e.message);
});
timoodstocks.addEventListener('scannerCloseFailed', function(e){
  log('Failed to close scanner');
  log(e.code+' : '+e.message);
});
timoodstocks.addEventListener('syncStarted', function(){
  log('Started to sync database from Moodstocks to cache');
});
timoodstocks.addEventListener('syncCompleted', function(){
  log('Completed to sync database from Moodstocks to cache');

  // Make sure we start scanning!
  scanner.resume();
});
timoodstocks.addEventListener('syncFailed', function(e){
  log('Failed to sync database from Moodstocks to cache');
  log(e.code+' : '+e.message);
});
timoodstocks.addEventListener('syncInProgress', function(progress){
  log('Syncing image database');
  log(progress.current+'/'+progress.total);
});

// Statuses
Ti.API.info("Is it compatible? " + timoodstocks.isCompatible());
Ti.API.info("Are we logged in? " + timoodstocks.isLoggedIn());

// Use your API key/secret pair
timoodstocks.login('key', 'secret');
Ti.API.info("Are we logged in now? " + timoodstocks.isLoggedIn());

if (Ti.Platform.name == "android") {
  // The scanner view
	var scanner = timoodstocks.createScannerView();

  // Events
  scanner.addEventListener('scanComplete', function(result){
    log('Scanning completed: '+result.value);
  });
  scanner.addEventListener('scanFailed', function(e){
    log('Scanning failed');
    log(e.code+' : '+e.message);
  });
  scanner.addEventListener('searchStart', function(e){
    log('Searching started');
    log(e.code+' : '+e.message);
  });
  scanner.addEventListener('searchComplete', function(result){
    log('Searching completed: '+result.value);
  });
  scanner.addEventListener('searchFailed', function(e){
    log('Searching failed');
    log(e.code+' : '+e.message);
  });

	win.add(scanner);
}

// Put in label
view.add(label);
win.add(view);
win.open();

// Sync with Moodstocks
scanner.sync()
