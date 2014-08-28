var packageData = {
  packages: '',
  deps: ''
};

var name;

SetName = function(n) {
  name = n;
}

GetName = function() {
  return name;
}

UpdateUrl = function (obj) {
  _.extend(packageData, obj);

  var strData = encodeURIComponent(JSON.stringify(packageData));
  var name = GetName();
  location.href = '/#' + strData;
}

SetData = function(data) {
  var jsonData = JSON.parse(decodeURIComponent(data));
  _.extend(packageData, jsonData);

  if(Template.manager.rendered) {
    setValues();
  } else {
    Template.manager.onRendered = setValues;
  }

  function setValues () {
    $('#package-store').val(packageData.packages);
    $('#application-deps').val(packageData.deps);
  }
} 

var handler;
SetMessage = function (message, dontClean) {
  if(handler) {
    clearTimeout(handler);
    handler = null;
  }

  $('.messageBox').html(message);
  if(!dontClean) {
    handler = setTimeout(ClearMessage, 5 * 1000);
  }
}

ClearMessage = function () {
  $('.messageBox').html('');
}