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

function replaceProducts(page) {
    let brand = [];
    $('input[name="brand"]:checked').each(function() {
        brand.push(this.value);
    });
    console.log(brand);
    let color = [];
    $('input[name="color"]:checked').each(function() {
        color.push(this.value);
    });
    let style = [];
    $('input[name="style"]:checked').each(function() {
        style.push(this.value);
    });
    let material = [];
    $('input[name="material"]:checked').each(function() {
        material.push(this.value);
    });
    let width = [];
    $('input[name="width"]:checked').each(function() {
        width.push(this.value);
    });
    let sort = document.querySelector('input[name="sort"]:checked');

    let filter = {};
    if (color != null) {
        filter.color = { $in: color };
    }
    if (style != null) {

        filter.style = { $in: style };
    }
    if (brand != null) {

        filter.brand = { $in: brand };
    }
    if (material != null) {

        filter.material = { $in: material };
    }
    if (width != null) {

        filter.width = { $in: width };
    }
    if (sort != null) {
        sort = parseInt(sort.value);
    } else {
        sort = 1;
    }
    console.log(sort);
    console.log(filter);

    if (page == "current") {
        let page1 = $('.active.page a').html() || 1;
        console.log(page1);
        page = parseInt(page1);
    }

    //call server API to render products
    //đối số data truyền vào để gửi về server
    $.getJSON('/api/users/product_paging', { page, filter, sort }, function(data) {
        // // compile the template
        let template = Handlebars.compile($('#products').html());
        // // execute the compiled template and print the output to the console
        let products = data.footwears;
        let product_html = template({ products });
        $('#product-list-template').html(product_html);

        let template_nav_paging = Handlebars.compile($('#paging-nav-template').html());
        let pagination = data.pagination;
        let paging_nav_html = template_nav_paging({ pagination });
        $('#paging-nav').html(paging_nav_html);

    });


}

function replaceAccounts(page) {

    let filter = {};

    if (page == "current") {
        let page1 = $('.active.page a').html() || 1;
        console.log(page1);
        page = parseInt(page1);
    }

    $.getJSON('/api/users/account_paging', { page, filter, sort }, function(data) {
        // // compile the template
        let template = Handlebars.compile($('#account-list-template').html());
        // // execute the compiled template and print the output to the console
        let accounts = data.accounts;
        let product_html = template({ accounts });
        $('#accounts').html(product_html);

        let template_nav_paging = Handlebars.compile($('#paging-nav-template').html());
        let pagination = data.pagination;
        let paging_nav_html = template_nav_paging({ pagination });
        $('#paging-nav').html(paging_nav_html);

    });
}