var packageData = {
  packages: '',
  deps: ''
};

var name;

SetName = function(n) {
  console.log('set...', n);
  name = n;
}

GetName = function() {
  return name;
}

UpdateUrl = function (obj) {
  _.extend(packageData, obj);

  var strData = encodeURIComponent(JSON.stringify(packageData));
  var name = GetName();
  Router.go('/pm/' + name + '?data=' + strData);
}

SetData = function(data) {
  var jsonData = JSON.parse(decodeURIComponent(data));
  _.extend(packageData, jsonData);

  Template.manager.rendered = function() {
    $('#package-store').val(packageData.packages);
    $('#application-deps').val(packageData.deps);
  };
} 