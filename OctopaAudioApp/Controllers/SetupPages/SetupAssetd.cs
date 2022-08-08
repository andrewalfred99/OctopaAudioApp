using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctopaAudioApp.Models;
using OctopaAudioApp.Models.Assigning;
using OctopaAudioApp.Models.AudioDataContext;
using OctopaAudioApp.Models.SetupModels;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Packaging;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Controllers.SetupPages
{
    public class SetupAssetd : Controller
    {
        private readonly AudioDbContext _Context;
        public SetupAssetd(AudioDbContext context)
        {
            _Context = context;
        }
        public JsonResult GetAllDataitem()
        {
            try
            {
                var Data = _Context.Inputs.Join(_Context.AssetBrands, a => a.Brands, b => b.Code, (a, b) => new { a, b })
          .Join(_Context.AssetTypes, c => c.a.Types, d => d.Code, (c, d) => new { c, d }).Join(_Context.AssetStatuses, e => e.c.a.Status, f => f.Code, (e, f) => new { e, f })
          .Select(A => new { A.e.c.a.SerialNUmber, A.e.c.b.BrandName, A.e.d.TypeName, A.f.StatusName, A.e.c.a.Notes, A.e.c.a.Description, A.e.c.a.Cpu, A.e.c.a.GPU, A.e.c.a.Ram, A.e.c.a.Storage, A.e.c.a.AvilabiltyStatus }).ToList();
                return Json(Data);
            }
            catch (Exception ex)
            {

                throw;
            }
          
        }
        [HttpGet]
        public JsonResult GetEmpData(int EMPCode)
        {
            var find = _Context.Employees.Join(_Context.Departments, a => a.Department, b => b.Code, (a, b) => new { a, b })
                .Select(A => new { A.a.EnglishName, A.a.EnglishPosition, A.a.DirectManager, A.b.Name, A.a.Code })
                .Where(s => s.Code == EMPCode)
                .FirstOrDefault();
            return Json(find);
        }
        [HttpGet]
        public JsonResult Relocate(string serial, int ID, int NEWID)
        {
            try
            {
                var find = _Context.EmployeAssets.Find(ID, serial);

                return Json(find);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        


        public JsonResult SaveEMPAndItemData(int Code, [FromBody] ALLDataView aLLDataView)
        {
            try
            {
                EmployeAsset NewE ;
                AssetHistory NEWH ;

                foreach (var item in aLLDataView.ItemArray)
                {
                    
                    var findinput = _Context.Inputs.Where(I=> I.SerialNUmber == item.SerialNUmber).FirstOrDefault();
                    findinput.AvilabiltyStatus = false;
                    NewE = new EmployeAsset();
                    NewE.EmployeID = Code;
                    NewE.SerialNUmber = item.SerialNUmber;
                    NewE.AddedUser = User.Identity.Name;
                    NewE.DateUpdate = DateTime.Now;
                    NEWH = new AssetHistory();
                    NEWH.Code = _Context.AssetHistories.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
                    NEWH.AssigendEMP = Code;
                    NEWH.AvilabiltyStatus = false;
                    NEWH.Status = findinput.Status;

                    NEWH.SerialNUmber = item.SerialNUmber;
                    NEWH.DateUpdate = DateTime.Now;
                    NEWH.AddedUser = User.Identity.Name;
                    NEWH.Changes = "Assigned To Employee";
                    _Context.AssetHistories.Add(NEWH);
                    _Context.EmployeAssets.Add(NewE);
                    _Context.SaveChanges();

                }
                return Json("okay");
            }
            catch (Exception ex) 
            {
                throw;
            }

            
        }

        public IActionResult Adding()
        {
           
            //var Switch = _Context.AssetBrands
            //    .Join(
            //    _Context.Inputs,
            //   BrandSetup => AssetBrand,
            //   BrandsItems => Inputs,
            //   (BrandSetup, BrandsItems) => new
            //   {
            //       BrandID = BrandsItems.Brands,
            //       BrandName = BrandSetup.BrandName,
            //   }
            //    ).Tolist();
          
            var BrandList = _Context.AssetBrands.ToList();
            var TypeList = _Context.AssetTypes.ToList();
            var StatusList = _Context.AssetStatuses.ToList();

            ViewData["TypeListData"] = TypeList;
            ViewData["StatusListData"] = StatusList;
            ViewData["BrandListData"] = BrandList;
            return View();
        }
        public IActionResult CreateNewBrand()
        {
            var BrandList = _Context.AssetBrands.ToList();
            ViewData["BrandListData"] = BrandList;
            return View();
        }
        public JsonResult SaveNewBrand(string BrandName)
        {
            try
            {
                AssetBrand NewB = new AssetBrand();
                NewB.BrandName = BrandName;
                NewB.DateUpdate = DateTime.Now;
                NewB.AddedUser = User.Identity.Name;
                _Context.AssetBrands.Add(NewB);
                _Context.SaveChanges();
                return Json("Brand Created Done");
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        
            public IActionResult CreateNewType()
            {
            var TypeList = _Context.AssetTypes.ToList();
            ViewData["TypeListData"] = TypeList;
            return View();
            }
        public JsonResult SaveNewType(string TypeName)
        {
            try
            {
                AssetType NewT = new AssetType();
                NewT.TypeName = TypeName;
                NewT.DateUpdate = DateTime.Now;
                NewT.AddedUser = User.Identity.Name;
                _Context.AssetTypes.Add(NewT);
                _Context.SaveChanges();
                return Json("Type Created Done");
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public IActionResult CreateNewStatus()
        {
            var StatusList = _Context.AssetStatuses.ToList();
            ViewData["StatusListData"] = StatusList;
            return View();
        }
       
        public ActionResult EditStatus(int Code)
        {
            var StatusList = _Context.AssetStatuses.ToList();
            var std = StatusList.Where(s => s.Code == Code).FirstOrDefault();
            return View(std);
        }
        [HttpPost]
        public ActionResult EditStatus(AssetStatus std)
        {
            var StatusList = _Context.AssetStatuses.ToList();
            var Status = StatusList.Where(s => s.Code == std.Code).FirstOrDefault();

            return RedirectToAction("CreateNewStatus");
        }

        public JsonResult SaveNewStatus(string StatusName)
        {
            try
            {
                AssetStatus NewS = new AssetStatus();
                NewS.StatusName = StatusName;
                NewS.DateUpdate = DateTime.Now;
                NewS.AddedUser = User.Identity.Name;
                _Context.AssetStatuses.Add(NewS);
                _Context.SaveChanges();
                return Json("Status Created Done");
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public JsonResult SaveInputData([FromBody] ALLDataView NewItem)
        {
            try
            {
                //var item = NewItem.Data;
                Inputs NewI = new Inputs();
                AssetHistory NEWH = new AssetHistory();
                NewI.SerialNUmber = NewItem.Data.SerialNUmber;
                NewI.Brands = NewItem.Data.Brands;
                NewI.Types = NewItem.Data.Types;
                NewI.Status = NewItem.Data.Status;
                NewI.Notes = NewItem.Data.Notes;
                NewI.Description = NewItem.Data.Description;
                NewI.Cpu = NewItem.Data.Cpu;
                NewI.GPU = NewItem.Data.GPU;
                NewI.Ram = NewItem.Data.Ram;
                NewI.Storage = NewItem.Data.Storage;
                NewI.AddedUser = User.Identity.Name;
                NewI.DateUpdate = DateTime.Now;
                NewI.AvilabiltyStatus = true;
                NEWH.SerialNUmber = NewItem.Data.SerialNUmber;
                NEWH.DateUpdate = DateTime.Now;
                NEWH.AddedUser = User.Identity.Name;
                NEWH.Code = _Context.AssetHistories.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
                NEWH.Status = NewItem.Data.Status;
                NEWH.AssigendEMP = 0;
                NEWH.AvilabiltyStatus = true;
                NEWH.Changes = "Asset Created";
                _Context.Inputs.Add(NewI);
                _Context.AssetHistories.Add(NEWH);
                _Context.SaveChanges();
                return Json("Accepted");
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public JsonResult SaveExcelSheet([FromBody]  ALLDataView NewAssign)
        {
            try
            {

            
            foreach (var item in NewAssign.ExcelList)
            {
                AssignModel NewA = new AssignModel();
                    NewA.SerialNo = item.SerialNo;
                    NewA.AssingedUser = item.AssingedUser;
                    NewA.Quantity = item.Quantity;
                    NewA.AddedUser = User.Identity.Name;
                    NewA.DateUpdate = DateTime.Now;
                    _Context.Assigns.Add(NewA);
                    _Context.SaveChanges();
            }

            return Json("Accepted");
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public JsonResult ImportSheetExcel(IFormFile file, String GName)
        {
            List<string> NoteExisting = new List<string>();
            var All = new List<AssignModel>();
            

            string Message = "";
            try
            {
                if (file == null)
                {
                    Message = "You Forgot To select a file ";
                }


                else

                {

                    List<AssignModel> FillList = new List<AssignModel>();
                    var stream = file.OpenReadStream();
                    using (var package = new ExcelPackage(stream))
                    {
                        ExcelWorkbook excelWorkbook = package.Workbook;
                        var work = package.Workbook.Worksheets.ToList();
                        foreach( var worksheet in excelWorkbook.Worksheets)
                        {
                            var end = worksheet.Dimension.Rows;
                            for(int row = 2; row <= end; row++)
                            {
                                All.Add(new AssignModel
                                {
                                    SerialNo = worksheet.Cells[row, 1].Value.ToString().Trim(),
                                    Quantity = int.Parse(worksheet.Cells[row, 2].Value.ToString().Trim()),
                                    AssingedUser = worksheet.Cells[row, 3].Value.ToString().Trim(),
                                });
                            }
                        }
                    }
                }
                var Dataobject = new { All };
                return Json(Dataobject);
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public JsonResult UploadPhoneSheet(IFormFile file)
        {
            try
            {
                var All = new List<AssignModel>();
                var stream = file.OpenReadStream();
                using (var package = new ExcelPackage(stream))
                {
                        ExcelWorkbook excelworbook = package.Workbook;
                        var work = package.Workbook.Worksheets.ToList();
                        foreach (var worksheet in excelworbook.Worksheets)
                        {
                            var end = worksheet.Dimension.Rows;
                            for (int row = 2; row <= end; row++)
                            {
                                All.Add(new AssignModel
                                {
                                    SerialNo = worksheet.Cells[row, 1].Value.ToString().Trim(),
                                    Quantity = int.Parse(worksheet.Cells[row, 2].Value.ToString().Trim()),
                                    AssingedUser = worksheet.Cells[row, 3].Value.ToString().Trim(),
                                }); ;
                            }

                        }
                   
                }
                var Dataobject =new  { All };
                return Json(Dataobject);
            }
            catch (Exception ex)
            {

                throw;
            }
          
        }
       
        public JsonResult EditStatusByCode(int Code,string NewStatus)
        {
            try
            {
                var find = _Context.AssetStatuses.Find(Code);
                find.StatusName = NewStatus;
                _Context.SaveChanges();
                return Json("Status Edit Done");
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        [HttpPost]  
        public JsonResult OpenPopupStatus(int Code)
        {
            try
            {
                var find = _Context.AssetStatuses.Find(Code);
                string Name = find.StatusName;
                
                return Json(Name);
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public JsonResult EditStatusItemEMP(string Item)
        {
            var find = _Context.EmployeAssets.Find(Item);
            if (find == null) {
                return Json(0);
            }
            else {
                return Json(find.EmployeID);
            }
        }
        public JsonResult EditItemStatus(string Item, int status, int EMPID)
        {
            var find = _Context.EmployeAssets.Where(R => R.SerialNUmber == Item && R.EmployeID == EMPID).FirstOrDefault();
            var findEMPOFITEM = _Context.EmployeAssets.Find(Item);
            AssetHistory assetHistory = new AssetHistory();
            var findInput = _Context.Inputs.Find(Item);
            findInput.Status = status;
            assetHistory.SerialNUmber = Item;
            if (find == null && findEMPOFITEM == null)
            {
                assetHistory.AssigendEMP = 0;
            }
            if (findEMPOFITEM != null) 
            {
                assetHistory.AssigendEMP = findEMPOFITEM.EmployeID;
            }
            if(find != null)
            {
                assetHistory.AssigendEMP = find.EmployeID;
            }
            assetHistory.Changes = "Status Changed";
            assetHistory.DateUpdate = DateTime.Now;
            assetHistory.Status = status;
            assetHistory.AddedUser = User.Identity.Name;
            assetHistory.Code = _Context.AssetHistories.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
            _Context.AssetHistories.Add(assetHistory);
            _Context.Inputs.Update(findInput);
            _Context.SaveChanges();
            return Json("Done");
        }
        public JsonResult Reassign (int OLDEMP, int NEWEMP, string Item)
        {
            try
            {
                AssetHistory NEWB = new AssetHistory();
                var find = _Context.EmployeAssets.Where(R=>R.SerialNUmber == Item && R.EmployeID == OLDEMP).FirstOrDefault();
                var findInput = _Context.Inputs.Find(Item);
                if (NEWEMP == -1)
                {
                    _Context.EmployeAssets.Remove(find);
                    findInput.AvilabiltyStatus = true;
                    NEWB.AssigendEMP = 0;
                    NEWB.Status = findInput.Status;
                    NEWB.AvilabiltyStatus = true;
                    NEWB.SerialNUmber = Item;
                    NEWB.Code = _Context.AssetHistories.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
                    NEWB.AddedUser = User.Identity.Name;
                    NEWB.DateUpdate = DateTime.Now;
                    NEWB.Changes = "Returned To inventory";
                }
                else
                {
                    find.EmployeID = NEWEMP;
                    find.AddedUser = User.Identity.Name;
                    find.DateUpdate = DateTime.Now;
                    NEWB.AssigendEMP = NEWEMP;
                    findInput.AvilabiltyStatus = false;
                    NEWB.AvilabiltyStatus = false;
                    NEWB.SerialNUmber = Item;
                    NEWB.Code = _Context.AssetHistories.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
                    NEWB.Status = findInput.Status;
                    NEWB.AddedUser = User.Identity.Name;
                    NEWB.DateUpdate = DateTime.Now;
                    NEWB.Changes = "Reassigned to Another Employe";
                }

                _Context.AssetHistories.Add(NEWB);
                _Context.SaveChanges();
                return Json("Done");
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        public JsonResult EditTypeByCode(int Code, string NewType)
        {
            try
            {
                var find = _Context.AssetTypes.Find(Code);
                find.TypeName = NewType;
                _Context.SaveChanges();
                return Json("Type Edit Done");
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        
        [HttpPost]
        public JsonResult OpenPopupType(int Code)
        {
            try
            {
                var find = _Context.AssetTypes.Find(Code);
                string Name = find.TypeName;

                return Json(Name);
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public JsonResult EditBrandByCode(int Code, string NewBrand)
        {
            try
            {
                var find = _Context.AssetBrands.Find(Code);
                find.BrandName = NewBrand;
                _Context.SaveChanges();
                return Json("Brand Edit Done");
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        [HttpPost]
        public JsonResult OpenPopupbrand(int Code)
        {
            try
            {
                var find = _Context.AssetBrands.Find(Code);
                string Name = find.BrandName;

                return Json(Name);
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public IActionResult ItemToUser()
        {
            var EMPData = _Context.Employees.FirstOrDefault();
            var EmployeeList = _Context.Employees.ToList();
            var BrandList = _Context.AssetBrands.ToList();
            var TypeList = _Context.AssetTypes.ToList();
            var StatusList = _Context.AssetStatuses.ToList();
            var inputList = _Context.Inputs.Where(s=>s.AvilabiltyStatus == true).ToList();
            

            ViewData["TypeListData"] = TypeList;
            ViewData["InputListData"] = inputList;
            ViewData["StatusListData"] = StatusList;
            ViewData["BrandListData"] = BrandList;
            ViewData["EmployeeListData"] = EmployeeList;


            return View();
        }
        public IActionResult AssignedDetails()
        {
            var EmployeeAsset = _Context.EmployeAssets.ToList();
            var EmployeeList = _Context.Employees.ToList();
            var inputList = _Context.Inputs.ToList();
            var Statuslist = _Context.AssetStatuses.ToList();
            ViewData["EmployeeListData"] = EmployeeList;
            ViewData["statusListData"] = Statuslist;
            ViewData["EmployeeAssetListData"] = EmployeeAsset;
            ViewData["InputListData"] = inputList;
            return View();
        }
        public IActionResult AssetHistory()
        {
            var EmployeeAsset = _Context.EmployeAssets.ToList();
            var EmployeeList = _Context.Employees.ToList();
            var inputList = _Context.Inputs.ToList();
            //var AssetHistoryList = _Context.AssetHistories.ToList();
            ViewData["EmployeeListData"] = EmployeeList;
            ViewData["EmployeeAssetListData"] = EmployeeAsset;
            ViewData["InputListData"] = inputList;
            //ViewData["AssetHistoryListData"] = AssetHistoryList;
            return View();

        }
        [HttpGet]
        public JsonResult GetSearchedItems(string SerialNUmber)
        {
            var BrandName = _Context.Inputs.Join(_Context.AssetBrands, a => a.Brands, b => b.Code, (a, b) => new { a, b })
                .Select(A => new { A.a.SerialNUmber, A.b.BrandName, A.a.Description })
                .Where(s => s.SerialNUmber == SerialNUmber)
                .FirstOrDefault();

            //var findItem = _Context.Inputs.Where(s => s.SerialNUmber == SerialNUmber).FirstOrDefault();
            return Json(BrandName);
        }
        [HttpGet]
        public JsonResult GetSearchedAssigendItems(string SerialNUmber)
        {
            var AssignedItemDeatais = _Context.EmployeAssets.Join(_Context.Inputs, c => c.SerialNUmber, d => d.SerialNUmber, (c, d) => new { c, d }).Select(A => new { A.c.SerialNUmber, A.d.Description, A.d.Brands }).Where(s => s.SerialNUmber == SerialNUmber).FirstOrDefault();
            return Json(AssignedItemDeatais);
        }
        [HttpGet]
        public JsonResult GetSearchedIAssigendEMP(int EmployeeCode, string SerialNUmber)
        {
            //var AssignedEMPDeatais = _Context.EmployeAssets.Join(_Context.Employees, a => a.EmployeID, b => b.Code, (a, b) => new { a, b }).Select(A => new { A.a.EmployeID, A.b.EnglishName, A.b.EnglishPosition, A.b.Department, A.b.DirectManager }).Where(s => s.EmployeID == EmployeeCode).FirstOrDefault();
            var AssignedEMPDetails = _Context.Employees.Join(_Context.EmployeAssets, a => a.Code, b => b.EmployeID, (a, b) => new { a, b })
                .Join(_Context.Departments, c => c.a.Department, d => d.Code, (c, d) => new { c, d })
                .Select(A => new { A.c.b.EmployeID, A.c.a.EnglishName, A.c.a.EnglishPosition, A.d.Name, A.c.a.DirectManager, A.c.a.Code })
                .Where(s => s.Code == EmployeeCode).FirstOrDefault();
            //var EmpRelocateDetails = _Context.Employees.Select(A =new {A }).Where(s =>s.Code == SerialNUmber)

            var AssignedItemDatails = _Context.EmployeAssets
                .Join(_Context.Inputs, a => a.SerialNUmber, b => b.SerialNUmber, (a, b) => new { a, b })
                .Join(_Context.AssetBrands, c => c.b.Brands, d => d.Code, (c, d) => new { c, d })
                .Join(_Context.AssetStatuses, r => r.c.b.Status, t => t.Code, (r, t) => new { r, t })
                .Where(s => s.r.c.a.EmployeID == EmployeeCode)
                .Select(A => new { A.r.c.a.SerialNUmber, A.r.c.b.Description, A.r.c.b.Status, A.r.c.b.Brands, A.r.d.BrandName, A.t.StatusName, A.r.c.a.EmployeID }).ToList();

            var AssignedItemToEMP = _Context.EmployeAssets
                .Join(_Context.Inputs, a => a.SerialNUmber, b => b.SerialNUmber, (a, b) => new { a, b })
                .Join(_Context.Employees, c => c.a.EmployeID, d => d.Code, (c, d) => new { c, d })
                .Join(_Context.AssetBrands, e => e.c.b.Brands, f => f.Code, (e, f) => new { e, f })
                .Join(_Context.AssetTypes, j => j.e.c.b.Types, g => g.Code, (j, g) => new { j, g })
                .Join(_Context.Departments, h => h.j.e.d.Department, i => i.Code, (h, i) => new { h, i })
                .Join(_Context.AssetHistories, l => l.h.j.e.c.b.SerialNUmber, m => m.SerialNUmber, (l, m) => new { l, m })
                .Join(_Context.AssetStatuses, x => x.l.h.j.e.c.b.Status, z => z.Code, (x, z) => new { x, z })
                .Where(s => s.x.l.h.j.e.c.a.SerialNUmber == SerialNUmber)
                .Select(A => new { A.x.l.h.j.e.c.a.EmployeID, A.x.l.h.j.e.d.EnglishName, A.x.l.h.j.e.d.EnglishPosition, A.x.l.h.j.e.d.DirectManager, A.x.l.h.j.f.BrandName, A.x.l.h.j.e.c.b.Description, A.x.l.h.g.TypeName, A.x.l.i.Name, A.x.l.h.j.e.c.a.SerialNUmber, A.x.m.DateUpdate, A.x.m.AssigendEMP, A.x.m.AvilabiltyStatus, A.x.m.Status, A.z.StatusName }).FirstOrDefault();

            var AssetHistoryList = _Context.EmployeAssets
               .Join(_Context.Inputs, a => a.SerialNUmber, b => b.SerialNUmber, (a, b) => new { a, b })
               .Join(_Context.Employees, c => c.a.EmployeID, d => d.Code, (c, d) => new { c, d })
               .Join(_Context.AssetBrands, e => e.c.b.Brands, f => f.Code, (e, f) => new { e, f })
               .Join(_Context.AssetTypes, j => j.e.c.b.Types, g => g.Code, (j, g) => new { j, g })
               .Join(_Context.Departments, h => h.j.e.d.Department, i => i.Code, (h, i) => new { h, i })
               .Join(_Context.AssetHistories, l => l.h.j.e.c.b.SerialNUmber, m => m.SerialNUmber, (l, m) => new { l, m })
               //.Join(_Context.AssetHistories,x => x.l.h.j.e.c.b.)
               .Join(_Context.AssetStatuses, o => o.l.h.j.e.c.b.Status, p => p.Code, (o, p) => new { o, p })
               .Where(s => s.o.l.h.j.e.c.a.SerialNUmber == SerialNUmber)
               .Select(A => new { A.o.l.h.j.e.c.a.EmployeID, A.o.m.Changes, A.o.l.h.j.e.d.EnglishName, A.o.l.h.j.e.d.EnglishPosition, A.o.l.h.j.e.d.DirectManager, A.o.l.h.j.f.BrandName, A.o.l.h.j.e.c.b.Description, A.o.l.h.g.TypeName, A.o.l.i.Name, A.o.l.h.j.e.c.a.SerialNUmber, A.o.m.DateUpdate, A.o.m.AssigendEMP, A.o.m.AvilabiltyStatus, A.o.m.Status, A.p.StatusName }).ToList();
           
            var AssetHistorylistBetter = _Context.Inputs
                .Join(_Context.AssetBrands, e => e.Brands, f => f.Code, (e, f) => new { e, f })
                .Join(_Context.AssetStatuses, g => g.e.Status, h => h.Code, (g, h) => new { g, h })
                .Join(_Context.AssetTypes, r => r.g.e.Types, t => t.Code, (r, t) => new { r, t })
                .Join(_Context.AssetHistories, i => i.r.g.e.SerialNUmber, o => o.SerialNUmber, (i, o) => new { i, o })
                .Where(s => s.i.r.g.e.SerialNUmber == SerialNUmber)
                .Select(A => new { A.o.AssigendEMP, A.o.Status, A.o.SerialNUmber, A.o.Changes, A.o.AvilabiltyStatus, A.o.DateUpdate, A.i.t.TypeName, A.i.r.h.StatusName, A.i.r.h.Code, A.i.r.g.f.BrandName, A.i.r.g.e.Description }).ToList();
            var showStatusName = _Context.AssetHistories
                .Join(_Context.AssetStatuses, a => a.Status, w => w.Code, (a, w) => new { a, w })
                .Where(s => s.a.SerialNUmber == SerialNUmber)
                .Select(A => new { A.w.StatusName }).ToList(); 

            var showEMPName = _Context.AssetHistories
                .Join(_Context.Employees, a => a.AssigendEMP, w => w.Code, (a, w) => new { a, w })
                .Where(s => s.a.SerialNUmber == SerialNUmber)
                .Select(A => new { A.w.EnglishName, A.a.AssigendEMP }).ToList();
            
            var AssetHistorywihtoutEMP = _Context.Inputs
                .Join(_Context.AssetBrands, e => e.Brands, f => f.Code, (e, f) => new { e, f })
                .Join(_Context.AssetStatuses, g => g.e.Status, h => h.Code, (g, h) => new { g, h })
                .Join(_Context.AssetTypes, r => r.g.e.Types, t => t.Code, (r, t) => new { r, t })
                .Join(_Context.AssetHistories, i => i.r.g.e.SerialNUmber, o => o.SerialNUmber, (i, o) => new { i, o })
                .Where(s => s.i.r.g.e.SerialNUmber == SerialNUmber)
                .Select(A => new { A.o.AssigendEMP, A.o.Status, A.o.SerialNUmber, A.o.Changes, A.o.AvilabiltyStatus, A.o.DateUpdate, A.i.t.TypeName, A.i.r.h.StatusName, A.i.r.h.Code, A.i.r.g.f.BrandName, A.i.r.g.e.Description}).FirstOrDefault();

            var inputList = _Context.Inputs.Where(s => s.AvilabiltyStatus == true).FirstOrDefault();

            var RelocateEMPData = _Context.Employees
                .Join(_Context.Departments, a => a.Department, b => b.Code, (a, b) => new { a, b })
                .Select(A => new { A.a.EnglishName, A.a.Code, A.b.Name, A.a.DirectManager, A.a.EnglishPosition }).Where(s => s.Code == EmployeeCode).FirstOrDefault();

            var AllAssinged = new { AssignedEMPDetails, AssignedItemDatails, AssignedItemToEMP, AssetHistoryList, RelocateEMPData, AssetHistorylistBetter, AssetHistorywihtoutEMP, showStatusName, showEMPName, inputList };

            return Json(AllAssinged);
        }

    }   
}
