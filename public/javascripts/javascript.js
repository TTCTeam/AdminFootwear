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