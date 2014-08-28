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
      var name = this.params.name;
      if(this.params.data && name != GetName()) {
        name = Random.id();
      }

      SetName(name);

      return Meteor.subscribe("packageManager", name, {onError: function(err) {
        if(err) {
          alert(err.message);
        }
      }});
    },
    onAfterAction: function() {
      if(this.params.data) {
        SetData(this.params.data);
      }
    }
  })
});