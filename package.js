
Package.describe({
  summary: "Page trasition effects.",
  version: "3.1.0",
  name: "jelena:page-transitions",
});


Package.onUse(function (api) {
  api.addFiles('animation.css', 'client');
  api.addFiles('modernizr.custom.js', 'client');
  api.addFiles('transition.js', 'client');
});

