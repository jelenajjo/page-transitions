
Package.describe({
  summary: "Page trasition effects.",
  version: "2.1.0",
  name: "jelena:page-transitions",
  git: "https://github.com/jelenajjo/page-transitions.git"
});


Package.onUse(function (api) {
  api.addFiles('animation.css', 'client');
  api.addFiles('modernizr.custom.js', 'client');
  api.addFiles('transition.js', 'client');
});

