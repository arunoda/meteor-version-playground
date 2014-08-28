Router.map(function() {
  this.route("home", {
    path: "/",
    onBeforeAction: function() {
      Router.go("/pm/" + Random.id());
    }
  });

  this.route("manager", {
    path: "/pm/:name",
    waitOn: function() {
      return Meteor.subscribe("packageManager", this.params.name, {onError: function(err) {
        if(err) {
          alert(err.message);
        }
      }});
    }
  })
});