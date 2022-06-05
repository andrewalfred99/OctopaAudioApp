function CancelRequest() {
    var RequestNo = $("#lblRequestNo").html();
    swal({
        title: "Are you sure?",
        text: "You want to cancel this Request!  " + RequestNo,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        function () {
            $.ajax({
                type: "POST",
                url: "/ServiceCenterData/CancelRequest?ReqNo=" + RequestNo,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    if (json == "Sorry ,You can not cancel this report because its already Deliverd....") {
                        swal("Warning", json, "error")
                    }
                    else if (json == "Report Canceld Successfully") {
                        swal({
                            title: "Done",
                            text: 'json',
                            type: "success",
                            confirmButtonClass: "btn-primary",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        },
                            function () {
                                window.location = "/ServiceCenterData/GetAllreports";
                            }
                        );
                    }
                    else {
                        swal("Warning", json, "error")
                    }

                },
                error: function () {
                    swal("Warning", 'Somthing Went Wrong', "error")
                }
            });
        }

    );

}
function GetItemsOfThisDevice(DeviceData) {
    var table = $("#DeviceDetailes").DataTable();
    var $this = $(DeviceData);
    var tr = $(DeviceData).closest('tr');
    var row = table.row(tr);
    var SerialNO = $("TD", tr).eq(2).html();
    var RequestNO = $("#lblRequestNo").html();
 
     $.ajax({
        type: "POST",
         url: "/ServiceCenterData/GetDeviceItems?ReNO=" + RequestNO + "&SerialNO=" + SerialNO,
        success: function (DataforModel) {
            console.log(DataforModel);
             if (row.child.isShown()) {
                    // This row is already open - close it
                    // $this.removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    //$this.removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
                    row.child(format(DataforModel)).show();
                    tr.addClass('shown');
                }
        },
        error: function () {
            swal("Warning", 'The Adress is requierd!', "error")
        }
    });
}


function format(d) {
    console.log(d);
    // `d` is the original data object for the row
    html = '<table class="table table-striped table-bordered table-hoverd">' +
        '<thead style="background-color: #FD8C00">' +
        '<tr>'+
        '<th class="center">ModelName</th>' +
        '<th class="center">SerialNO</th>' +
        '<th class="center">BarCode</th>' +
        '<th class="center">Quantity</th>' +
        '<th class="center">UnitePrice</th>' +
        '</tr>' +
        '</thead>'
    for (var i = 0; i < d.length; i++) {

        html +=
            '<tbody>' +
            '<tr>' +
                '<td>' +  d[i].modelname + '</td>' +
                '<td>' +  d[i].serialNO + '</td>' +
                '<td>' +  d[i].barCode + '</td>' +
                 '<td>' + d[i].quantity + '</td>' +
                '<td >' + d[i].unitPrice + '</td>' +
            '</tr>' +
            '</tbody>'
    }

    html += '</table>';
    return html;
}
