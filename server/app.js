Meteor.methods({
  resolve: function(packageList, deps) {
    var pm = new PackageManager();
    packageList.forEach(function(args) {
      pm.publishPackage.apply(pm, args);
    });

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