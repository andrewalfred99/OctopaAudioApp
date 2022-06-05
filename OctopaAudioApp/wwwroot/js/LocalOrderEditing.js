function AddNewItem() {
    var OrderRef = $("#txtOrderRef").html();
    if (OrderRef == "") {
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
                var InputQty = $("<input />");
                InputQty.attr("type", "number");
                InputQty.val(Quantity.val());
                InputQty.addClass("form-control");
                cell.append(InputQty);

                var cell = $(row.insertCell(-1));
                var InputUnite= $("<input />");
                InputUnite.attr("type", "number");
                InputUnite.val(UnitePrice.val());
                InputUnite.addClass("form-control");
                cell.append(InputUnite);

                var cell = $(row.insertCell(-1));
                cell.html(Total.toFixed(2));

                cell = $(row.insertCell(-1));

                var btnRemove = $("<input />");
                btnRemove.attr("type", "button");
                btnRemove.attr("onclick", "RemoveModel(this);");
                btnRemove.val("Remove");
                btnRemove.addClass("btn btn-danger btn-sm");
                cell.append(btnRemove);

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
function DeleteFromDataBase(RawData) {
    var OrderRef = $("#lblOrderRef").html();
    var row = $(RawData).closest("TR");
    var Modelname = $("TD", row).eq(1).html();
    swal({
        title: "Are you sure?",
        text: "You want to Delete this item " + Modelname + "!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        function () {
            $.ajax({
                type: "POST",
                url: "/OrderStatus/DeleteLocalModelName?ModelName=" + Modelname + "&OrderRef=" + OrderRef,
                success: function () {
                    swal({
                        title: "Done",
                        text: 'Model ' + Modelname + ' Deleted successfully',
                        type: "success",
                        confirmButtonClass: "btn-primary",
                        confirmButtonText: "OK",
                        closeOnConfirm: false,
                        allowOutsideClick: false
                    },
                        function () {
                            window.location.reload();                        }
                    );
                },
                error: function () {
                    swal("Warning", 'Somthing Went Wrong', "error")
                }
            });
        }

    );


}
function UpdateLocalOrder()
{
    var OrderRef = $("#lblOrderRef").html();
    var NLOOH = {};
    if ($("#cehckDeliverd").prop('checked') == true) {
        NLOOH.Delivery = true;
    }
    else {
        NLOOH.Delivery = false;
    }
    var NLOOD = new Array();
    $("#tblItemsDetailes TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        Data.ModelName = row.find("TD").eq(1).html();
        Data.Qty = row.find("TD").eq(3).find("input").val();
        Data.UnitePrice = row.find("TD").eq(4).find("input").val();
        NLOOD.push(Data);
    });
    var Data = { NLOOH, NLOOD }
    $.ajax({
        type: "POST",
        url: "/OrderStatus/UpdateLocalOrder?OrderRef=" + OrderRef,
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            swal({
                title: "Done",
                text: 'Order With OrderRef ' + OrderRef +' Updated Successfully',
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
