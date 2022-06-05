$(document).ready(function () {
    $("#drpCustomer").select2();
});
function SearchForCustomer() {
    var CustCode = $("#drpCustomer").val();
    var html = '';
    $.ajax({
        type: "POST",
        url: "/ReceiptAccountViews/SearchForStamentCustomer?CustCode=" + CustCode,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (DataD) {
            console.log(DataD)
            var CustData = DataD;
            for (var i = 0; i < CustData.length; i++) {
                if (CustData[i].pOno == null ) {
                    CustData[i].pOno = 0;
                   
                }
              
                html += '<tr>'
                html += '<td>' + CustData[i].requestNo + '</td>'
                html += '<td>' + CustData[i].pOno + '</td>'
                html += '<td>' + CustData[i].amount + '</td>'
                html += '<td><textarea id="txtComment" class="form-control" cols="4" rows="3">' + CustData[i].comment +'</textarea></td>'
                html += '</tr>'
            }
            $('#CustomerDataTable').html(html);
        },
        error: function () {
            swal("Warning", 'Somthing went wrong', "error")
        }
    });
}
function SaveDataCustmer() {
    var CustCode = $("#drpCustomer").val();
    var StateComment = new Array();
    $("#tableComment TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        var CheckComment = row.find("TD").eq(3).find("textarea").val();
        if (CheckComment != "") {
            Data.RequestNo = row.find("TD").eq(0).html().trim();
            Data.PONO = row.find("TD").eq(1).html().trim();
            Data.Total = row.find("TD").eq(2).html().trim();
            Data.Comment = row.find("TD").eq(3).find("textarea").val();
            StateComment.push(Data);
        }
    });
    var Data = { StateComment };
    console.log(Data);
    $.ajax({
        type: "POST",
        url: "/ReceiptAccountViews/SaveStateMentComment?CustC=" + CustCode,
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            swal({
                title: "Done",
                text: 'Data saved successfully',
                type: "success",
                confirmButtonClass: "btn-primary",
                confirmButtonText: "OK",
                closeOnConfirm: false,
                AllowOutsideClick: false
            },
                function () {
                    window.location.reload();
                }
            );
        },
        error: function () {
            swal("Warning", 'Somthing went wrong', "error")
        }
    });
}
$("body").on("click", "#btnCancel", function () {
    //var CustCode = $("#drpCustomer");
    swal({
        title: "Are you sure?",
        text: "You want to cancel this Request!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false,
        AllowOutsideClick: false,
    },
        function () {
            window.location = "/ReceiptAccountViews/ReceivableCycle";
        }
    );
});