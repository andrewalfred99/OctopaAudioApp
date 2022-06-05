var SerialesData = [];
$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#ListOfSearchItem tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
// remove item from sql
function RemoveItemFromDB(RequestNO, ModelName) {
    swal({
        title: "Are you sure?",
        text: "You Will Delete this item ...!" + ModelName,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false,
        allowOutsideClick: false
    },
        function () {
            $.ajax({
                type: "POST",
                url: "/ServiceCenterData/DeletefromDeviceItemDatabase?ModelN=" + ModelName + "&Requestno=" + RequestNO,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (Requestno) {
                    swal({
                        title: "Done",
                        text: 'Model  ' + ModelName + ' Deleted Done',
                        type: "success",
                        confirmButtonClass: "btn-primary",
                        confirmButtonText: "OK",
                        closeOnConfirm: false
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
    );
}
//open pop up with device data
function AddSparePart(SerialNO, ModelName) {
    var Store = $("#drpStores").val();
    if (parseInt(Store) == 0) {
        $("#AddnewItemsModel").modal('hide');
        swal("Warning",'Please select store to add new items on this device ...', "error");
    }
    if (parseInt(Store) != 0) {
        $("#lblSerialNo").html(SerialNO);
        $("#lblModelName").html(ModelName);
        $("#AddnewItemsModel").modal('show');
    }
 
}
// serach for item 
function SearchforItemModel() {
    var html = '';
    var Item = $("#txtSearchedItem").val();
    var SerialNO =  $("#lblSerialNo").html();
    if (Item == "") {
        swal("Warning", 'You Search for Nothing ... ', "error")
    }
    else {
        $.ajax({
                type: "POST",
            url: "/ServiceCenterData/SearchForAddingItemOndevice?ModelName=" + Item ,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            success: function (ModelData) {
                if (ModelData.length == 0) {
                    swal("Warning", 'There is no data for this item', "error")
                }
                else {
                    console.log(ModelData);
                    for (var i = 0; i < ModelData.length; i++) {
                        var RowNO = i + 1;
                        html += '<tr>'
                        html += '<td>' + RowNO + '</td>'
                        html += '<td>' + ModelData[i].modelName +'</td>'
                        html += '<td>' + ModelData[i].fullDescription + '</td>'
                        html += '<td>' + ModelData[i].barCode + '</td>'
                        if (ModelData[i].isSerialized == true) {
                            html += '<td><input type="checkbox" checked="checked" disabled="disabled"/></td>'
                        }
                        else {
                            html += '<td>  <input type="checkbox"  disabled="disabled" /></td>'
                        }
                        html += '<td style="width:10%"><input class="form-control" type="number" value="0" /></td>'
                        html += '<td><a onclick="AddtoExistTableitems(this)" class="btn btn-primary btn-sm">ADD</a></td>'
                        html += '</tr>'
                    }
                    $('#ListOfSearchItem').html(html);

                }
                },
                error: function () {
                    swal("Warning", 'Somthing went wrong', "error")
                }
            });
    }
}
// add Item On device And remove it
function AddtoExistTableitems(button) {
    $("#addfinalrawbtn").hide();
    var row = $(button).closest("TR");
    var SerialNO = $("#lblSerialNo").html();
    var ModelName = $("TD", row).eq(1).html();
    var BarCode = $("TD", row).eq(3).html();
    var Quantity = $("TD", row).eq(5).find("input").val();
    var Serialzed = $("TD", row).eq(4).find("input").is(':checked');
    console.log(ModelName);
    if (Serialzed == true) {
        if (Quantity <= 0) {
            swal("Warning", 'the quantity must more than 0!', "error")
        }
        else {
            $("#lblSerialItems").html(SerialNO);
            $("#DeviceSerial").html(SerialNO);
            $("#lblBarCode").html(BarCode);
            $("#DeviceBarCode").html(BarCode);
            $("#lblorderdQty").html(Quantity);
            $("#lblSerialModelName").html(ModelName);

            $('#SerialModelAdd').modal({ backdrop: 'static', keyboard: false })
            $('#SerialModelAdd').modal('show');       
        }  
    }
    else {
    if (Quantity <= 0) {
        swal("Warning", 'the quantity must more than 0!', "error");
    }
    else {
        var Items = [];
        var DataTable = $("#tbleitemDetailes");
        if (DataTable.length != 0) {
            $("#tbleitemDetailes TBODY TR").each(function () {
                var row = $(this);
                var Data = {};
                Data.ModelName = row.find("TD").eq(0).html();
                Data.Serialno = row.find("TD").eq(1).html();
                Items.push(Data);
            });
        }
        var DataM = Items.find(S => S.ModelName === ModelName);
        var DataS = Items.find(S => S.Serialno === SerialNO);
        if (DataS != undefined && DataM != undefined) {
            swal("Warning", 'This Model is already exist on The Same Device you can not add it twice!', "error")
        }
        else {
            var rowCount = $('#tbleitemDetailes TBODY TR').length;
            var tBody = $("#tbleitemDetailes > TBODY")[0];
            var rows = tBody.insertRow(-1);

            var cell = $(rows.insertCell(-1));
            cell.html(rowCount +1 );

            var cell = $(rows.insertCell(-1));
            cell.html(ModelName);

            var cell = $(rows.insertCell(-1));
            cell.html(SerialNO);

            var cell = $(rows.insertCell(-1));
            cell.html(BarCode);

            var cell = $(rows.insertCell(-1));
            cell.html(Quantity);


            cell = $(rows.insertCell(-1));

            var btnRemove = $("<input />");
            btnRemove.attr("type", "button");
            btnRemove.attr("onclick", "Remove(this);");
            btnRemove.val("Remove");
            btnRemove.addClass("btn btn-danger btn-sm");
            cell.append(btnRemove);

            $("#exampleModalCenterTitle").hide();
        }
     }
    }
}
//Remove Item and its seriales
function Remove(button) {
    //Determine the reference of the Row using the Button.
    var row = $(button).closest("TR");
    var name = $("TD", row).eq(0).html();
    var Serial = $("TD", row).eq(1).html();
    var CheckifExist = SerialesData.findIndex(S => S.DSerialNO == Serial);
    SerialesData.splice(CheckifExist);
    if (confirm("Do you want to Delete This Row: " + name + "  and its seriales ")) {
        //Get the reference of the Table.
        var table = $("#tbleitemDetailes")[0];
        //Delete the Table row using it's Index.
        table.deleteRow(row[0].rowIndex);
    }
};
// Add Seriales And rempove it
function RemoveSeriales(button) {
    //Determine the reference of the Row using the Button.
    var row = $(button).closest("TR");
    var name = $("TD", row).eq(1).html();
    if (confirm("Do you want to Delete This Row: " + name)) {
        //Get the reference of the Table.
        var table = $("#SerialTable")[0];
        //Delete the Table row using it's Index.
        table.deleteRow(row[0].rowIndex);
    }


};
function AddItemsSeriales() {
    var SerialItem = $("#txtItemSerial");
    var Store = $("#drpStores").val();
    console.log(Store);
    var SearchBarCode = $("#DeviceBarCode").html();
    $.ajax({
        type: "POST",
        url: "/ServiceCenterData/ValidatedSerialNo?Serial=" + SerialItem.val() + "&Stores=" + Store + "&BarCode=" + SearchBarCode,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            if (json == "SerialHaveNoValidation") {
                var Seriales = [];
                var DataTable = $("#SerialTable");
                var countRows = $("#SerialTable tbody tr").length;
                var OrderedQuantity = $("#lblorderdQty").html();
                if (countRows == OrderedQuantity) {
                    swal("Warning", 'You ordered only ' + OrderedQuantity + ' Serial for this item, you can not add more', "error")
                }
                else {
                    if (DataTable.length != 0) {
                        $("#SerialTable TBODY TR").each(function () {
                            var row = $(this);
                            var Data = {};
                            Data.Serialno = row.find("TD").eq(2).html();
                            Seriales.push(Data);
                        });
                    }
                    var DataS = Seriales.find(S => S.Serialno === SerialItem.val());
                    if (DataS != undefined) {
                        swal("Warning", 'This Serial is already exist on The Same Device you can not add it twice!', "error")
                    }
                    else {
                        $("#addfinalrawbtn").show();
                        var DSerialNO = $("#DeviceSerial").html();
                        var BarCode = $("#DeviceBarCode").html();
                        var tBody = $("#SerialTable > TBODY")[0];
                        var rows = tBody.insertRow(-1);
                        var cell = $(rows.insertCell(-1));
                        cell.html(DSerialNO);
                        var cell = $(rows.insertCell(-1));
                        cell.html(BarCode);
                        var cell = $(rows.insertCell(-1));
                        cell.html(SerialItem.val());
                        cell = $(rows.insertCell(-1));
                        var btnRemove = $("<input />");
                        btnRemove.attr("type", "button");
                        btnRemove.attr("onclick", "RemoveSeriales(this);");
                        btnRemove.val("Remove");
                        btnRemove.addClass("btn btn-danger btn-sm");
                        cell.append(btnRemove);
                        SerialItem.val("");
                    }
                }
                $("#SerialTable TBODY TR").each(function () {
                    var row = $(this);
                    var Data = {};
                    var SerialCheck = row.find("TD").eq(2).html();
                    var DeviceSerialCheck = row.find("TD").eq(0).html();
                    Data.DSerialNO = row.find("TD").eq(0).html();
                    Data.BarCode = row.find("TD").eq(1).html();
                    Data.Serialno = row.find("TD").eq(2).html();
                    var CheckifExist = SerialesData.find(S => S.Serialno == SerialCheck && S.DSerialNO == DeviceSerialCheck);
                    if (CheckifExist == undefined) {
                        SerialesData.push(Data);
                    }
                });
            }
            if (json != "SerialHaveNoValidation") {
                swal("Warning", json, "error")
            }
        },
        error: function () {
            swal("Warning", 'Somthing went wrong', "error")
        }
    });
}
function AddfinalRaw() {
   

   var SerialNO =  $("#lblSerialItems").html();
    var BarCode =  $("#lblBarCode").html();
   var ModelName =  $("#lblSerialModelName").html();
    var Quantity = $("#lblorderdQty").html();

    var rowCount = $('#tbleitemDetailes TBODY TR').length;

    var tBody = $("#tbleitemDetailes > TBODY")[0];
    var rows = tBody.insertRow(-1);

    var cell = $(rows.insertCell(-1));
    cell.html(rowCount + 1 );

    var cell = $(rows.insertCell(-1));
    cell.html(ModelName);

    var cell = $(rows.insertCell(-1));
    cell.html(SerialNO);

    var cell = $(rows.insertCell(-1));
    cell.html(BarCode);

    var cell = $(rows.insertCell(-1));
    cell.html(Quantity);


    cell = $(rows.insertCell(-1));

    var btnRemove = $("<input />");
    btnRemove.attr("type", "button");
    btnRemove.attr("onclick", "Remove(this);");
    btnRemove.val("Remove");
    btnRemove.addClass("btn btn-danger btn-sm");
    cell.append(btnRemove);

    var ShowSerial = $("<input />");
    ShowSerial.attr("type", "button");
    ShowSerial.attr("onclick", "ShowSeriales(this);");
    ShowSerial.val("Show Seriales");
    ShowSerial.css("margin-left", "5px");
    ShowSerial.addClass("btn btn-dark btn-sm");
    cell.append(ShowSerial);

    $("#bodyofseriales").empty();
}
function ShowSeriales(SerialButton) {
    var row = $(SerialButton).closest("TR");
    var ModelName = $("TD", row).eq(1).html();
    var BarCode = $("TD", row).eq(3).html();
    var DSerialNO = $("TD", row).eq(2).html();
    var FilterdData = [];
    for (var i = 0; i < SerialesData.length; i++) {
        if (SerialesData[i].BarCode == BarCode && SerialesData[i].DSerialNO == DSerialNO) {
            FilterdData.push(SerialesData[i]);
        }
        console.log(FilterdData);
    }
    $('#LblSerailzedModelName').html(ModelName);
    var htmlS = '';
    for (var i = 0; i < FilterdData.length; i++) {
        var RowNO = i + 1;
        htmlS += '<tr>'
        htmlS += '<td>' + RowNO + '</td>'
        htmlS += '<td>' + FilterdData[i].Serialno + '</td>'
        htmlS += '</tr>'
    }
    $('#listofserailes').html(htmlS);
    $('#SerialesAdded').modal('show');
}
function CancelRequest() {
    swal({
        title: "Are you sure?",
        text: "You Will Cancel any info Related to this request  ...!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false,
        allowOutsideClick: false
    },
        function () {
            window.location.href = "/ServiceCenterData/TechnicalReport";
        }
    );
}
// Saving Updates 
function SaveChanges() {
    var Store = $("#drpStores").val();
    var RequestN = $("#lblRequestNO").html();
    if (Store == 0) {
        swal("Warning", 'You Must Select Store ... ', "error")
    }
    else  {
        var NTecReportD = new Array();
        $("#TblDeviceDeatilesExist TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.ModelName = row.find("TD").eq(1).html();
            Data.SerialNo = row.find("TD").eq(2).html();
            Data.TechnicalNotes = row.find("TD").eq(8).find("textarea").val();
            Data.Labourhours = row.find("TD").eq(9).find("input").val();
            Data.Status = row.find("TD").eq(10).find(":selected").val();
            NTecReportD.push(Data);
        });
        var NReportItemdD = new Array();
        $("#tbleitemDetailes TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.Modelname = row.find("TD").eq(1).html();
            Data.SerialNO = row.find("TD").eq(2).html();
            Data.BarCode = row.find("TD").eq(3).html();
            Data.Quantity = row.find("TD").eq(4).html();
            NReportItemdD.push(Data);
        });
        var NReportItemSerials = new Array();
        
        for (var i = 0; i < SerialesData.length; i++) {
            var BarCode = SerialesData[i].BarCode;
            var SerialNO = SerialesData[i].SerialNo;
            var DSerialNO = SerialesData[i].DSerialNO;
            NReportItemSerials.push(SerialesData[i]);
        }
        var Data = { NTecReportD, NReportItemdD, NReportItemSerials }
        console.log(Data);
        $.ajax({
            type: "POST",
            url: "/ServiceCenterData/UpdateTecReport?Requestn=" + RequestN + "&StoreNo=" + Store,
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                swal({
                    title: "Done",
                    text: 'Order with RequestNo  ' + RequestN + ' Updated Done',
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
                swal("Warning", 'Somthing went wrong', "error")
            }
        });
    }
}

// Call Items Data for This Device
//function GetItemsDetailes(SerialNO, RequestNO) {
//    $.ajax({
//        type: "POST",
//        url: "/ServiceCenterData/GetDeviceItems?ReNO=" + RequestNO + "&SerialNO=" + SerialNO,
//        success: function (DeviceItemData) {
//            var html = '';
//            console.log(DeviceItemData);
//            var TableNeeded = $("#TblDeviceDeatilesExist");
//            var FillDataItems = function myfunction() {
//                if (DeviceItemData.length != 0) {
//                    for (var i = 0; i < DeviceItemData.length; i++) {
//                        var RowNO = i + 1;
//                       html += '<tr>'
//                       html += '<td>' + RowNO + '</td>' 
//                       html += '<td><a onclick="ReportData(' + Data[i].requestNO + ')"> ' + Data[i].requestNO + ' </a> </td>'
//                       html += '<td>' + Data[i].formatedDate + '</td>'
//                       html += '<td>' + Data[i].customer + '</td>'
//                       html += '<td>' + Data[i].reportNO + '</td>'
//                       html += '<td>' + Data[i].departMent + '</td>'
//                       html += '<td>' + Data[i].technical + '</td>'
//                       html += '<td>' + Data[i].status + '</td>'
//                       html += '</tr>'
//                   }
//                   $('#listofdata').html(html);
//               }
//            }
            
//        },
//        error: function () {
//            swal("Warning", 'Somthing went wrong!', "error")
//        }
//    });
//}