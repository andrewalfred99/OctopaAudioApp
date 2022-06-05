$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
function UploadSheetExcel() {
   
    var html = '';
    var htmlE = '';
    var formData = new FormData();
    formData.append('file', $('#txtfile')[0].files[0]); // myFile is the input type="file" control

    var BrandName = $("#drpBrand").val();
    if (BrandName == 0 ) {
        swal("Warning", 'You Must select the brand name before upload sheet excel', "error")
    }
    else {
        $("#loader").show();
         $.ajax({
             type: "POST",
             url: "/ServiceCenterData/ImportSheetExcel?Group=" + BrandName,
             data: formData,
             processData: false,  // tell jQuery not to process the data
             contentType: false,  // tell jQuery not to set contentType
             success: function (DataObject) {
                 $("#loader").hide();
                 console.log(DataObject);
                 var ExistingItems = DataObject.existItems;
                 var NotExistingItems = DataObject.notExisting;
                 var ErrorMessage = DataObject.message;
                 if (ErrorMessage != "" ) {
                     swal("Warning", ErrorMessage, "error")
                 }
                 else {
                     if (DataObject.notExisting.length != 0) {
                         for (var i = 0; i < NotExistingItems.length; i++) {
                             var RowNO = i + 1;
                             html += '<tr>'
                             html += '<td>' + RowNO + '</td>'
                             html += '<td>' + NotExistingItems[i].modelName + '</td>'
                             html += '<td>' + NotExistingItems[i].fullDescription + '</td>'
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
                                 htmlE += '</tr>'
                         }
                         $('#listOfexistitems').html(htmlE);
                     }
                 }
            },
            error: function ()
            {
                swal("Warning", 'The Adress is requierd!', "error")
            }
        });
    }
}
function CancelConfirmation() {
    swal({
        title: "Are you sure?",
        text: "You want to cancel this Spare part order!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        function () {
            window.location = "/ServiceCenterData/SparePartOrderView"
        }

    );

}
//btn save
$("body").on("click", "#btnSave", function () {
    var BrandCode = $("#drpBrand");
    var Shipping = $("#drpShipping");
    var Note = $("#txtNotes");

    if (BrandCode.val() == 0) {
        swal("Warning", 'Please ,you must enter the brand!', "error")
    }
    var SPOH = {};
    SPOH.GroupName = BrandCode.val();
    SPOH.Shipping = Shipping.val();
    SPOH.Note = Note.val();

    var SPOD = new Array();
    $("#tblExistItems TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        Data.ModelName = row.find("TD").eq(1).html();
        Data.Quantity = row.find("TD").eq(3).html();
        Data.UnitPrice = row.find("TD").eq(4).html();
        SPOD.push(Data);
    });
    if (SPOD.length == 0) {
        swal("Warning", 'There is no data to save', "error")
    }
    if (SPOD.length != 0) {
     var Data = { SPOH, SPOD }
        console.log(Data)
        $.ajax({
            type: "POST",
            url: "/ServiceCenterData/SaveNewSPO",
            data: JSON.stringify(Data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (NRMAREQNO) {
                swal({
                    title: "Done",
                    text: 'Data saved successfully',
                    type: "success",
                    confirmButtonClass: "btn-primary",
                    confirmButtonText: "OK",
                    closeOnConfirm: false
                },
                    function () {
                        window.location = "/ServiceCenterData/SparePartDetails?ReqNo=" + NRMAREQNO
                    }
                );
            },
            error: function () {
                swal("Warning", 'Somthing Went Wrong', "error")
            }
        });
    }
   
});
function RemoveItemFromDB(button) {
    //Determine the reference of the Row using the Button.
    var Reqno = $("#txtRequest").val();
    var row = $(button).closest("TR");
    var name = $("TD", row).eq(1).html();
   
    swal({
        title: "Are you sure?",
        text: "You Will Delete thos item !" + name,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        function () {
            $.ajax({
                type: "POST",
                url: "/ServiceCenterData/DeleteSPModel?ModelName=" + name + "&Requestno=" + Reqno,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (Requestno) {
                    swal({
                        title: "Done",
                        text: 'Model  ' + name + ' Deleted Done',
                        type: "success",
                        confirmButtonClass: "btn-primary",
                        confirmButtonText: "OK",
                        closeOnConfirm: false
                    },
                        function () {
                            window.location = "/ServiceCenterData/EditSparePart?ReqNo=" + Requestno
                        }
                    );

                },
                error: function () {
                    swal("Warning", 'Somthing went wrong' , "error")
                }
            });
        }

    );

};
function EditRaw(button) {
    var row = $(button).closest("TR");
    row.find("TD").eq(3).find("input").prop("disabled", false);
     row.find("TD").eq(4).find("input").prop("disabled", false);
}
function SearchForModel() {
    var ModelName = $("#txtNewModelName");
    var Reqno = $("#txtRequest").val();
    $.ajax({
        type: "POST",
        url: "/ServiceCenterData/SearchforSpoModel?ModelName=" + ModelName.val() + "&Requestno=" + Reqno,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (ExistItem) {
            console.log(ExistItem);
            if (ExistItem == null) {
                swal("Warning", 'There is no data for this item', "error")
            }
            else {
                var ModelName = $("#txtNewModelName");
                var Fulldes = $("#txtDescri");
                ModelName.val(ExistItem.modelName);
                Fulldes.val(ExistItem.fullDescription);
            }
        },
        error: function () {
            swal("Warning", 'Somthing went wrong', "error")
        }
    });
}
$("body").on("click", "#btnAdd", function () {

    var ModelName = $("#txtNewModelName");
    var Models = [];
    var DataTable = $("#tblnewitems");
    if (DataTable.length != 0) {
        $("#tblitemsData TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.ModelName = row.find("TD").eq(1).html();
            Models.push(Data);
        });
    }
    var DataS = Models.find(S => S.ModelName === ModelName.val());
    if (DataS != undefined) {
        swal("Warning", 'This Model is already exist you can not add it twice!', "error")

    }
    else {
        var Descrip = $("#txtDescri");
        var Quantity = $("#txtQuantitynew");
        var unitePrice = $("#txtnewUnite");

        if (ModelName.val() == "" || Quantity.val() < 0 || unitePrice.val() < 0) {
            swal("Warning", 'Please check if you enterd data in Right way!', "error")

        }

        else {
            var tBody = $("#tblnewitems > TBODY")[0];
            var row = tBody.insertRow(-1);


            var cell = $(row.insertCell(-1));
            cell.html(ModelName.val());

            var cell = $(row.insertCell(-1));
            cell.html(Descrip.val());

            var cell = $(row.insertCell(-1));
            cell.html(Quantity.val());

            var cell = $(row.insertCell(-1));
            cell.html(unitePrice.val());


            var cell = $(row.insertCell(-1));
            cell.html((unitePrice.val() * Quantity.val()));


            cell = $(row.insertCell(-1));

            var btnRemove = $("<input />");
            btnRemove.attr("type", "button");
            btnRemove.attr("onclick", "Remove(this);");
            btnRemove.val("Remove");
            btnRemove.addClass("btn btn-danger btn-sm");
            cell.append(btnRemove);

            //Clear the TextBoxes.
            ModelName.val("");
            Descrip.val("");
            Quantity.val("");
            unitePrice.val("");;

        }

      
    }
       
});
function Remove(button) {
    //Determine the reference of the Row using the Button.
    var row = $(button).closest("TR");
    var name = $("TD", row).eq(1).html();
    if (confirm("Do you want to Delete This Row: " + name)) {
        //Get the reference of the Table.
        var table = $("#tblnewitems")[0];
        //Delete the Table row using it's Index.
        table.deleteRow(row[0].rowIndex);
    }
};
function UpdateSpo() {
    var Reqno = $("#txtRequest").val();
    var SPOD = new Array();
    $("#tblitemsData TBODY TR").each(function () {
        var row = $(this);
        var Data = {};
        Data.ModelName = row.find("TD").eq(1).html();
        Data.Quantity = row.find("TD").eq(3).find("input").val();
        Data.UnitPrice = row.find("TD").eq(4).find("input").val();
        SPOD.push(Data);
    });
    var NewTbl = $("#tblnewitems");
    if (NewTbl.length > 0) {
        $("#tblnewitems TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.ModelName = row.find("TD").eq(0).html();
            Data.Quantity = row.find("TD").eq(2).html();
            Data.UnitPrice = row.find("TD").eq(3).html();
            SPOD.push(Data);
        });
    }
    var Data = { SPOD };
    console.log(Data);
    $.ajax({
        type: "POST",
        url: "/ServiceCenterData/EditSPODD?ModelName=" + name + "&Requestno=" + Reqno,
        data: JSON.stringify(Data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Requestno) {
            swal({
                title: "Done",
                text: 'Order with RequestNo  ' + Reqno + ' Updated Done',
                type: "success",
                confirmButtonClass: "btn-primary",
                confirmButtonText: "OK",
                closeOnConfirm: false
            },
                function () {
                    window.location = "/ServiceCenterData/EditSparePart?ReqNo=" + Reqno
                }
            );

        },
        error: function () {
            swal("Warning", 'Somthing went wrong', "error")
        }
    });

}