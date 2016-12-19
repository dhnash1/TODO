console.log('READY!');
$(function(){
  getIt();
  createClick();
  clicks();
  enter();
});//end the dock rudder


function sendIt(insides){
  var sendyBits = {
    package:insides
  };
  $.ajax({
    type:'POST',
    url:"/post",
    data:sendyBits,
    success: function(response){
      console.log("Oh snap, we've got:", response);
    }
  });
}//Sends whatever is put as a parameter to get shoved into a database with reckless abandon.

function getIt(){
  $.ajax({
    type:'GET',
    url:'/get',
    success: function(response){
      console.log("whoop whoop!", response);
        add(response);
    }
  });
}

function add(wah){
  $('#theTable').html('');
  console.log('WAH', wah);
  for (var i = 0; i < wah.length; i++) {
    if (wah[i].complete === true) {
      $('#theTable').append("<tr id='" + wah[i].id + "' class='tableRow number" + [i] + "'><td class='main'>" + wah[i].task + "</td><td class='sec'><button class='completeButton'>&#10003;</button></td><td class='sec'><button class='deleteButton'>X</button></td>");
      $(".number" + [i]).addClass("colored");
    }else{
    $('#theTable').prepend("<tr id='" + wah[i].id + "' class='tableRow number" + [i] + "'><td class='main'>" + wah[i].task + "</td><td class='sec'><button class='completeButton'>&#10003;</button></td><td class='sec'><button class='deleteButton'>X</button></td>");
  }
  }
}

function clicks(){
  $('#theTable').on('click', '.completeButton', function(){
    console.log($(this).parents('tr').attr("id"));
    var taskID = $(this).parents('tr').attr("id");
    console.log(taskID);
    $.ajax({
      type:'PUT',
      url:'/putdone',
      data:{task: taskID},
      success: function( response ) {
        console.log("Task complete! Database Updated!");
        getIt();
      }
    });//updates the database to reflect complete task.
  });//Does CSS magic on a row when you click the done button
  $('#theTable').on('click', '.deleteButton', function(){
    $(this).parents('tr').remove();
    var taskID = $(this).parents('tr').attr("id");
    console.log(taskID);
    $.ajax({
      type:'DELETE',
      url:'/deletetask',
      data:{task: taskID},
      success: function( response ){
        console.log("deleted!");
        getIt();
      }
    });
  });//Deletes a row when ya click the delete button
}
function enter(){
  $("#taskCreate").keyup(function(event){
    if(event.keyCode == 13){
        $("#createButton").click();
    }
});
}

function createClick(){
  $('#createButton').on('click', function(){
    var newTask = $('#taskCreate').val();
    console.log("Golly gee, wouldja look what ive got!", newTask);
    $('#taskCreate').val('');
    sendIt(newTask);
    getIt();
  });//end that fancy click business
}
