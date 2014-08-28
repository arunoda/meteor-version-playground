var packageManagers = {};
var subscribedNames = {};

Meteor.publish('packageManager', function(name) {
  if(subscribedNames[name]) {
    throw new Meteor.Error(403, "existing package manager: " + name + " - create a new one");
  }

  subscribedNames[name] = true;
  this.ready();
  this.onStop(function() {
    var pm = packageManagers[name];
    if(pm) {
      packageManagers[name] = null;
      pm.cleanup();
    }
    subscribedNames[name] = null;
  });
});

Meteor.methods({
  publishPackages: function(name, packageList) {
    checkForname(name);
    var pm = new PackageManager(name);
    packageManagers[name] = pm;
    
    packageList.forEach(function(args) {
      pm.publishPackage.apply(pm, args);
    });
  },

  resolve: function(name, deps) {
    checkForname(name);
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


function checkForname(name) {
  var exists = subscribedNames[name];
  if(!exists) {
    throw new Meteor.Error(403, "please wait while loading for: " + name);
  }
}