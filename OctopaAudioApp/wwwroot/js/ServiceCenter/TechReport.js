// Technical report JS
var Data = [];
$(document).ready(function () {
    $("#drpCustomer").select2();
    GetAllData();
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#listofdata tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
function GetAllData() {
    $.ajax({
        type: "POST",
        url: "/ServiceCenterData/GetTecReportData",
        success: function (Datas) {
            Data = Datas;
            if (Data == null) {
                swal("Warning", 'There is no data to show .... !', "error")
            }
            else {
                fillData(Data);
            }
        },
        error: function () {
            swal("Warning", 'Somthing went wrong!', "error")
        }
    });
}
function FilterData() {
    var Department = $("#drpDepartment").val();
    var Technic = $("#drpTechni").val();
    var Status = $("#drpStatus").val();
    var FilterdData = [];
    console.log(FilterdData, Department, Technic, Status);
    for (var i = 0; i < Data.length; i++) {
        if (Department != 0 && Technic == 0 && Status == 0) {
            if (Data[i].departMent == Department) {
                FilterdData.push(Data[i]);
            }
        }
        if (Department == 0 && Technic != 0 && Status == 0) {
            if (Data[i].technical == Technic) {
                FilterdData.push(Data[i]);
            }
        }
        if (Department == 0 && Technic == 0 && Status != 0) {
            if (Data[i].status == Status) {
                FilterdData.push(Data[i]);
            }
        }
        if (Department != 0 && Technic != 0 && Status == 0) {
            if (Data[i].departMent == Department && Data[i].technical == Technic) {
                FilterdData.push(Data[i]);
            }
        }
        if (Department != 0 && Status != 0 && Technic == 0) {
            if (Data[i].status == Status && Data[i].departMent == Department) {
                FilterdData.push(Data[i]);
            }
        }
        if (Technic != 0 && Status != 0 && Department == 0) {
            if (Data[i].status == Status && Data[i].technical == Technic) {
                FilterdData.push(Data[i]);
            }
        }
        if (Technic != 0 && Status != 0 && Department != 0) {
            if (Data[i].status == Status && Data[i].technical == Technic && Data[i].departMent == Department) {
                FilterdData.push(Data[i]);
            }
        }
    }
    console.log(FilterdData);
    fillData(FilterdData);
}
function fillData(Data) {
    var html = '';
    if (Data.length != 0) {
        for (var i = 0; i < Data.length; i++) {
            var RowNO = i + 1;
            html += '<tr>'
            html += '<td>' + RowNO + '</td>'
            html += '<td><a onclick="ReportData(' + Data[i].requestNO +')"> '+ Data[i].requestNO +' </a> </td>'
            html += '<td>' + Data[i].formatedDate + '</td>'
            html += '<td>' + Data[i].customer + '</td>'
            html += '<td>' + Data[i].reportNO + '</td>'
            html += '<td>' + Data[i].departMent + '</td>'
            html += '<td>' + Data[i].technical + '</td>'
            html += '<td>' + Data[i].status + '</td>'
            html += '</tr>'
        }
        $('#listofdata').html(html);
    }
}
function ClearFilters() {
    fillData(Data);
}
function ReportData(REQUESTNO) {
    window.location.href = "/ServiceCenterData/TechnicalReportModifing?RequestN=" + REQUESTNO;
}
// New report JS
function AddnewReportDevice() {
    $("#txtQuantity").prop('disabled', false);
    $("#lblInwarrenty").prop('disabled', false);
    var Serial = $("#txtSerial");
    var Serials = [];
    var DataTable = $("#tblNewReporDevices");
    if (DataTable.length != 0) {
        $("#tblNewReporDevices TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.Serial = row.find("TD").eq(0).html();
            Serials.push(Data);
        });
    }
    var DataS = Serials.find(S => S.Serial === Serial.val());
    if (DataS != undefined) {
        swal("Warning", 'This serial is already exist you can not add it twice!', "error")

    }
    else {
        var Serial         = $("#txtSerial");
        var ModelName      = $("#txtModelName");
        var BrandName      = $("#txtBrand");
        var RecNo          = $("#txtRecNo");
        var SerialQty      = $("#txtQuantity");
        var FailureDetails = $("#txtFdetailes");
        var Accessories    = $("#txtAccessories");
        var RNotes         = $("#txtRNotes");
        var Warranty        = $("#lblInwarrenty");
        var Technical      = $("#drpTechnicalDea");

        if (ModelName.val() == "" || Serial.val() == "" ) {
            swal("Warning", 'ModelName or Serial is missed please check if you fill it!', "error")
        }
        else {
            var tBody = $("#tblNewReporDevices > TBODY")[0];
            var row = tBody.insertRow(-1);

            var cell = $(row.insertCell(-1));
            cell.html(Serial.val());

            var cell = $(row.insertCell(-1));
            cell.html(ModelName.val());

            var cell = $(row.insertCell(-1));
            cell.html(BrandName.val());

            var cell = $(row.insertCell(-1));
            cell.html(RecNo.val());

            var cell = $(row.insertCell(-1));
            cell.html(SerialQty.val());

            var cell = $(row.insertCell(-1));
            cell.html(FailureDetails.val());

            var cell = $(row.insertCell(-1));
            cell.html(Accessories.val());

            var cell = $(row.insertCell(-1));
            cell.html(RNotes.val());

            var cell = $(row.insertCell(-1));
            cell.html(Warranty.val());

            var cell = $(row.insertCell(-1));
            cell.html(Technical.val());

            cell = $(row.insertCell(-1));

            var btnRemove = $("<input />");
            btnRemove.attr("type", "button");
            btnRemove.attr("onclick", "Remove(this);");
            btnRemove.val("Remove");
            btnRemove.addClass("btn btn-danger btn-sm");
            cell.append(btnRemove);

        }
        //Clear the TextBoxes.
        Serial.val("");
        ModelName.val("");
        BrandName.val("");
        RecNo.val("");
        SerialQty.val(0);
        FailureDetails.val("");
        Accessories.val("");
        RNotes.val("");
        Warranty.val("NO");
        $('#drpTechnicalDea :nth-child(0)').prop('selected', true); // To select via index
    }
        
}
//remove Device
function Remove(button) {
    //Determine the reference of the Row using the Button.
    var row = $(button).closest("TR");
    var name = $("TD", row).eq(0).html();
    if (confirm("Do you want to Delete This Row: " + name)) {
        //Get the reference of the Table.
        var table = $("#tblNewReporDevices")[0];
        //Delete the Table row using it's Index.
        table.deleteRow(row[0].rowIndex);
    }
};
function SearchforSerial() {
    var SerialNo = $("#txtSerial").val();
    if (SerialNo == "") {
        swal("Warning", 'You Search for nothing....!', "error")
    }
    else {
        $.ajax({
            type: "POST",
            url: "/ServiceCenterData/SearchForReportSerial?SerialNO=" + SerialNo,
            success: function (ObjectData) {
                console.log(ObjectData);
                var SerialData = ObjectData.serialData;
                var Inwarrteny = ObjectData.inwareeenty;
                if (SerialData == null) {
                    swal("Warning", 'There is no data for this serial ...!', "error")
                }
                else {
                  
                    var ModelName = $("#txtModelName");
                    var BrandName = $("#txtBrand");
                    var RecNo = $("#txtRecNo");
                    var SerialQty = $("#txtQuantity");
                    var Inwa = $("#lblInwarrenty");
                    ModelName.val(SerialData.modelName);
                    BrandName.val(SerialData.brandName);
                    RecNo.val(SerialData.receiptNo);
                    Inwa.val(Inwarrteny);
                    SerialQty.val(1);
                    SerialQty.prop('disabled', true);
                    Inwa.prop('disabled', true);
                }
            },
            error: function () {
                swal("Warning", 'The Adress is requierd!', "error")
            }
        });
    }
}
function CancelRequest() {
    swal({
        title: "Are you sure?",
        text: "You want to cancel this Report!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        function () {
            window.location = "/ServiceCenterData/GetAllreports"
        }

    );

}
function SaveNewReport() {
    var Department = $("#drpDepartment");
    var ReportNo = $("#txtReportNo");
    var ReceivedFrom = $("#txtReceivedFrom");
    var Customer = $("#drpCustomer");
    var PhoneNO = $("#txtPhoneNo");
    var IDNo = $("#txtIDNo");
    var Notes = $("#txtNotes");

    if (Customer.val() == 0) {
        swal("Warning", 'please select the customer ....', "error")
    }
    else if (ReceivedFrom.val() == "") {
        swal("Warning", 'please select the Received From ....', "error")
    }
    else if (PhoneNO.val() == "") {
        swal("Warning", 'please enter the Phone No ....', "error")
    }

    else  {
        var NTecReport = {};
        NTecReport.Department = Department.val();
        NTecReport.ReportNo = ReportNo.val();
        NTecReport.ReceivedFrom = ReceivedFrom.val();
        NTecReport.Customer = Customer.val();
        NTecReport.Phone = PhoneNO.val();
        NTecReport.IDNo = IDNo.val();
        NTecReport.Notes = Notes.val();

        var NTecReportD = new Array();
        $("#tblNewReporDevices TBODY TR").each(function () {
            var row = $(this);
            var Data = {};
            Data.SerialNO = row.find("TD").eq(0).html();
            Data.ModelName = row.find("TD").eq(1).html();
            Data.Brand = row.find("TD").eq(2).html();
            Data.ReceiptNO = row.find("TD").eq(3).html();
            Data.Quantity = row.find("TD").eq(4).html();
            Data.FailureDetails = row.find("TD").eq(5).html();
            Data.Accessories = row.find("TD").eq(6).html();
            Data.ReceivedNotes = row.find("TD").eq(7).html();
            Data.InWarranty = row.find("TD").eq(8).html();
            Data.Technical = row.find("TD").eq(9).html();
            NTecReportD.push(Data);
        });
        var Data = { NTecReport, NTecReportD }
       
        if (NTecReportD.length == 0 ) {
            swal("Warning",'Sorry,there is no data to save ...', "error") 
        }
        else {
            $.ajax({
                type: "POST",
                url: "/ServiceCenterData/SavingNewReport",
                data: JSON.stringify(Data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (NReportN) {
                    var RequestNO = NReportN;
                    swal({
                        title: "Done",
                        text: 'Report Saved Done...',
                        type: "success",
                        confirmButtonClass: "btn-primary",
                        confirmButtonText: "OK",
                        closeOnConfirm: false,
                        allowOutsideClick: false
                    },
                        function () {
                            window.location = "/ServiceCenterData/ReportDetailes?RequestN=" + RequestNO;
                        }
                    );
                },
                error: function () {
                    swal("Warning", 'Somthing went wrong', "error")
                }
            });
            
        }
      
    }
}


