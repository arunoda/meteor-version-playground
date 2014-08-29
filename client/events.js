Template.manager.events({
  "click #resolve": function() {
    
    var strDeps = $('#application-deps').val().trim();
    var deps = getDeps(strDeps);

    var strPackages = $('#package-store').val().trim();
    var packages = getPackages(strPackages);

    SetMessage("resolving...", true);
    Meteor.call('resolve', packages, deps, function(err, res) {
      if(err) {
        SetMessage(err.message);
      } else if(res.resolvedDeps){
        UpdateUrl({deps: strDeps, packages: strPackages});
        SetMessage(JSON.stringify(res.resolvedDeps, null, 2), true);
      } else if(res.error) {
        SetMessage("ERROR: " + res.error, true);
      }
    });
  }
});

function getPackages (strPackages) {
  var lines = strPackages.split('\n').map(doTrim).filter(doRemoveEmptyLines);
  var packages = [];
  for(var lc = 0; lc< lines.length; lc++) {
    var line = lines[lc];
    var rawPackageList = [];

    var parts = line.split(" ").map(doTrim).forEach(function(part) {
      if(part != "") {
        rawPackageList.push(part.split('@'));
      }
    });

    var firstPackage = rawPackageList.shift();
    var name = firstPackage[0];
    var version = firstPackage[1];
    var deps = {};

    rawPackageList.forEach(function(packageParts) {
      deps[packageParts[0]] = packageParts[1] || "";
    });

    packages.push([name, version, deps]);
  }

  return packages;
}

function getDeps (strDeps) {
  var lines = strDeps.split("\n").map(doTrim).filter(doRemoveEmptyLines);
  var deps = {};

  for(var lc = 0; lc< lines.length; lc++) {
    var line = lines[lc];
    var parts = line.split('@').map(doTrim);
    deps[parts[0]] = parts[1] || "";
  }

  return deps;
}

function getObj(str) {
  var obj;
  eval("obj = " + str);
  return obj;
}

function doTrim (line) {
  return line.trim();
}

function doRemoveEmptyLines(line) {
  if(!line || line == "") {
    return false;
  }

  return true;
}