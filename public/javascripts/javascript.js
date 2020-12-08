function preLogin() {
    let username = $('#username').val();
    let password = $('#password').val();
    console.log(username);
    console.log(password);
    var notif = document.getElementById('notif');
    if (username == "foootwear") {
        if (password == "TTC123") {
            return true;
        }
    }
    notif.innerHTML("Account and password do not match.");
    return false;
}

//Clone the hidden element and shows it
$('.add-one').click(function() {
    $('.dynamic-element').first().clone().appendTo('.dynamic-stuff').show();
    attach_delete();
});


//Attach functionality to delete buttons
function attach_delete() {
    $('.delete').off();
    $('.delete').click(function() {
        console.log("click");
        $(this).closest('.form-group').remove();
    });
}