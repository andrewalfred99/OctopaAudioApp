
$(document).ready(function () {
    $("#drpUsers").select2();
    GetTechnical();
});

function UserSelectedChange() {
    var UserName = $("#drpUsers").val();
    var html = '';
    $.ajax({
        type: "GET",
        url: "/ServiceCenterData/GetAssingednTechnical?UserName" + UserName,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (User) {
            console.log(User);
            //if (User.length != 0) {
            //    for (var i = 0; i < User.length; i++) {
            //        html += '<li><input type="checkbox">' + User[i].technical + '</li>'
            //    }
            //    $('#TecList').html(html);
            //}
        },
        error: function () {
            swal("Sorry", "An error occured", "error")
        }
    })
}
function GetTechnical() {
    var html = '';
    $.ajax({
        type: "GET",
        url: "/ServiceCenterData/GetTechnicalAssin",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Technical) {
            if (Technical.length != 0) {
                for (var i = 0; i < Technical.length; i++) {
                    html += '<li><input type="checkbox">' + Technical[i].technical+'</li>'
                }
                $('#TecList').html(html);
            }
        },
        error: function () {
            swal("Sorry", "An error occured", "error")
        }
    })
}