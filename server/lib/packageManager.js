var semver = Npm.require('semver');

PackageManager = function(name) {
  var catelog = this._buildCatelog();
  this.resolver = new ConstraintSolver.PackagesResolver(catelog);
};

PackageManager.prototype.publishPackage = function(name, version, deps) {
  if (!this.Packages.findOne({name: name})) {
    this.Packages.insert({name: name});
  }

  var ecv = this._findEcv(name) || version;

  var constructedDeps = {};
  _.each(deps, function (constraint, name) {
    constructedDeps[name] = {
      constraint: constraint,
      references: [
        { arch: "os", targetSlice: "main", weak: false,
          implied: false, unordered: false },
        { arch: "web", targetSlice: "main", weak: false,
          implied: false, unordered: false }]
    };
  });
  this.Versions.insert({ packageName: name, version: version,
                    earliestCompatibleVersion: ecv,
                    dependencies: constructedDeps, timestamp: Date.now() });
  this.Builds.insert({ packageName: name, version: version,
                  buildArchitectures: "web+os" });
};

PackageManager.prototype._findEcv = function(name) {
  var firstVersion = this.Versions.findOne(
    {packageName: name}, 
    {sort: {timestamp: -1}}
  );

  if(firstVersion) {
    return firstVersion.version;
  }
};

PackageManager.prototype.cleanPackages = function() {
  this.Packages.remove({});
  this.Versions.remove({});
  this.Builds.remove({});
};

PackageManager.prototype.cleanup = function() {
  this.cleanPackages();
};

PackageManager.prototype.resolve = function(deps) {
  var dependencies = this._splitArgs(deps).dependencies;
  var constraints = this._splitArgs(deps).constraints;

  var resolvedDeps = this.resolver.resolve(dependencies, constraints);
  return resolvedDeps;
};

PackageManager.prototype._buildCatelog = function() {
  var Packages = this.Packages = new LocalCollection;
  var Versions = this.Versions =  new LocalCollection;
  var Builds = this.Builds = new LocalCollection;

  return catalogStub = {
    packages: Packages,
    versions: Versions,
    builds: Builds,
    getAllPackageNames: function () {
      return _.pluck(Packages.find().fetch(), 'name');
    },
    getPackage: function (name) {
      return this.packages.findOne({ name: name });
    },
    getSortedVersions: function (name) {
      return _.pluck(
        this.versions.find({
          packageName: name
        }, { fields: { version: 1 } }).fetch(),
        'version'
      ).sort(semver.compare);
    },
    getVersion: function (name, version) {
      return this.versions.findOne({
        packageName: name,
        version: version
      });
    }
  };
};

PackageManager.prototype._splitArgs = function (deps) {
  var dependencies = [], constraints = [];

  _.each(deps, function (constr, dep) {
    dependencies.push(dep);
    if (constr)
      constraints.push({ packageName: dep, type: (constr.indexOf("=") !== -1 ? "exactly" : "compatible-with"), version: constr.replace("=", "")});
  });
  return {dependencies: dependencies, constraints: constraints};
};

var splitArgs = function (deps) {
  var dependencies = [], constraints = [];

  _.each(deps, function (constr, dep) {
    dependencies.push(dep);
    if (constr)
      constraints.push({ packageName: dep, type: (constr.indexOf("=") !== -1 ? "exactly" : "compatible-with"), version: constr.replace("=", "")});
  });
  return {dependencies: dependencies, constraints: constraints};
};
