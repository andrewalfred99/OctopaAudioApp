$(document).ready(function () {
    $("#loader").hide();
    $("#btnAddCost").hide();  
});
var InView = []; var array = [];
function SearchForInvoice() {
    $("#loader").show();
    var txtVal = $("#txtStartDate").val();
    var txtVal2 = $("#txtEndDate").val();
    $.ajax({
        type: "POST",
        url: "/InvoiceCost/Select?StartDate=" + txtVal + "&EndDate=" + txtVal2,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json.length != 0) {
                $("#loader").hide();
                $("#btnAddCost").show();
                InView = json;
                Drawtable();
            }
            else {
                swal("Sorry", "Sorry There is no data to show", "error")
            }
           
        }
    });
}

function AddCost() {
    $.ajax({
        type: "POST",
        url: '/InvoiceCost/AddCostEntry',
        data: JSON.stringify(array),
        contentType: 'application/json; charset=utf-8',
        success: function (Message) {
            if (Message == "Data Saved Done") {
                swal({
                    title: "Done",
                    text: 'Data Saved Successfully',
                    type: "success",
                    confirmButtonClass: "btn-primary",
                    confirmButtonText: "OK",
                    closeOnConfirm: false,
                    allowOutsideClick: false
                },
                    function () {
                        window.location.reload();
                    }
                );
            }
            else {
                swal("Sorry", Message, "error")
            }
        },
        error: function (x, y, z) {
        }
    });
}
function Drawtable() {
    var html = ''
    for (var i = 0; i < InView.length; i++) {
        date = new Date(InView[i].invoicDate)
        InView[i].invoicDate = date.toLocaleDateString('en-GB') + '</td>'
        InView[i].total = InView[i].total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        InView[i].salesTax = InView[i].salesTax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>'
        InView[i].gTotal = InView[i].gTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>'
        InView[i].totalEGP = InView[i].totalEGP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>'
        html += '<td> <input type="checkbox" id="chkCost" checked="checked" onclick="CostEntry()"> </td>'
    }
    $("#invData").html(html);
    var htmltbl = '<table id="Items_tbl" class="table table-hover table-bordered" id="datatable-default" style=" width: -webkit-fill-available;text-align:center" cellspacing="0" ><thead class="bg-dark">'
    htmltbl += '<tr class="text-uppercase font-size-1" >'
    htmltbl += '<th scope="col" class="center"><div class="d-flex justify-content-between align-items-center">Invoice no<div class="ml-1"></div></div></th>'
    htmltbl += '<th scope="col" class="center">Invoice Date</th>'
    htmltbl += '<th scope="col" class="center">Customer</th>'
    htmltbl += '<th scope="col" class="center">Currency</th>'
    htmltbl += '<th scope="col" class="center">Rate</th>'
    htmltbl += '<th scope="col" class="center">Type</th>'
    htmltbl += '<th scope="col" class="center">Tax</th>'
    htmltbl += '<th scope="col" class="center">Invoice Total</th>'
    htmltbl += '<th scope="col" class="center">VAT</th>'
    htmltbl += '<th scope="col" class="center">Total</th>'
    htmltbl += '<th scope="col" class="center">TotalEGP</th>'
    htmltbl += '<th scope="col" class="center">Canceled</th>'
    htmltbl += '<th scope="col" class="center">Reason</th>'
    htmltbl += '<th scope="col" class="center">Check</th>'
    htmltbl += '</tr></thead></table> ';

    $('#ItemsTable').html(htmltbl);
    var table = $('#Items_tbl').DataTable({
        "data": InView,
        "columns": [
            { data: "invoiceNO" },
            { data: "invoicDate" },
            { data: "custName" },
            { data: "currency" },
            { data: "rate" },
            { data: "type" },
            { data: "tax" },
            { data: "total" },
            { data: "salesTax" },
            { data: "gTotal" },
            { data: "totalEGP" },
            { data: "canceld" },
            { data: "reason" },
            {
                "className": '',
                "orderable": false,
                "data": "ID",
                "mRender": function (data, type, full) {
                    return '<input type="checkbox" id="' + full.invoiceNO + '" onclick="CostEntry(' + full.invoiceNO + ')">'
                }
            },
        ],
        "order": [[1, 'asc']]
    });
}
function CostEntry(id) {
    console.log(id, document.getElementById(id).checked)
    if (document.getElementById(id).checked) {
        array.push(id)
    } else {
        removeItemOnce(array, id)
    }
    console.log(array)
}
function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}