

    var Items = [];
    var ItemSR = [];
    var SerialsSR = [];
var FilterData = [];
var Countries = [];
    $("body").on("click", "#BtnPayement", function () {
        var Amount = $("#txtAmountPayement").val();
        $("#txtInstallment").val(Amount);
        $("#Installment").modal('hide');
    });
    $("body").on("click", "#BtnSave", function () {
        $("#loader").show();
        var profitValue = 0;
        var Store = document.getElementById("StoreSelect").value;
        var Shift = document.getElementById("DrpShift").value;
        var phone = document.getElementById("txtPhone").value;
        var SC = document.getElementById("DrpCategory").value;
        var PrintName = document.getElementById("txtName").value;
        var Email = document.getElementById("txtEmail").value;
        var Notes = document.getElementById("txtNotes").value;
        var RdPerson = false;
        var RdCompany = false;
        var RecordNumber = document.getElementById("txtRecord").value;
        var ChkCash = document.getElementById("ChkCash").checked;
        var ChkHold = document.getElementById("ChkHold").checked;
        var ChkInstallment = document.getElementById("ChkInstallment").checked;
        var ChkVisa = document.getElementById("ChkVisa").checked;
        var Chkpoint = document.getElementById("Chkpoint").checked;
        var chkBank = document.getElementById("chkBank").checked;
        var chkcheque = document.getElementById("chkcheque").checked;
        var chkNotice = document.getElementById("chkNotDiscount").checked;
        var Total = document.getElementById("lbltotal").innerHTML.replace(",", '');
        var Discount = document.getElementById("txtDiscount").value;
        var ChkDiscount = document.getElementById("ChkDiscount").checked;
        var Sales = document.getElementById("lblSales").innerHTML.replace(",", '');
        var Gtotal = document.getElementById("lblGtotal").innerHTML.replace(",",'');
        var CashValue = parseFloat(document.getElementById("txtCash").value);
        var BanktransferValue = parseFloat(document.getElementById("txtBTransfer").value);
        var ChequeValue = parseFloat(document.getElementById("txtCheque").value);
        var VisaValue = parseFloat(document.getElementById("txtvisa").value);
        var PointsVallue = parseFloat(document.getElementById("txtpoint").value);
        var InstallementValue = parseFloat(document.getElementById("txtInstallment").value);
        var HoldValue = parseFloat(document.getElementById("txtHold").value);
        var NoticeValue = parseFloat(document.getElementById("txtNoticeDiscont").value);
        var BankName = document.getElementById("DrpBank").value;
        var PaymentName = document.getElementById("DrpPayment").value;
        var GtotalValue = ((CashValue) + (PointsVallue) + (NoticeValue) + (BanktransferValue) + (ChequeValue) + (InstallementValue) + (HoldValue) + (VisaValue));
        if (Store==-1) {
        swal("Sorry!", "You Should Select a store", "error")
            return
        }
        else if (Shift==-1) {
        swal("Sorry!", "Time Shift should be selected", "error")
            return
        }
        else if (SC == -1) {
        swal("Sorry!", "Sales Category should be selected", "error")
            return
        }
        else if (phone=="") {
        swal("Sorry!", "You should Enter the phone number", "error")
            return
        }
        else if ($("#RdoCompany").is(":checked") && RecordNumber=="") {
        swal("Sorry!", "You should Enter the Document number", "error")
            return
        }
        else if ($("#ChkCash").is(":checked") && CashValue == 0) {
        swal("Sorry!", "Cash value must be added", "error")
            return
        }
        else if ($("#ChkVisa").is(":checked") && VisaValue == 0) {
        swal("Sorry!", "Visa value must be added", "error")
            return
        }
        else if ($("#ChkHold").is(":checked") && HoldValue == 0) {
        swal("Sorry!", "Hold value must be added", "error")
            return
        }
        else if ($("#ChkInstallment").is(":checked") && InstallementValue == 0) {
        swal("Sorry!", "Installement value must be added", "error")
            return
        }
        else if ($("#chkBank").is(":checked") && BanktransferValue == 0) {
        swal("Sorry!", "Bank Transfer value must be added", "error")
            return
        }
        else if ($("#chkcheque").is(":checked") && ChequeValue == 0) {
        swal("Sorry!", "Cheque value must be added", "error")
            return
        }
        else if ($("#Chkpoint").is(":checked") && PointsVallue == 0) {
        swal("Sorry!", "Points value must be added", "error")
            return
        }
        else if (parseFloat(GtotalValue).toFixed(2) != parseFloat(Gtotal).toFixed(2)) {
        swal("Sorry!", "total piad must be equal total receipt", "error")
         return
         }
        if ($("#RdoPerson").is(":checked")) {

        RdCompany = false;
            RdPerson = true;

        }
        else if ($("#RdoCompany").is(":checked")) {
        RdCompany = true;
            RdPerson = false;

        }
        if ($("#RdoNoticefirst").is(":checked")) {
        profitValue = 1;
        }
        else if ($("#RdoNoticeSecond").is(":checked")) {
        profitValue = 3;
        }
        $.ajax({
        type: "POST",
            url: "/Showroom/InsertReceipt?Store=" + Store + "&Shift=" + Shift + "&phone=" + phone + "&SC=" + SC + "&RecordNumber=" + RecordNumber+
                 "&chkCash=" + ChkCash + "&ChkHold=" + ChkHold + "&ChkInstallment=" + ChkInstallment + "&ChkVisa=" + ChkVisa +
                "&Chkbank=" + chkBank + "&ChkCheque=" + chkcheque + "&Chkpoint=" + Chkpoint +
                "&Total=" + Total + "&ChkDiscount=" + ChkDiscount + "&Discount=" + Discount + "&Sales=" + Sales + "&Gtotal=" + Gtotal + "&BankName=" + BankName +
                "&Payment=" + PaymentName + "&CashValue=" + CashValue + "&banktransfer=" + BanktransferValue + "&visavalue=" + VisaValue +
                "&cheque=" + ChequeValue + "&Installmentvalue=" + InstallementValue + "&PointsValue=" + PointsVallue +
                "&HoldValue=" + HoldValue + "&Person=" + RdPerson + "&Company=" + RdCompany + "&PrintName=" + PrintName + "&Email=" + Email + "&Notes=" + Notes
                + "&NoticeDiscount=" + chkNotice + "&NoticeDiscountValue=" + NoticeValue + "&Profitvalue=" + profitValue,
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               success: function (json) {
                if (json.toString().includes("Not found")) {

                  swal("Sorry!", json.toString(), "error")
                }
                   if (json.toString().includes("You should fill all data about this customer")) {
                       swal("Sorry!", json.toString(), "error")
                       $("#AddCustomer").modal();
                       GetCustomerbyMobile(phone);
                   }
                   if (json.toString().includes("You should fill all data about this company")) {
                       swal("Sorry!", json.toString(), "error")
                       $("#AddCustomer").modal();
                       GetCustomerbyMobile(phone);
                   }
                else if (json.toString().includes("There is No items To save a receipt")) {

                    swal("Sorry!", json.toString(), "error")

                }
                else if (json.toString().includes("You forget to add all serials:")) {

                    swal("Sorry!", json.toString(), "error")

                }
                else if (json.toString().includes("has been sold in another receipt")) {
                        swal("Sorry!", json.toString(), "error")
          } else if (json.toString().includes("is not in your Stock")) {

        swal("Sorry!", json.toString(), "error")
            }
                else if (json.toString().includes("Requested quantity greater than avalable")) {
        swal("Sorry!", json.toString(), "error")
           }
                else if (json.toString().includes("Inserted Done")) {
            $("#loader").hide();
                   var  Number =json.toString().replace(' Inserted Done', '');
                    swal({
                    title: "Done!",
                        text: "Receipt Number " + json.toString(),
                        type: "success"

                    }, function () {

         window.location.href = "/Showroom/Viewreciept?RecieptNo=" + Number
               });
                }
                   else  {
        swal("Sorry!", json.toString(), "error")
    }
            }
        });
    });
        function MyCalculate() {
        var check = document.getElementById("ChkDiscount").checked;
        GetTotal(check);
    }
        function Cash() {
            var check = document.getElementById("ChkCash").checked;
            if (check==true) {
        $("#txtCash").prop("disabled", false);
            }
            else {
        $("#txtCash").prop("disabled", true);
                $("#txtCash").val(0);
            }
    }
        function Hold() {
        var check = document.getElementById("ChkHold").checked;
        if (check == true) {
        $("#txtHold").prop("disabled", false);
        }
        else {
        $("#txtHold").prop("disabled", true);
            $("#txtHold").val(0);
        }
    }
        function Installment() {
        var check = document.getElementById("ChkInstallment").checked;
        if (check == true) {
        $("#txtInstallment").prop("disabled", false);

            $("#Installment").modal('show');

        }
        else {
        $("#txtInstallment").prop("disabled", true);
            $("#txtInstallment").val(0);
            $("#DrpBank").prop('selectedIndex', 0);
            $("#DrpPayment").prop('selectedIndex', 0);
            $("#txtAmountPayement").val(0);
        }
        }
        function Bank() {
            var check = document.getElementById("chkBank").checked;
            if (check == true) {
        $("#txtBTransfer").prop("disabled", false);
            }
            else {
        $("#txtBTransfer").prop("disabled", true);
                $("#txtBTransfer").val(0);
            }
        }
        function Cheque() {
            var check = document.getElementById("chkcheque").checked;
            if (check == true) {
        $("#txtCheque").prop("disabled", false);
            }
            else {
        $("#txtCheque").prop("disabled", true);
                $("#txtCheque").val(0);}
    }
         function Visa() {
        var check = document.getElementById("ChkVisa").checked;
        if (check == true) {
        $("#txtvisa").prop("disabled", false);
        }
        else {
        $("#txtvisa").prop("disabled", true);
            $("#txtvisa").val(0);
        }
    }
        function Points() {
        var check = document.getElementById("Chkpoint").checked;
        if (check == true) {
        $("#txtpoint").prop("disabled", false);
        }
        else {
        $("#txtpoint").prop("disabled", true);
            $("#txtpoint").val(0);
        }
    }
        function calc() {
            var check = document.getElementById("ChkDiscount").checked;
            GetTotal(check);
        }
        function GetTotal(value) {
            var total = 0;
            var salestax = 0;
            var tax = 14;
            for (var i = 0; i < ItemSR.length; i++) {
               total += parseFloat(ItemSR[i].total)
             }
            document.getElementById("lbltotal").innerHTML = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var AfterTotal = total;
            var Discount = $('#txtDiscount').val();
            if (Discount === "") {

        Discount = 0;
                document.getElementById("txtDiscount").value = Discount;

            }
            else {
        document.getElementById("txtDiscount").value = Discount;
            }

            if (value == true) {
        AfterTotal -= (AfterTotal * parseFloat(Discount)) / 100;
            }
            else
                {
        AfterTotal = parseFloat(AfterTotal) - parseFloat(Discount);
            }

            salestax = AfterTotal * (0.14);

            Gtotal =  (parseFloat(AfterTotal) + parseFloat(salestax));
            if (salestax.toString() == "NaN") {
        document.getElementById("lblSales").innerHTML = 0;
                document.getElementById("lblGtotal").innerHTML = 0;
            }
            else {
        document.getElementById("lblSales").innerHTML = Number.parseFloat(salestax).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById("lblGtotal").innerHTML = Number.parseFloat(Gtotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
         $("body").on("click", "#btnClosePopup", function () {
           var Qty = $("#QtySerialCode").html();
              var barcode = $("#lblCodeSerial").html();
            var table = document.getElementById("tblSerials");
            var tbodyRowCount = table.tBodies[0].rows.length;
             if (tbodyRowCount != Qty) {
        swal("Sorry!", "you forget to add all serials for item :" + barcode, "error");
                 return

                }
          else {
        $("#MySerial").modal('hide');
                            }
                        });
         $("body").on("click", "#BtnAddSerials", function () {
        var Serial = $("#txtSerials").val();
        var Qty = $("#QtySerialCode").html();
        var barcode = $("#lblCodeSerial").html();
        var table = document.getElementById("tblSerials");
        var tbodyRowCount = table.tBodies[0].rows.length;
           if (tbodyRowCount == Qty) {
        swal("Sorry!", "You requested over the quantity", "error")
               return;

            document.getElementById('txtSerials').value = '';
        }
           else {

               if (SerialsSR.findIndex(x => x.serial.toString() === Serial.toString()) >= 0) {
        swal("Sorry!", "the serial has been added before", "error")

                   return;
                document.getElementById('txtSerials').value = '';
            }
            else {
        $.ajax({
            type: "POST",
            url: "/Showroom/InsertNewSerial?Code=" + barcode + "&Serial=" + Serial,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (finditems) {
                SerialsSR = finditems;
                DrawSerials();
                document.getElementById('txtSerials').value = '';
                if (finditems.length == Qty) {
                
                    $("#MySerial").modal('hide');
                }
                else {
                    DrawSerials();
                }
            }
        });
            }
        }
    });
         $("body").on("click", "#btnaddserial", function () {
        var Serial = $("#txtSerial");
           if (Serial.val() == "") {
        swal("Sorry!", "Please fill all data to add the Row", "error")
            return;
        }
        else {
            var Qty = $("#lblQty").html();
            var tBody = $("#tblSerial > TBODY")[0];
            var table = document.getElementById("tblSerial");
            var tbodyRowCount = table.tBodies[0].rows.length;
               if (tbodyRowCount == Qty) {
        swal("Sorry!", "You requested over the quantity", "error");
                   return;

            }
               else {
                   if (SerialsSR.findIndex(x => x === Serial.val()) >= 0) {
        swal("Sorry!", "the serial has been added before", "error");
                       return;
                } else {
        SerialsSR.push(Serial.val())
                    var row = tBody.insertRow(-1);
                    var cell = $(row.insertCell(-1));
                    cell.html(Serial.val());
                    cell = $(row.insertCell(-1));
                    var btnRemove = $("<input />");
                    btnRemove.attr("type", "button");
                    btnRemove.attr("onclick", "Remove(this);");
                    btnRemove.val("Remove");
                    btnRemove.addClass("btn btn-danger btn-sm");
                    cell.append(btnRemove);
                    SaveAlldata();
                }
            }
        }
        Serial.val("");
    });
       function Remove(button) {
        var row = $(button).closest("TR");
        var name = $("TD", row).eq(0).html();
        if (confirm("Do you want to Delete This Row: " + name)) {
            var table = $("#tblSerial")[0];
            table.deleteRow(row[0].rowIndex);
        }
    };
$(document).ready(function () {
    GetItems();
    GetStore();
    GetitemsSr();
    GetSerialSr();
    GetCountry();
   
         var inputs = document.getElementById("txtSerials");
        inputs.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
        event.preventDefault();
                document.getElementById("BtnAddSerials").click();
            }
        });
        var input = document.getElementById("txtSerial");
        input.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
        event.preventDefault();
                document.getElementById("btnaddserial").click();
            }
        });
       
        $("#loader").hide();
        $('input[type="radio"]').on('click change', function () {

            if ($("#RdoNoticefirst").is(":checked")) {

                var Gtotal = 0;
                var total = document.getElementById("lblGtotal").innerHTML;
                Gtotal = ((parseFloat(total.replace(",", '')) / 1.14) * 0.01)
                document.getElementById("chkNotDiscount").checked = true;
                document.getElementById("txtNoticeDiscont").value = Gtotal.toFixed(2);
            }
            if ($("#RdoNoticeSecond").is(":checked")) {
                var Gtotal = 0;
                var total = document.getElementById("lblGtotal").innerHTML;

                Gtotal = ((parseFloat(total.replace(",",'')) / 1.14) * 0.03)

                document.getElementById("chkNotDiscount").checked = true;
                document.getElementById("txtNoticeDiscont").value = Gtotal.toFixed(2);

            }
            if ($("#RdoNoticezero").is(":checked")) {

        document.getElementById("chkNotDiscount").checked = false;
                document.getElementById("txtNoticeDiscont").value = 0;

            }

        });
});

       function DrawSerials() {
        var html = '';
        for (var i = 0; i < SerialsSR.length; i++) {
        html += ' <tr >'
            html += ' < tr >'
            html += '<td>'
        html += i + 1
            html += '</td>'
            html += '<td>' + SerialsSR[i].serial + ' </td>'
            html += '<td>'
            html += '<button class="btn btn-danger" onclick="RemoveItemSerial(\'' + SerialsSR[i].serial.toString() + '\',\'' + SerialsSR[i].barcode.toString() + '\')"> Remove</button> '
            html += '</td>'
            html += '</tr>'
        }
        $('#bodySerials').html(html);

    }
       function DrawBody() {
        var html = ''  ;
           for (var i = 0; i < ItemSR.length; i++) {
        html += ' <tr >'
            html+=' < tr >'
            html += '<td>'
        html +=  i +1
            html += '</td>'
            html += '<td>' + ItemSR[i].barcode+' </td>'
            html += '<td> ' + ItemSR[i].modelName+'</td>'
            html += '<td>' + ItemSR[i].descritpion + ' </td>'
            if (ItemSR[i].serialized) {
            html += ' <td> <input type="checkbox" id="ChkSerial" disabled="disabled" checked="true" /></td>'
        } else {
            html += ' <td> <input type="checkbox" id="ChkSerial" disabled="disabled"  /></td>'
        }
            html += '<td>'+ItemSR[i].unitPrice+ '</td>'
            html += '<td>'+ ItemSR[i].quantity+ '</td>'
            html += '<td>' + ItemSR[i].total + ' </td>'
            html += '<td>'
            html += '<a class="fa fa-eye" onClick="Viewitem(\'' + ItemSR[i].barcode.toString() + '\')" style="font-size: 21px"</a> <a class="fa fa-trash-o" style="color:red;font-size: 21px" onClick="Removeitem(\'' + ItemSR[i].barcode.toString() + '\')"></a>'
            html +='</td>'
            html += '</tr>'
        }
        $('#bodyItems').html(html);

        }
    function GetItems() {
        try {
        $.ajax({
            type: "GET",
            url: "/Showroom/GetProducts",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (recData) {
             
                Items = recData;
            },
            error: function () {
                swal("Sorry!", "Error in loading", "error");
                return;
            }
        });
        } catch (ex) {
  
        }

    }
       function GetitemsSr() {
        $.ajax({
            type: "GET",
            url: "/Showroom/GetItemsSR",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (AllData) {
                ItemSR = AllData;
                DrawBody();
                document.getElementById("txtsearch").value = "";
                filter();
                GetTotal();
              

            },
            error: function () {
                swal("Sorry!", "Error in loading", "error");
                return;
            }
        });
    }
       function GetSerialSr() {
        $.ajax({
            type: "GET",
            url: "/Showroom/GetSerialSr",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (AllDataSR) {
               
                SerialsSR = AllDataSR;
                DrawSerials();
            },
            error: function () {
                swal("Sorry!", "Error in loading", "error");
                return;
            }
        });

    }
       function filter() {
           FilterData = []
           Items = []

        var html = '';
        var text = document.getElementById("txtsearch").value
           for (var i = 0; i < Items.length; i++) {
            if (Items[i].barCode != null) {
                if (Items[i].barCode.includes(text)) {
        FilterData.push(Items[i])
             } else if (Items[i].modelName != null) {
                    if (Items[i].modelName.toLowerCase().includes(text.toLowerCase())) {
        FilterData.push(Items[i])
             }
                }
            } else if (Items[i].modelName != null) {
                if (Items[i].modelName.toLowerCase().includes(text.toLowerCase())) {
        FilterData.push(Items[i])
    }
            }
           }

           if (FilterData.length <= 100 && FilterData.length != 0) {
            for (var i = 0; i < FilterData.length; i++) {
                if (FilterData[i].sellingPrice != null && FilterData[i].sellingPrice != 0 ) {
                 html += ' <tr class="txtMult">'
                    html += ' <td ></td>'
                    html += '     <td scope="row">' + FilterData[i].barCode + '</td>'
                    html += '    <td>' + FilterData[i].modelName + '</td>'
                    html += '    <td>' + FilterData[i].fullDescription + '</td>'
                     if (FilterData[i].isSerialized) {
                         html += ' <td> <input type="checkbox" id="chkCif' + FilterData[i].code + '" disabled="disabled" checked="true" /></td>'
                     } else {
                        html += ' <td> <input type="checkbox" id="chkCif" disabled="disabled"  /></td>'
                }
                    html += '    <td><label class="val1">' + FilterData[i].sellingPrice + '</td>'
                    html += '    <td> <input type="number" style="width:100px;" id="txtQt' + FilterData[i].code + '" class="val2" autofocus /></td>'
                    html += '    <td>  <span class="multTotal">0.00</span></td>'
                    html += '    <td><a class="fa fa-plus-square" style="font-size: 21px" id="btnAdd" onClick="GetItemID(\''+FilterData[i].barCode.toString()+'\')"></a></td>'
                    html += '</tr>'
                }
            }
          
           }
           else if (FilterData.length == 0) {
               Items = []
               FilterData = []
            
               $.ajax({

                   type: "POST",
                   url: "/Showroom/GetItem?Code=" + text,
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   success: function (AllDataSR) {
                       Items = AllDataSR;
                       Drawfilter();
                   }
                  
               });
           } 
             $('#itemsTable').html(html);
}
function Drawfilter() {
    FilterData = [];
    var html = '';
    var text = document.getElementById("txtsearch").value
    for (var i = 0; i < Items.length; i++) {
        if (Items[i].barCode != null) {
            if (Items[i].barCode.includes(text)) {
                FilterData.push(Items[i])
            } else if (Items[i].modelName != null) {
                if (Items[i].modelName.toLowerCase().includes(text.toLowerCase())) {
                    FilterData.push(Items[i])
                }
            }
        } else if (Items[i].modelName != null) {
            if (Items[i].modelName.toLowerCase().includes(text.toLowerCase())) {
                FilterData.push(Items[i])
            }
        }
    }


        for (var i = 0; i < FilterData.length; i++) {
            if (FilterData[i].sellingPrice != null && FilterData[i].sellingPrice != 0) {
                html += ' <tr class="txtMult">'
                html += ' <td ></td>'
                html += '     <td scope="row">' + FilterData[i].barCode + '</td>'
                html += '    <td>' + FilterData[i].modelName + '</td>'
                html += '    <td>' + FilterData[i].fullDescription + '</td>'
                if (FilterData[i].isSerialized) {
                    html += ' <td> <input type="checkbox" id="chkCif' + FilterData[i].code + '" disabled="disabled" checked="true" /></td>'
                } else {
                    html += ' <td> <input type="checkbox" id="chkCif" disabled="disabled"  /></td>'
                }
                html += '    <td><label class="val1">' + FilterData[i].sellingPrice + '</td>'
                html += '    <td> <input type="number" style="width:100px;" id="txtQt' + FilterData[i].code + '" class="val2" autofocus /></td>'
                html += '    <td>  <span class="multTotal">0.00</span></td>'
                html += '    <td><a class="fa fa-plus-square" style="font-size: 21px" id="btnAdd" onClick="GetItemID(\'' + FilterData[i].barCode.toString() + '\')"></a></td>'
                html += '</tr>'
            }
     
    }
    $('#itemsTable').html(html);
}
       function GetItemID( barcode) {
        var item = FilterData.find(x => x.barCode.toString() === barcode.toString())
        if (ItemSR.findIndex(x => x.barcode.toString() === barcode.toString()) >= 0) {
        swal("Sorry!", "the item has benn added", "error")}
        else {
            var Code = document.getElementById("StoreSelect").value;
            if (Code == -1) {
        swal("Sorry!", "You should select store", "error");
                return;
            }
            else {
                var Qty = (document.getElementById("txtQt" + item.code).value);
                if (item.isSerialized == true) {
                    if (Qty == 0) {
        swal("Sorry!", "You should enter the quantity", "error");
                        return;
                    }
                    else {
        $("#myModal").modal();
                        window.setTimeout(function () {
        document.getElementById('txtSerial').focus();
                        }, 300);
                        $("#lblQty").text(Qty);
                        $("#lblCode").text(item.barCode);
                        $("#lblModel").text(item.modelName);
                        $("#lblDesc").text(item.fullDescription);
                        $("#lblprice").text(item.sellingPrice);
                    }
                }
                else {
        $.ajax({
            type: "POST",
            url: "/Showroom/InsertItem?Code=" + item.barCode + "&name=" + item.modelName + "&description=" + item.fullDescription + "&price=" + item.sellingPrice + "&Qty=" + Qty,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
            
                GetitemsSr();
                ItemSR.push(Code);
            }
        });
                }
            }
        }
    }
    function clickPress(event) {
        if (event.keyCode == 13) {
            var phone = $("#txtPhone").val();
            document.getElementById("txtEmail").value = "";
            document.getElementById("txtName").value = "";
            document.getElementById("txtRecord").value = "";
            document.getElementById("txtNewCust").value = "";
            document.getElementById("txtnewphone").value ="";
            document.getElementById("txtnewNational").value = "";
            document.getElementById("txtnewEmail").value = "";
            document.getElementById("txtNewCust").value = "";
            document.getElementById("txtnewphone").value = "";
            document.getElementById("txtnewNational").value = "";
            document.getElementById("txtnewEmail").value = "";
            document.getElementById("txtnewNational").value == "";
            document.getElementById('chknewperson').checked = true;
            document.getElementById("txtnewGovernate").value = "";
            document.getElementById("txtnewRegion").value = "";
            document.getElementById("txtnewStreet").value = "";
            document.getElementById("txtnewbuiling").value = "";
            document.getElementById("Countrynew").selectedIndex = 0
            document.getElementById("CodeCust").innerHTML = 0;
          
            $.ajax({
                type: "GET",
                url: "/Showroom/GetCustomer?Phone=" + phone,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (findCust) {
                    console.log(findCust);
                    if (findCust == null) {
                        swal("Sorry!", "No customer has been found", "error")
                        $("#AddCustomer").modal('show');
                    }
                    else {
                        document.getElementById("txtEmail").value = findCust.email
                        document.getElementById("txtName").value = findCust.firstName
                        if (findCust.person) {
                            document.getElementById("RdoCompany").checked = false;
                            document.getElementById("RdoPerson").checked = true;
                            document.getElementById("txtRecord").value = findCust.nationalID;
                            document.getElementById("txtNewCust").value = findCust.firstName;
                            document.getElementById("txtnewphone").value = phone;
                            document.getElementById("txtnewNational").value = findCust.nationalID;
                            document.getElementById("txtnewEmail").value = findCust.email;
                            document.getElementById('chknewperson').checked = true;
                            document.getElementById("CodeCust").innerHTML = findCust.id;
                            document.getElementById("txtnewbuiling").value = findCust.buildingNumber;
                            document.getElementById("txtnewStreet").value = findCust.street;
                            document.getElementById("txtnewRegion").value = findCust.regionCity;
                            document.getElementById("txtnewGovernate").value = findCust.governate;
                            var find = Countries.findIndex(x => x.code === findCust.country)
                            document.getElementById("Countrynew").selectedIndex = find + 1 
                        }
                        else {
                            document.getElementById("RdoCompany").checked = true;
                            document.getElementById("RdoPerson").checked = false;
                            document.getElementById("txtRecord").value = findCust.registrationNo;
                            document.getElementById("txtNewCust").value = findCust.firstName;
                            document.getElementById("txtnewphone").value = phone;
                            document.getElementById("txtnewNational").value = findCust.registrationNo;
                            document.getElementById("txtnewEmail").value = findCust.email;
                            document.getElementById('chknewperson').checked = false;
                            document.getElementById("CodeCust").innerHTML = findCust.id;
                            document.getElementById("txtnewbuiling").value = findCust.buildingNumber;
                            document.getElementById("txtnewStreet").value = findCust.street;
                            document.getElementById("txtnewRegion").value = findCust.regionCity;
                            document.getElementById("txtnewGovernate").value = findCust.governate;
                            var find = Countries.findIndex(x => x.code === findCust.country)
                            document.getElementById("Countrynew").selectedIndex = find + 1 
                        }
                        
                    }
                },

            })
        }
    }
       function GetStore() {
        $.ajax({
            type: "GET",
            url: "/Showroom/GetStore",
            contentType: "application/json; charset=utf-8",
            data: "{}",
            dataType: "json",
            success: function (data) {
                var s = '<option value="-1">--Select Store--</option>';
                for (var i = 0; i < data.length; i++) {
                    s += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
                }
                $("#StoreSelect").html(s);
            },
            error: function () {
                swal("Sorry!", "Error in loading", "error");
                return;
            }
        });
    }
       function SaveAlldata() {

        var Qty = $("#lblQty").html();
        var model = $("#lblModel").html();
        var description = $("#lblDesc").html();
        var price = $("#lblprice").html();
        var table = document.getElementById("tblSerial");
        var tbodyRowCount = table.tBodies[0].rows.length;
        if (tbodyRowCount != Qty) {

    }
        else {
            var SerialSR = new Array();
            var Code = $("#lblCode").html();
            var Store = document.getElementById("StoreSelect").value;
            $("#tblSerial TBODY TR").each(function () {
                var row = $(this);
                var Data = { };
                Data.Barcode = Code;
                Data.Serial = row.find("TD").eq(0).html().trim();
                Data.Store = Store;
                SerialSR.push(Data);
            });

            $.ajax({
        type: "POST",
                url: "/Showroom/InsertSerials?Code=" + Code + "&name=" + model + "&description=" + description + "&price=" + price + "&Qty=" + Qty ,
                data: JSON.stringify(SerialSR),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
   
                    $("#myModal").modal('hide');
                    GetitemsSr();
                    ItemSR.push(Code);
                    SerialsSR.push(SerialSR);
                    $("#bodyserial").children().remove();
                    SerialsSR = [];
                    Items = [];
                    FilterData = [];
                }
            });
        }
    }
       function Removeitem(barcode) {
        var item = ItemSR.find(x => x.barcode.toString() === barcode.toString())
        swal({
        title: "Are you sure?",
            text: "You Want to Delete This item " + item.modelName,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Confirm",
            closeOnConfirm: true
        },
            function () {
        $.ajax({
            type: "GET",
            url: "/Showroom/RemoveItem?Code=" + barcode,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                if (json == "Data") {
                    GetitemsSr();
                    DrawBody();
                    GetSerialSr();
                    DrawSerials();

                }

            }
        });
            });
    }
       function Viewitem(barcode) {
        var item = ItemSR.find(x => x.barcode.toString() === barcode.toString())
        $.ajax({
        type: "POST",
            url: "/Showroom/ViewItem?Code=" + item.barcode,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (findItem) {
        SerialsSR = findItem;
                $("#QtySerialCode").text(findItem.length);
                $("#lblCodeSerial").text(barcode);
                DrawSerials();
                $("#MySerial").modal('show');
            }
        });
    }
       function RemoveItemSerial(Serial, Barcode) {
        $.ajax({
            type: "POST",
            url: "/Showroom/RemoveItemserial?Code=" + Barcode + "&Serial=" + Serial,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (finditems) {
                SerialsSR = finditems;
                DrawSerials();
            }
        });
    }
       function SearchSerials(event) {
        if (event.keyCode == 13) {
            var Serial = document.getElementById("txtSearchserial").value
            Serial = Serial.replace('+',';')
            $.ajax({
        type: "POST",
                url: "/Showroom/GetItemSerial?Serial=" + Serial,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    if (json == "Data") {
                        GetitemsSr();
                        DrawBody();
                        var Serial = $("#txtSearchserial");
                        Serial.val("");
                    }
                }
            });
        }
}
$("body").on("click", "#btnaddCustomer", function () {
    $("#AddCustomer").modal()
});
function AddNewCustomer() {
    var Name = document.getElementById("txtNewCust").value;
    var Code = document.getElementById("CodeCust").innerHTML;
    var Phone = document.getElementById("txtnewphone").value;
    var Email = document.getElementById("txtnewEmail").value;
    var National = document.getElementById("txtnewNational").value;
    var chkperson = document.getElementById('chknewperson').checked;
    var Governate = document.getElementById("txtnewGovernate").value;
    var Region = document.getElementById("txtnewRegion").value;
    var Street = document.getElementById("txtnewStreet").value;
    var building = document.getElementById("txtnewbuiling").value;
    var country = document.getElementById("Countrynew").value;
    if (chkperson == true) {
        if (Name == "" || Phone == "" || country == -1  ) {
            swal("Sorry!", "You should Enter All Data Related To the Person ", "error")
            return
        }
    }
    if (chkperson == false) {
        if (National == "" || Governate == "" || Region == "" || Street == "" || building == "" || Name == "" || country == -1) {
            swal("Sorry!", "You should Enter All Data Related To the company ", "error")
            return
        }
    }
    if (Code != 0) {
            $.ajax({
                type: "POST",
                url: "/Showroom/UpdateCustomer?Code=" + Code + "&Name=" + Name
                    + "&Phone=" + Phone + "&Email=" + Email +
                    "&National=" + National + "&chkperson=" + chkperson
                    + "&Governate=" + Governate + "&Region=" + Region + "&Street=" + Street +
                    "&building=" + building + "&country=" + country,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (json) {
                    if (json == "Updated Done") {
                        swal({
                            title: "Done!",
                            text: "Customer Data : " + json.toString(),
                            type: "success"
                        }, function () {
                                GetCustomerbyMobile(Phone);
                                $("#AddCustomer").modal('hide');
                                document.getElementById("txtNewCust").value = "";
                                document.getElementById("txtnewphone").value = "";
                                document.getElementById("txtnewNational").value = "";
                                document.getElementById("txtnewEmail").value = "";
                                document.getElementById("txtnewNational").value == "";
                                document.getElementById('chknewperson').checked =true;
                              document.getElementById("txtnewGovernate").value ="";
                               document.getElementById("txtnewRegion").value = "";
                              document.getElementById("txtnewStreet").value = "";
                                document.getElementById("txtnewbuiling").value = "";
                                document.getElementById("Countrynew").selectedIndex = 0
                                document.getElementById("CodeCust").innerHTML = 0;
                        });
                    }
    
        }
    });
    }
    else if (Code==0) {
          $.ajax({
        type: "POST",
        url: "/Showroom/InsertNewCutstomer?Name=" + Name
            + "&Phone=" + Phone + "&Email=" + Email +
            "&National=" + National + "&chkperson=" + chkperson
            + "&Governate=" + Governate + "&Region=" + Region + "&Street=" + Street +
            "&building=" + building + "&country=" + country,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
              success: function (json) {
                  if (json == "Inserted Done") {
                      swal({
                          title: "Done!",
                          text: "Customer Data has been : " + json.toString(),
                          type: "success"
                      }, function () {
                          GetCustomerbyMobile(Phone);
                          $("#AddCustomer").modal('hide');
                              document.getElementById("txtNewCust").value = "";
                              document.getElementById("txtnewphone").value = "";
                              document.getElementById("txtnewNational").value = "";
                              document.getElementById("txtnewEmail").value = "";
                              document.getElementById("txtnewNational").value == "";
                              document.getElementById('chknewperson').checked = true;
                              document.getElementById("txtnewGovernate").value = "";
                              document.getElementById("txtnewRegion").value = "";
                              document.getElementById("txtnewStreet").value = "";
                              document.getElementById("txtnewbuiling").value = "";
                              document.getElementById("Countrynew").selectedIndex = 0
                              document.getElementById("CodeCust").innerHTML = 0;
                      });
                  }
                   }
    });
    }
  
}
function GetCountry() {
    $.ajax({
        type: "GET",
        url: "/Showroom/GetCountries",
        contentType: "application/json; charset=utf-8",
        data: "{}",
        dataType: "json",
        success: function (data) {
            Countries = data
            var s = '<option value="-1">--Select Country--</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
            }
            $("#Countrynew").html(s);
        },
        error: function () {
            swal("Sorry!", "Error in loading", "error");
            return;
        }
    });
}
function GetCustomerbyMobile(phone) {

    $.ajax({
        type: "GET",
        url: "/Showroom/GetCustomer?Phone=" + phone,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (findCust) {
                if (findCust.person) {
                    document.getElementById("RdoCompany").checked = false;
                    document.getElementById("RdoPerson").checked = true;
                    document.getElementById("txtRecord").value = findCust.nationalID;
                    document.getElementById("txtNewCust").value = findCust.firstName;
                    document.getElementById("txtnewphone").value = phone;
                    document.getElementById("txtPhone").value = phone;
                    document.getElementById("txtnewNational").value = findCust.nationalID;
                    document.getElementById("txtnewEmail").value = findCust.email;
                    document.getElementById('chknewperson').checked = true;
                   document.getElementById("txtEmail").value = findCust.email
                    document.getElementById("txtName").value = findCust.firstName
                    document.getElementById("CodeCust").innerHTML = findCust.id;
                    document.getElementById("txtPhone").value = phone;
                    var find = Countries.findIndex(x => x.code === findCust.country)
                    document.getElementById("Countrynew").selectedIndex = find + 1 
                }
                else {
                    document.getElementById("RdoCompany").checked = true;
                    document.getElementById("RdoPerson").checked = false;
                    document.getElementById("txtEmail").value = findCust.email
                    document.getElementById("txtName").value = findCust.firstName
                    document.getElementById("txtRecord").value = findCust.registrationNo;
                    document.getElementById("txtNewCust").value = findCust.firstName;
                    document.getElementById("txtnewphone").value = phone;
                    document.getElementById("txtnewNational").value = findCust.registrationNo;
                    document.getElementById("txtnewEmail").value = findCust.email;
                    document.getElementById('chknewperson').checked = false;
                    document.getElementById("CodeCust").innerHTML = findCust.id;
                    document.getElementById("txtPhone").value = phone;
                    var find = Countries.findIndex(x => x.code === findCust.country)
                    document.getElementById("Countrynew").selectedIndex = find + 1 
                }
            }
            });
}

