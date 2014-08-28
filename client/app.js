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
        return setMessage("error when parsing: " + parts[2] + "\n> " + ex.message);
      }

      packages.push([name, version, deps]);
    }

    var name = GetName();
    Meteor.call('publishPackages', name, packages, function(err) {
      if(err) {
        setMessage(err.message);
      } else {
        UpdateUrl({packages: strPackages});
        setMessage('packges published!');
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
        setMessage(err.message);
      } else if(res.resolvedDeps){
        UpdateUrl({deps: strDeps});
        setMessage(JSON.stringify(res.resolvedDeps, null, 2), true);
      } else if(res.error) {
        setMessage("ERROR: " + res.error, true);
      }
    });
  }
});

function getObj(str) {
  var obj;
  eval("obj = " + str);
  return obj;
}

var handler;
function setMessage(message, dontClean) {
  if(handler) {
    clearTimeout(handler);
    handler = null;
  }

  $('.messageBox').html(message);
  if(!dontClean) {
    handler = setTimeout(clearMessage, 5 * 1000);
  }
}

function clearMessage() {
  $('.messageBox').html('');
}

function doTrim (line) {
  return line.trim();
}