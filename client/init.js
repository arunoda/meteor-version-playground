Template.manager.rendered = function() {
  var data = (location.hash)? location.hash.substr(1): null;
  var name = Random.id();
  SetName(name);
  SetMessage("Loading...", true);
  Meteor.subscribe('packageManager', name, {
    onError: function(err) {
      ClearMessage();
      SetMessage(err.message);
    },
    onReady: function() {
      SetMessage("Loaded Successfully.\n> Now Publish Packages!", true);
      SetData(data);
    }
  })
};