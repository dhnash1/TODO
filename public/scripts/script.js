var verbose = false;
$(function() {
    getIt();
    createClick();
    clicks();
    enter();
}); //end the dock rudder (Doc ready)


function sendIt(insides) {
    var sendyBits = {
        package: insides
    };
    $.ajax({
        type: 'POST',
        url: "/post",
        data: sendyBits,
        success: function(response) {
            if (verbose === true) console.log("Oh snap, we've got:", response);
        }
    });
} //Sends whatever is put as a parameter to get shoved into a database with reckless abandon.

function getIt() {
    $.ajax({
        type: 'GET',
        url: '/get',
        success: function(response) {
            if (verbose === true) console.log("whoop whoop!", response);
            add(response);
        }//gets that junk from the database
    });
}

function add(wah) {
    $('#theTable').html('');
    if (verbose === true) console.log('WAH', wah);
    for (var i = 0; i < wah.length; i++) {
        if (wah[i].complete === true) {
            $('#theTable').append("<tr id='" + wah[i].id + "' class='tableRow number" + [i] + "'><td class='main'>" + wah[i].task + "</td><td class='sec'><button class='completeButton'>&#10003;</button></td><td class='sec'><button class='deleteButton'>X</button></td>");
            $(".number" + [i]).addClass("colored");
        } else {
            $('#theTable').prepend("<tr id='" + wah[i].id + "' class='tableRow number" + [i] + "'><td class='main'>" + wah[i].task + "</td><td class='sec'><button class='completeButton'>&#10003;</button></td><td class='sec'><button class='deleteButton'>X</button></td>");
        }
    }//appends whatever is in wah to the dom
}

function clicks() {
    $('#theTable').on('click', '.completeButton', function() {
        if (verbose === true) console.log($(this).parents('tr').attr("id"));//THIS JUNK
        var taskID = $(this).parents('tr').attr("id");//THIS TOOK AN HOUR TO FIGURE OUT. THE ANSWER WAS SO SIMPLE.
        if (verbose === true) console.log(taskID);
        $.ajax({
            type: 'PUT',
            url: '/putdone',
            data: {
                task: taskID
            },
            success: function(response) {
                if (verbose === true) console.log("Task complete! Database Updated!");
                getIt();
            }
        }); //updates the database to reflect complete task.
    }); //Does CSS magic on a row when you click the done button
    $('#theTable').on('click', '.deleteButton', function() {
        $(this).parents('tr').remove();
        var taskID = $(this).parents('tr').attr("id");
        if (verbose === true) console.log(taskID);
        $.ajax({
            type: 'DELETE',
            url: '/deletetask',
            data: {
                task: taskID
            },
            success: function(response) {
                if (verbose === true) console.log("deleted!");
                getIt();
            }
        });
    }); //Deletes a row when ya click dat dere delete button
}

function enter() {
    $("#taskCreate").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#createButton").click();
        }
    });
}//allows user to press enter to submit

function createClick() {
    $('#createButton').on('click', function() {
        var newTask = $('#taskCreate').val();
        if (verbose === true) console.log("Golly gee, wouldja look what ive got!", newTask);
        $('#taskCreate').val('');
        sendIt(newTask);
        getIt();
    }); //Click to create new task
}
