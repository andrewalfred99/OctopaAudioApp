
var clickable = true
var AllItems = []
var TaxItemsResponse = []
$(document).ready(function () {
    clickable = true
    LogIn();
 //   DrawCompaniesGrid()
    //GetTest();
});
$.noConflict();
jQuery(document).ready(function ($) {
    $('#Items_tbl').DataTable();
});

//JS
function addHoursToDate(date, hours) {
    return new Date(new Date(date).setHours(date.getHours() + hours));
}

function GetInternalItems() {
    $.ajax({
        type: "Get",
        url: "/EgyptianTaxesAuthority/GetInternalItems",
        success: function (response) {
            AllItems = response
           /* console.log(AllItems)*/
            DrawAllItems(AllItems)

        }, 
        error: function (response) {  }
    });
    //parent Code = 10005710


}
function GetEGSCodeRequests() {
    $.ajax({
        type: "Get",
        url: "/EgyptianTaxesAuthority/GetEGSCodeRequests",
       data: { Token: sessionStorage.getItem("Token")},
        success: function (response) {
            if (response == "Unauthorized") {
                swal("Sorry", "Tax Session Expired, Please Re-Authenticate", "error")

            } else {
                
                TaxItemsResponse = response
                GetInternalItems();
            }
        },
        error: function (response) { alert(response.statusCode) }
    });
    //parent Code = 10005710


}
function CreateEGSCode(parentCode, itemCode, codeName, codeNameAr, description, descriptionAr) {
   
    $.ajax({
        type: "Get",
        url: "/EgyptianTaxesAuthority/CreateEGSCode",
        data: { Token: sessionStorage.getItem("Token"), parentCode: parentCode, itemCode: itemCode, codeName: codeName, codeNameAr: codeNameAr, description: description, descriptionAr: descriptionAr },
        success: function (response) {
            if (response == "Unauthorized") {
                swal("Sorry", "Tax Session Expired, Please Re-Authenticate", "error")

            } else {
              
                var res = JSON.parse(response)
                if (res.passedItemsCount == 0) {
                    swal("Sorry", res.failedItems[0].errors, "error")
                }//10005710
                else {
                    $("#EditItem").modal('hide')
                
                    swal("Done!", "Request had been completed successfully", "success")
                    
                }
            }

        },
        error: function (response) { console.log(response) }
    });
    //parent Code = 10005710


}
function LogIn() {
    if (clickable) {
        $.ajax({
            type: "Post",
            url: "/EgyptianTaxesAuthority/LoginToSystem",
            success: function (response) {
                sessionStorage.setItem("Token" , response)
                if (!response.includes("Error")) {
                    swal("Done", "Authentication Process Completed Successfully", "success")
                    GetEGSCodeRequests();

                    // Set the date we're counting down to
                    var countDownDate = new Date();
                    countDownDate = (addHoursToDate(countDownDate, 1))

                    // Update the count down every 1 second
                    var x = setInterval(function () {

                        // Get today's date and time
                        var now = new Date().getTime();

                        // Find the distance between now and the count down date
                        var distance = countDownDate - now;
                        clickable = false


                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                        // Output the result in an element with id="demo"
                        document.getElementById("tokenTime").innerHTML = minutes + "M " + seconds + "S ";

                        // If the count down is over, write some text 
                        if (distance < 0) {
                            clickable = true
                            clearInterval(x);
                            document.getElementById("tokenTime").innerHTML = "Authenticate";
                        }
                    }, 1000);
                } else {
                    swal("Sorry", response, "error")
                }
            },
            error: function (response) { alert(response.statusCode) }
        });
    }
   
    //parent Code = 10005710


}
function DrawAllItems(items) {

    for (var i = 0; i < AllItems.length; i++) {
        AllItems[i].TaxID = ""
        AllItems[i].TaxStatus = "Not Exists"
    }
    var TIR = TaxItemsResponse
    for (var i = 0; i < TIR.length; i++) {
       
        var index = AllItems.findIndex(x => (x.code).toString() == ((TIR[i].itemCode).replace('EG-100487114-', '')).toString())
      
        if (index != -1) {
            AllItems[index].TaxID = TIR[i].itemCode
            AllItems[index].TaxStatus = TIR[i].status
        } 
    }
    //EG - 100487114
    var htmltbl = '<table id="Items_tbl" class="table table-bordered table-striped mb-none" id="datatable-default" style=" width: -webkit-fill-available" cellspacing="0" ><thead>'
    htmltbl += '<tr class="text-uppercase font-size-1" >'
    htmltbl += '<th scope="col" class="font-weight-medium" style="width:05%"><div class="d-flex justify-content-between align-items-center">Actions<div class="ml-1"></div></div></th>'
    htmltbl += '<th scope="col" class="font-weight-medium" style="width:20%"><div class="d-flex justify-content-between align-items-center">Internal Code<div class="ml-1"></div></div></th>'
    htmltbl += '<th scope="col" class="font-weight-medium" style="width:10%"><div class="d-flex justify-content-between align-items-center">Item Name<div class="ml-1"></div></div></th>'
    htmltbl += '<th scope="col" class="font-weight-medium" style="width:10%"><div class="d-flex justify-content-between align-items-center">Brand<div class="ml-1"></div></div></th>'


    htmltbl += '<th scope="col" class="font-weight-medium" style="width:10%"><div class="d-flex justify-content-between align-items-center">Tax ID<div class="ml-1"></div></div></th>'
    htmltbl += '<th scope="col" class="font-weight-medium" style="width:10%"><div class="d-flex justify-content-between align-items-center">Item Status<div class="ml-1"></div></div></th>'


    htmltbl += '</tr></thead></table> ';

    $('#ItemsTable').html(htmltbl);
    $.noConflict();

    var table = $('#Items_tbl').DataTable({
        "data": AllItems,

        "columns": [

            {
                "className": '',
                "orderable": false,
                "data": "ID",
                "mRender": function (data, type, full) {
                    return '<div class="btn-group" style="text-align:center">' +
                        '<button type="button" class="btn btn-soft-secondary btn-icon btn-sm" title="View" onclick="ViewItem(' + full.code + ')" style="border-radius: 50px;margin-right: 10px;box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.3);width: 34px;"><i class="fa fa-list-ul"></i></button>' +
                        '<button type="button" class="btn btn-soft-secondary btn-icon btn-sm" title="Edit" onclick="EditItem(' + full.code +')" style="border-radius: 50px;margin-right: 10px;box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.3);width: 34px;"><i class="fa fa-edit"></i></button>' +

                        //'<button type="button" class="btn btn-soft-danger btn-icon btn-sm" title="Delete" onclick="DeleteCompany(' + full.Code + ')" style="border-radius: 50px;margin-right: 10px;box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.3);"><i class="fas fa-trash"></i></button>' +
                        '</div>'

                }
            },
            { data: "code" },
            { data: "modelName" },
            { data: "brandNameString" },
            { data: "TaxID" },
            { data: "TaxStatus" },
            
        ],
        "order": [[1, 'asc']]
    });

    $('#Items_tbl_filter').append('<button class="link-underline" onclick="location.reload()" style="float: left;margin-right: 30px;margin-top:3px"><i class="fa fa-refresh"></i> Refresh</button>');
    //$('#GroupLeaders_tbl_filter').append('<a class="link-underline" href="#" data-toggle="modal" data-target="#modal-set-order"  style="float: left;margin-right: 30px;"><i class="fa fa-bus"></i> Set Order </a>');

    //var html = ''
    //for (var i = 0; i < AllItems.length; i++) {
    //    html += '<tr>'
    //    html += '<td><button class="btn btn-neutral" style=" right:8px ; padding-left: 8px ; padding-right: 8px; padding-top: 0px ; padding-bottom: 0px " onclick="AllOrderModal(' + AllItems[i].id + ')"><i class="fa fa-info-circle fa-2x"></i> </button></td>'
    //    html += ' <td>' + AllItems[i].code + '</td>'
    //    html += '<td>' + AllItems[i].modelName + '</td>'
    //    html += '<td> ' + AllItems[i].email + ' </td>'
    //    html += ' <td>' + AllItems[i].financial_status + '</td>'
    //    html += '<td>' + AllItems[i].current_total_price + ' ' + AllItems[i].currency + '</td>'
    //    html += ' </tr>'
    //}
    //$('#AllOrdersDetails').html(html);

}
function EditItem(code) {
    document.getElementById("inputModelNameAR").value = ""
    document.getElementById("inputDescriptionAR").value = ""
    document.getElementById("inputDescriptionEN").value = ""


    var TIR = TaxItemsResponse
 
    document.getElementById("EditItemInternalCode").innerHTML = code
    document.getElementById("EditItemInternalModelName").innerHTML = AllItems.find(x => x.code == code).modelName
    document.getElementById("EditItemInternalDescription").innerHTML = AllItems.find(x => x.code == code).fullDescription
    document.getElementById("EditItemInternalModalName").innerHTML = AllItems.find(x => x.code == code).modelName
    if (AllItems.find(x => x.code == code).TaxID == "") {
        $("#EditItem").modal()
    } else {
        swal("Sorry", "This Item Have Been Submitted Before", "error")
    }

    document.getElementById("inputItemCode").value = 'EG-100487114-'+code
   // document.getElementById("inputParentItemCode").value = AllItems.find(x => x.code == code).fullDescription
    document.getElementById("inputModelNameEN").value = AllItems.find(x => x.code == code).modelName
    //document.getElementById("inputModelNameAR").innerHTML = AllItems.find(x => x.code == code).fullDescription
    document.getElementById("inputDescriptionEN").value = AllItems.find(x => x.code == code).fullDescription
   // document.getElementById("inputDescriptionAR").innerHTML = AllItems.find(x => x.code == code).fullDescription


}
function submitNewItem() {
    if (document.getElementById("inputParentItemCode").value == "") {
        swal("Sorry", "Parent Item Code Cannot be empty", "error")
    } else if (document.getElementById("inputModelNameEN").value == "") {
        swal("Sorry", "Model Name Cannot be empty", "error")
    } else if (document.getElementById("inputModelNameAR").value == "") {
        swal("Sorry", "Arabic Model Name Cannot be empty", "error")
    } else if (document.getElementById("inputDescriptionEN").value == "") {
        swal("Sorry", "Full Description Cannot be empty", "error")
    } else {
        CreateEGSCode(document.getElementById("inputParentItemCode").value, document.getElementById("EditItemInternalCode").innerHTML, document.getElementById("inputModelNameEN").value, document.getElementById("inputModelNameAR").value, document.getElementById("inputDescriptionEN").value, document.getElementById("inputDescriptionAR").value)
    }
}
function ViewItem(code) {
    var TIR = TaxItemsResponse
   
   // document.getElementById("EditItemInternalCode").innerHTML = code
    if (AllItems.find(x => x.code == code).TaxID == "") {
        swal("Sorry", "This Item Not Exists on Taxes Portal", "error")
    } else {
        $("#ViewItem").modal()
        var TaxObject = TIR.find(x => x.itemCode == 'EG-100487114-' + code)
        document.getElementById("ViewItemModalName").innerHTML = AllItems.find(x => x.code == code).modelName
        document.getElementById("ViewItemInternalCode").innerHTML = AllItems.find(x => x.code == code).code
        document.getElementById("ViewItemInternalModelName").innerHTML = AllItems.find(x => x.code == code).modelName
        document.getElementById("ViewItemInternalDescription").innerHTML = AllItems.find(x => x.code == code).fullDescription
        document.getElementById("ViewItemItemCode").innerHTML = TaxObject.itemCode
        document.getElementById("ViewItemParentCode").innerHTML = TaxObject.parentCodeID
        document.getElementById("ViewItemModelNameEN").innerHTML = TaxObject.codeNamePrimaryLang
        document.getElementById("ViewItemModelNameAR").innerHTML = TaxObject.codeNameSecondaryLang
        document.getElementById("ViewItemFullDescriptionEN").innerHTML = TaxObject.descriptionPrimaryLang
        document.getElementById("ViewItemFullDescriptionAR").innerHTML = TaxObject.descriptionSecondaryLang
        document.getElementById("ViewItemTaxesSystemStatus").innerHTML = TaxObject.status
        document.getElementById("ViewItemCodeUsageRequestID").innerHTML = TaxObject.codeUsageRequestID
        document.getElementById("ViewItemStatusReason").innerHTML = TaxObject.statusReason
        document.getElementById("ViewItemParentCodeNameEN").innerHTML = TaxObject.parentCodeNamePrimaryLang
        document.getElementById("ViewItemParentCodeNameAR").innerHTML = TaxObject.parentCodeNameSecondaryLang
        document.getElementById("ViewItemActiveStatus").innerHTML = TaxObject.active
        document.getElementById("ViewItemActiveFrom").innerHTML = TaxObject.activeFrom

    }
}


