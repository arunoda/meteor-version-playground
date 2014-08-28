var packageManagers = {};

Meteor.publish('packageManager', function(name) {
  if(packageManagers[name]) {
    throw new Meteor.Error(403, "existing package manager: " + name + " - create a new one");
  }

  this.ready();
  this.onStop(function() {
    var pm = packageManagers[name];
    if(pm) {
      packageManagers[name] = null;
      pm.cleanup();
    }
  });
});

Meteor.methods({
  publishPackages: function(name, packageList) {
    var pm = new PackageManager(name);
    packageManagers[name] = pm;
    
    packageList.forEach(function(args) {
      pm.publishPackage.apply(pm, args);
    });
  },

  resolve: function(name, deps) {
    var pm = packageManagers[name];
    try { 
      return {
        resolvedDeps: pm.resolve(deps)
      };
    } catch(ex) {
      return {
        error: ex.message
      };
    }
  }
});


function getPackageManager(name) {
  var pm = packageManagers[name];
  if(pm) {
    return pm;
  } else {
    throw new Meteor.Error(403, "no such packageManager: ", name);
  }
}