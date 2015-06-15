Meteor.startup(function(){
  $('#editChildModal').on('shown.bs.modal', function () {
  $('#first-name').focus()
  })
  $("input[type='image']").click(function() {
    $("input[id='upload-file']").click();
  });

  $("#upload-file").change(function(){
    readURL(this);
  });
})

if (Meteor.isClient) {
  Template.profiles.helpers({
    parents: function(){
      return Parents.find().fetch();
    },

    children: function(){
      return Children.find().fetch();
    }
  })

  Template.addprofile.events({
    'click #submit': function(event){
      event.preventDefault();
      var firstName = $('#first-name').val();
      var lastName = $('#last-name').val();
      var dob = $('#date-of-birth').val();
      var gender = $('#gender').val();

      var child = {
        firstName: firstName,
        lastName: lastName,
        dob: new Date(dob),
        gender: gender,
        parentId: 'MWW4XDpWStRXGkRef',
        bedTime: 1400
      }

      if($('#yesSleepingProblem').is(':checked')){
        var problem = 'sleeping_problem';
        var sleep_time = $('#bedTime').val();
        var notify_time = $('#notifyTime').val() * 60 + sleep_time;
        var frequency = $('#frequency').val() * 60;

        var problem = {
          code: problem,
          name: 'Does your child have problems sleeping?'
        }

        var addedProblem = Problems.insert(problem);

        child.bedTime = sleep_time;

        var addedChild = Children.insert(child);

        var trackable = {
          notifyAt: notify_time,
          promptInterval: 100,
          childId: addedChild,
          problemId: addedProblem,
          isProblemForChild: true
        }

        var addedTrackable = Trackables.insert(trackable)
      }

      var addedChild = Children.insert(child);

      document.getElementById('add-child-form').reset();
      $('#editChildModal').modal('hide');
    }
  })

  Template.sleepingProblem.events({
  // If the child has a sleeping problem, we will
  // construct a problem and trackable object and
  // later send it to the server.

  'click #sleepingProblemRadioGroup': function(event) {
    if($('#yesSleepingProblem').is(':checked')){
        Session.set("yesSelected", true);
      }
      else{
        Session.set("yesSelected", false)
      }
    }
  });

  Template.addprofile.helpers({
  yesSelected: function(){
    return Session.get("yesSelected");
  }
  });

  Template.child.events({
    'click #btneditdata': function(event){
      event.preventDefault();
      var parent = $(event.target).closest('.row');
      var child_id = parent.find('#child_id').text();
      Children.update({_id: child_id}, {$set: {firstName: "Roberta"}});
    }
  });

  Template.child.helpers({
    imageLocation: function() {
      var id = this._id;
      return "http://104.131.137.34/api/picture/?id=" + id;
    }
  });
}

function readURL(input) {
  if(input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          $('#added-photo').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
  }
}

// var $radioButtons = $('input:radio');

// function isRadioChecked(radioButtons){
//   var radioChecked = false;
//   $radioButtons.each(function(){
//     if(this.checked){
//       radioChecked = true;

//       return false;
//     }
//   });
//   return radioChecked;
// }
