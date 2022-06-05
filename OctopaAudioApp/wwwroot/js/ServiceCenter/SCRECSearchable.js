$(document).ready(function () {

});

function SearchForData() {
    var RecNo = $("#txtRecNo").val();
    var Customer = $("#drpCust").val();
    var Type = $("#drpTypes").val();
    var From = $("#txtfromdate").val();
    var To = $("#txtToDate").val();
    $.ajax({
        type: "POST",
        url: "/ServiceCenterData/SearchForRec?RecNo=" + RecNo + "&Cystomer=" + Customer + "&Type=" + Type + "&From =" + From + "&TO=" + To,
        success: function (AllData) {
            console.log(AllData);
        },
        error: function () {
            swal("Warning", 'Somthing Went Wrong!', "error")
        }
    });
}