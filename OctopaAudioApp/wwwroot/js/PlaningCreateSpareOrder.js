function CancelOrder() {
    var RequestNo = $("#txtRequestNo");
    $.ajax({
        type: "POST",
        url: "/AllocatedItems/RejectSPOrder?RequestNO=" + RequestNo.val(),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            swal({
                title: "Done",
                text: json,
                type: "success",
                confirmButtonClass: "btn-primary",
                confirmButtonText: "OK",
                closeOnConfirm: false
            },
                function () {
                    window.location = "/Home/Index"
                }
            );
        },
        error: function (json) {
            swal("Warning", json, "error")
        }
    });
}

function SaveNewSPO() {
    var RequestNo = $("#txtRequestNo");
    var Notes = $("#txtNotes");
    var Supllier = $("#drpSupllier");
    var Currancey = $("#drpCurrency");
    var Total = $("#txtTotal");
    $.ajax({
        type: "POST",
        url: "/AllocatedItems/ApproveAndCreateSPOrder?RequestNO=" + RequestNo.val() + "&Notes=" + Notes.val() + "&Supllier=" + Supllier.val() + "&Currancey=" + Currancey.val() + "&Total=" + Total.val(),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (DataObject) {
            var RequestNo = DataObject.req;
            var OrderRef = DataObject.orderRef;
            swal({
                title: "Done",
                text: 'Data Saved Done',
                type: "success",
                confirmButtonClass: "btn-primary",
                confirmButtonText: "OK",
                closeOnConfirm: false,
                allowOutsideClick: false
            },
                function () {
                    window.location = "/AllocatedItems/Details?id=" + RequestNo + "&OrderRef=" + OrderRef
                }
            );
        },
        error: function () {
            swal("Warning", 'somthing went worng', "error")
        }
    });
}