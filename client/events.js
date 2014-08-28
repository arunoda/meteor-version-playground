Template.manager.events({
  "click #publish": function() {
    var strPackages = $('#package-store').val();
    var lines = strPackages.split('\n').map(doTrim);
    var packages = [];
    for(var lc = 0; lc< lines.length; lc++) {
      var line = lines[lc];
      var parts = line.split(",").map(doTrim);
      var name = parts[0];
      var version = parts[1];

      try {
        var deps = (parts[2])? getObj(parts[2]) : {};
      } catch(ex) {
        return SetMessage("error when parsing: " + parts[2] + "\n> " + ex.message);
      }

      packages.push([name, version, deps]);
    }

    var name = GetName();
    Meteor.call('publishPackages', name, packages, function(err) {
      if(err) {
        SetMessage(err.message);
      } else {
        UpdateUrl({packages: strPackages});
        SetMessage('packges published!');
      }
    });
  },

  "click #resolve": function() {
    var strDeps = $('#application-deps').val();
    var lines = strDeps.split("\n").map(doTrim);
    var deps = {};

    for(var lc = 0; lc< lines.length; lc++) {
      var line = lines[lc];
      var parts = line.split('@').map(doTrim);
      deps[parts[0]] = parts[1] || "";
    }

    var name = GetName();
    Meteor.call('resolve', name, deps, function(err, res) {
      if(err) {
        SetMessage(err.message);
      } else if(res.resolvedDeps){
        UpdateUrl({deps: strDeps});
        SetMessage(JSON.stringify(res.resolvedDeps, null, 2), true);
      } else if(res.error) {
        SetMessage("ERROR: " + res.error, true);
      }
    });
  }
});

function getObj(str) {
  var obj;
  eval("obj = " + str);
  return obj;
}

function doTrim (line) {
  return line.trim();
}