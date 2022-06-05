$(document).ready(function () {
    $("#loader").hide();
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#listt tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
function SearchForData() {
    var html = '';
    $("#loader").show();
    var Customer = $("#drpCust");
    var FromDate = $("#txtfromdate").val();
    var ToDate = $("#txtToDate").val();
    var RecNp = $("#txtRecNo").val();
    $.ajax({
        type: "GET",
        url: "/ServiceCenterData/GetSearchValueforInvoice?CustID=" + Customer.val() + "&RequestNo=" + RecNp + "&end=" + ToDate + "&start=" + FromDate,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Alldata) {
            console.log(Alldata);
            if (Alldata.length != 0) {
                $("#loader").hide();
                for (var i = 0; i < Alldata.length; i++) {
                    var NO = i + 1;
                    html += '<tr>'
                    html += '<td>' + NO + '</td>'
                    html += '<td><input type="button" target="_blank" onclick="InvoiceDetailes(' + Alldata[i].requestNO + ')"  value="' + Alldata[i].requestNO + '"  style="color:orangered;border-color:transparent"/></td>'
                    html += '<td>' + Alldata[i].formatedDate + '</td>'
                    html += '<td>' + Alldata[i].custName + '</td>'
                    html += '<td>' + Alldata[i].formatedTotal + '</td>'
                    html += '<td>' + Alldata[i].type + '</td>'
                    html += '</tr>'
                }
                $('#listt').html(html);
                $("#loader").hide();
            }
            else {
                $("#loader").hide();
                swal("Sorry", "There is no data to show", "error")
            }
        },
        error: function () {
            swal("Sorry", "An error occured", "error")
        }
    })
}
function InvoiceDetailes(ReqNo) {
    window.open("/ServiceCenterData/InvoiceDeatiles?RequestNo=" + ReqNo ,"_blank");
}
function CheckallData() {
    var CustomerName = "";
    var RequestNN = "";
    var Checked = true;
    $("#PendingInvoiceData TBODY TR").each(function () {
        var row = $(this);
        var CehckD = row.find("TD").eq(6).find("input").is(':checked');
        var CheckCustomerName = row.find("TD").eq(4).html().toString();
        var RequestNo = row.find("TD").eq(0).html().toString();
        if (CehckD == true) {
            console.log(CheckCustomerName);
            if (CustomerName != "") {
                if (CustomerName != CheckCustomerName) {
                    swal("Sorry", "The selected Receips not in the same DocNO , Action Canceld", "error")
                    Checked = false;
                }
            }
            else {
                CustomerName = CheckCustomerName;    
            }

            if ($("#lblMRequestNO").html() == "") {
                RequestNN += RequestNo;
                $("#lblMRequestNO").html(RequestNN);
            }
            else if ($("#lblMRequestNO").html() != "") {
                RequestNN += "," + RequestNo;
                $("#lblMRequestNO").html(RequestNN);
            }
        }
    });
    if (Checked) {
        var Requests =  $("#lblMRequestNO").html();
        $.ajax({
            type: "GET",
            url: "/ServiceCenterData/GetNewInvoiceData?RequestNO=" + Requests ,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Object) {
                console.log(Object);
                var CustomerName = Object.custName;
                var CustCode = Object.custCode;
                var CheckTax = Object.chkTax;
                var NrequestNo = Object.nReqNO;
                $("#LblNewRequestNO").html(NrequestNo);
                $("#lblCustomerName").html(CustomerName);
                if (CheckTax == "True") {
                    $("#lblIncludeTax").html("Yes");
                }
                else {
                    $("#lblIncludeTax").html("NO");
                }
                $("#lblCustCode").html(CustCode);
            },
            error: function () {
                swal("Sorry", "Somthing Went Wrong ...!!", "error")
            }
        });
        $('#ModelCreateInvoice').modal({ backdrop: 'static', keyboard: false })
        $("#ModelCreateInvoice").modal('show');
    }
}
function AddNewrawtotable() {
    var Desc = $("#txtNoteFooter").val();
    var Qty = $("#txtQuantity").val();
    var Unite = $("#txtUnitePrice").val();
    var rowCount = $('#tblInvoiceDetailes TBODY TR').length;
    if (Desc == "" || Qty == 0 || Unite == 0) {
        swal("Sorry", "Please enter all values", "error")
    }
    else {
        var tBody = $("#tblInvoiceDetailes > TBODY")[0];
        var row = tBody.insertRow(-1);

        var cell = $(row.insertCell(-1));
        cell.html(rowCount + 1);

        var cell = $(row.insertCell(-1));
        cell.html(Desc);

        var cell = $(row.insertCell(-1));
        cell.html(Qty);

        var cell = $(row.insertCell(-1));
        cell.html(Unite);

        var Total = (parseFloat((Qty * Unite)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var cell = $(row.insertCell(-1));
        cell.html(Total);

        cell = $(row.insertCell(-1));

        var btnRemove = $("<input />");
        btnRemove.attr("type", "button");
        btnRemove.attr("onclick", "Remove(this);");
        btnRemove.val("Remove");
        btnRemove.addClass("btn btn-danger btn-sm");
        cell.append(btnRemove);
    }

    // Clear All Foter
     $("#txtNoteFooter").val("");
     $("#txtQuantity").val(0);
    $("#txtUnitePrice").val(0);
    CalculateTotal();
}
function Remove(button) {
    //Determine the reference of the Row using the Button.
    var row = $(button).closest("TR");
    var NO = $("TD", row).eq(0).html();
    if (confirm("Do you want to Delete This Row NO  (: " + NO + " ) and its Data")) {
        //Get the reference of the Table.
        var table = $("#tblInvoiceDetailes")[0];
        //Delete the Table row using it's Index.
        table.deleteRow(row[0].rowIndex);
    }
    CalculateTotal();
}
function CalculateTotal() {
    var Total = 0;
    $("#tblInvoiceDetailes TBODY TR").each(function () {
        var row = $(this);
        var TotalItems = parseFloat(row.find("TD").eq(4).html().replace(',', ''));
        Total += TotalItems;
    });
    $("#lblTotalG").html(Total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    //numberWithCommas(Total);
}

function SaveNewInvoice() {
    var rowCount = $('#tblInvoiceDetailes TBODY TR').length;
    console.log(rowCount);
    if (rowCount <= 0) {
        swal("Sorry", "Sorry,You did not insert any data to save", "error")
    }
    else if (rowCount > 0) {
        var NORequests = $("#lblMRequestNO").html();
        console.log(NORequests);
        var Customer = $("#lblCustCode").html();
        var Notes = $("#txtNoteNewInvoice").val();
        var Type = $("#lblInvoiceType").html();
        var IncludeTax = $("#lblIncludeTax").html();
        var FreeTax = $("#chekfreetax").is(":checked");
        var NMIN = {};
        NMIN.Customer = Customer;
        NMIN.Notes = Notes;
        NMIN.Type = Type;
        NMIN.FreeTax = FreeTax;
        if (IncludeTax == "Yes") {
            NMIN.IncludeTax = true;
        }
        else {
            NMIN.IncludeTax = false;
        }
        var NMINVD = new Array();
        $("#tblInvoiceDetailes TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.Description = row.find("TD").eq(1).html();
            Data.Quantity = row.find("TD").eq(2).html();
            Data.UnitPrice = row.find("TD").eq(3).html();
            NMINVD.push(Data);
        });
        var Data = { NMIN, NMINVD };
        console.log(Data);
        $.ajax({
            type: "POST",
            url: "/ServiceCenterData/SaveNewInvoice?RequestUpdate=" + NORequests,
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                swal({
                    title: "Done",
                    text: 'Invoice Created Successfully',
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
            },
            error: function () {
                swal("Warning", 'Somthing Went Wrong', "error")
            }
        });
    }
}

