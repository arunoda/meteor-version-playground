Template.manager.rendered = function() {
  var data = (location.hash)? location.hash.substr(1): null;
  var name = Random.id();
  SetName(name);
  SetData(data);
};