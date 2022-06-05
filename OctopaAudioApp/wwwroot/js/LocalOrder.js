
function GetOrderRef() {
    var SupCode = $("#drpSuplliers").val();
    $.ajax({
        type: "GET",
        url: "/OrderStatus/GetOrderRef?SupCode=" + SupCode,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (OrderRef) {
            $("#txtOrderRef").html(OrderRef);
        }
    });
}
function ADDnewPyment() {
    var PaymentName = $("#txtPName").val();
    var PaymentValue = $("#txtPValue").val();
    var Comments = $("#txtPComments").val();
    if (PaymentName == "" || PaymentValue == 0) {
        swal("Sorry", "Please enter all values", "error")
    }
    else {
        
        var tBody = $("#tblPaymentMethods > TBODY")[0];
        var rows = tBody.insertRow(-1);

        var cell = $(rows.insertCell(-1));
        cell.html(PaymentName);

        var cell = $(rows.insertCell(-1));
        cell.html(Comments);

        var cell = $(rows.insertCell(-1));
        cell.html(PaymentValue);


        cell = $(rows.insertCell(-1));

        var btnRemove = $("<input />");
        btnRemove.attr("type", "button");
        btnRemove.attr("onclick", "Remove(this);");
        btnRemove.val("Remove");
        btnRemove.addClass("btn btn-danger btn-sm");
        cell.append(btnRemove);

        $("#txtPName").val("");
        $("#txtPValue").val("");
        $("#txtPComments").val("");
    }
}
function Remove(button) {
    //Determine the reference of the Row using the Button.
    var row = $(button).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to Delete This Row: " + name + "  and its seriales ")) {
        //Get the reference of the Table.
        var table = $("#tblPaymentMethods")[0];
        //Delete the Table row using it's Index.
        table.deleteRow(row[0].rowIndex);
    }
}
function AddNewItem() {
    var OrderRef = $("#txtOrderRef").html();
    if (OrderRef == "" ) {
        swal("Warning", 'Please select the supplier to do any updates for this Order..!', "error")
    }
    else {
        var ModelName = $("#txtModelName");
        var Items = [];
        var DataTable = $("#tblItemsDetailes");
        if (DataTable.length != 0) {
            $("#tblItemsDetailes TBODY TR").each(function () {
                var row = $(this);
                var Data = {};
                Data.ModelName = row.find("TD").eq(1).html();
                Items.push(Data);
            });
        }
        var DataS = Items.find(S => S.ModelName === ModelName.val());
        if (DataS != undefined) {
            swal("Warning", 'This ModelName is already exist you can not add it twice!', "error")
        }
        else {

            var rowCount = $('#tblItemsDetailes TBODY TR').length;
            var ModelName = $("#txtModelName");
            var Description = $("#txtDescription");
            var Quantity = $("#txtQuantity");
            var UnitePrice = $("#txtUnite");
            var Total = parseFloat(UnitePrice.val() * Quantity.val());

            if (ModelName.val() == "" || Quantity.val() == 0) {
                swal("Warning", 'ModelName or quantity   is missed please check if you fill it!', "error")
            }
            else {
                var tBody = $("#tblItemsDetailes > TBODY")[0];
                var row = tBody.insertRow(-1);

                var cell = $(row.insertCell(-1));
                cell.html(rowCount + 1);

                var cell = $(row.insertCell(-1));
                cell.html(ModelName.val());

                var cell = $(row.insertCell(-1));
                cell.html(Description.val());

                var cell = $(row.insertCell(-1));
                cell.html(Quantity.val());

                var cell = $(row.insertCell(-1));
                cell.html(UnitePrice.val());

                var cell = $(row.insertCell(-1));
                cell.html(Total.toFixed(2));

                cell = $(row.insertCell(-1));

                var btnRemove = $("<input />");
                btnRemove.attr("type", "button");
                btnRemove.attr("onclick", "RemoveModel(this);");
                btnRemove.val("Remove");
                btnRemove.addClass("btn btn-danger btn-sm");
                cell.append(btnRemove);
                CalculateTotal();
                CalFinalTotal();
            }
            //Clear the TextBoxes.
            ModelName.val("");
            Description.val("");
            Quantity.val("");
            UnitePrice.val("");

        }
    }
  
}
function RemoveModel(button) {
    //Determine the reference of the Row using the Button.
    var row = $(button).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to Delete This Row: " + name + "  and its seriales ")) {
        //Get the reference of the Table.
        var table = $("#tblItemsDetailes")[0];
        //Delete the Table row using it's Index.
        table.deleteRow(row[0].rowIndex);
    }
}
//Searching for model
function SearchForModelName() {
    var OrderRef = $("#txtOrderRef").html();
    if (OrderRef == "") {
        swal("Warning", 'Please select the supplier to do any updates for this Order..!', "error")
    }
    else {
        var ModelName = $("#txtModelName");
        if (ModelName.val() == "") {
            swal("Warning", 'You Search for nothing!', "error")
        }
        else {
            $.ajax({
                type: "POST",
                url: "/OrderStatus/SearchForModelNameLo?ModelName=" + ModelName.val(),
                success: function (ModelData) {
                    console.log(ModelData);
                    if (ModelData == null) {
                        swal("Warning", 'There is no data for this Model!', "error")
                    }
                    else {
                        var ModelName = $("#txtModelName");
                        var Description = $("#txtDescription");
                        ModelName.val(ModelData.modelName);
                        Description.val(ModelData.fullDescription);
                    }
                },
                error: function () {
                    swal("Warning", 'Somthing Went Wrong', "error")
                }
            });
        }
    }
   
}
// import Sheet Excel
function UploadSheetExcel() {
    var OrderRef = $("#txtOrderRef").html();
    if (OrderRef == "") {
        swal("Warning", 'Please select the supplier to do any updates for this Order..!', "error")
    }
    else {
        var html = '';
        var htmlE = '';
        var formData = new FormData();
        formData.append('file', $('#txtfile')[0].files[0]); // myFile is the input type="file" control
        $("#loader").show();
        $.ajax({
            type: "POST",
            url: "/OrderStatus/ImportSheetExcel",
            data: formData,
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            success: function (DataObject) {
                $("#loader").hide();
                console.log(DataObject);
                var ExistingItems = DataObject.existItems;
                var NotExistingItems = DataObject.notExisting;
                var ErrorMessage = DataObject.message;
                if (ErrorMessage != "") {
                    swal("Warning", ErrorMessage, "error")
                }
                else {
                    if (DataObject.notExisting.length != 0) {
                        for (var i = 0; i < NotExistingItems.length; i++) {
                            var RowNO = i + 1;
                            html += '<tr>'
                            html += '<td>' + RowNO + '</td>'
                            html += '<td>' + NotExistingItems[i].modelName + '</td>'
                            html += '<td>' + NotExistingItems[i].quantity + '</td>'
                            html += '<td>' + NotExistingItems[i].unit + '</td>'
                            html += '</tr>'
                        }
                        $('#listt').html(html);
                        $('#Mymodal').modal('show')
                    }
                    if (DataObject.existItems.length != 0) {
                        for (var i = 0; i < ExistingItems.length; i++) {
                            var RowNO = i + 1;
                            htmlE += '<tr>'
                            htmlE += '<td>' + RowNO + '</td>'
                            htmlE += '<td>' + ExistingItems[i].modelName + '</td>'
                            htmlE += '<td>' + ExistingItems[i].fullDescription + '</td>'
                            htmlE += '<td>' + ExistingItems[i].quantity + '</td>'
                            htmlE += '<td>' + ExistingItems[i].unitePrice + '</td>'
                            htmlE += '<td>' + parseFloat(ExistingItems[i].unitePrice * ExistingItems[i].quantity).toFixed(2) + '</td>'
                            htmlE += '<td><input onclick="RemoveModel(this)" value="Remove" type="button" class="btn btn-danger btn-sm"></td>'
                            htmlE += '</tr>'
                        }
                        $('#listOfexistitems').html(htmlE);

                    }

                    CalculateTotal();
                    CalFinalTotal();
                }

            },
            error: function () {
                swal("Warning", 'The Adress is requierd!', "error")
            }
        });

    }

    
}
function CalculateTotal() {
    var Total = 0;
    $("#tblItemsDetailes TBODY TR").each(function () {
        var row = $(this);
        var TotalItems = parseFloat(row.find("TD").eq(5).html());
        Total += TotalItems;
    });
    $("#lblTotal").html(Total.toFixed(2));
    //numberWithCommas(Total);
}
function numberWithCommas(x) {
    return $("#lblTotal").html(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}
function CalFinalTotal() {

    var Total = parseFloat($("#lblTotal").html());
    console.log(Total);
    $("#lblFinalTotal").html(Total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    var TotalWithVat = (Total * 14) / 100;
    $("#lbltotalwithVat").html(TotalWithVat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    var TotalWithProfitTax = (Total * 1) /100;
    $("#lblProfitTax").html(TotalWithProfitTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    var GrandTotal = Total +((Total * 14) / 100) -((Total * 1) / 100);
    $("#lblGrandTotal").html(GrandTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

}

//Cancel and saving Request
function CancelConfirmation() {
    
        swal({
            title: "Are you sure?",
            text: "You want to cancel this Request ....!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes",
            closeOnConfirm: false
        },
            function () {
                window.location = "/OrderStatus/LocalOrders"
            }

        );

}
function SaveRequest() {
    var Supllier = $("#drpSuplliers").val();
    var Currencies = $("#drpCurrencies").val();
    var DeliveryTo = $("#drpDeliveTo").val();
    //var Delivery = $("#checkDeliverd").is(":checked");
    var ProfitTax = $("#checkProfitTax").is(":checked");
    var Notes = $("#txtNotes").val();

    var NLOOH = {};
    NLOOH.Supplier = Supllier;
    NLOOH.DeliveryTo = DeliveryTo;
    NLOOH.Currency = Currencies;
   // NLOOH.Delivery = Delivery;
    NLOOH.ProfitTax = ProfitTax;
    NLOOH.Notes = Notes;

    var NLOOD = new Array();
    $("#tblItemsDetailes TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        Data.ModelName = row.find("TD").eq(1).html();
        Data.Qty = row.find("TD").eq(3).html();
        Data.UnitePrice = row.find("TD").eq(4).html();
        NLOOD.push(Data);
    });

    var NLOOP = new Array();

    $("#tblPaymentMethods TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        Data.PaymentName = row.find("TD").eq(0).html();
        Data.PValue = row.find("TD").eq(2).html();
        Data.PNote = row.find("TD").eq(1).html();
        NLOOP.push(Data);
    });
    var Data = { NLOOH, NLOOD, NLOOP }

    $.ajax({
        type: "POST",
        url: "/OrderStatus/SaveNewLocalRequest",
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (OrderRef) {
            swal({
                title: "Done",
                text: 'Order Saved Successfully',
                type: "success",
                confirmButtonClass: "btn-primary",
                confirmButtonText: "OK",
                closeOnConfirm: false,
                allowOutsideClick: false
            },
                function () {
                    window.location = "/OrderStatus/LocalOrderDetailes?OrderRef=" + OrderRef
                }
            );
        },
        error: function () {
            swal("Warning", 'Somthing Went Wrong', "error")
        }
    });
}
