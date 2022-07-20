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
        public SetupAssetd (AudioDbContext context)
        {
            _Context = context;
        }
        public JsonResult GetAllDataitem()
        {
            var Data = _Context.Inputs.Join(_Context.AssetBrands, a => a.Brands, b => b.Code, (a, b) => new { a, b })
            .Join(_Context.AssetTypes, c => c.a.Types, d => d.Code, (c, d) => new { c, d }).Join(_Context.AssetStatuses, e => e.c.a.Status, f => f.Code, (e, f) => new { e, f })
            .Select(A => new { A.e.c.a.SerialNUmber, A.e.c.b.BrandName, A.e.d.TypeName, A.f.StatusName, A.e.c.a.Notes, A.e.c.a.Description, A.e.c.a.Cpu, A.e.c.a.GPU, A.e.c.a.Ram, A.e.c.a.Storage }).ToList();

           
            return Json(Data);
        }
        [HttpGet]
        public JsonResult GetEmpData(int EMPCode)
        {
            var find = _Context.Employees.Join(_Context.Departments, a=> a.Department, b => b.Code, (a,b) => new {a, b}).Select(A => new {A.a.EnglishName, A.a.EnglishPosition, A.a.DirectManager, A.b.Name, A.a.Code}).Where(s => s.Code == EMPCode).FirstOrDefault();
            return Json(find);
        }

        public JsonResult SaveEMPAndItemData(int Code, [FromBody] ALLDataView aLLDataView)
        {
            try
            {
                foreach (var item in aLLDataView.ItemArray)
                {
                    EmployeAsset NewE = new EmployeAsset();
                    NewE.EmployeID = Code;
                    NewE.SerialNUmber = item.SerialNUmber;
                    NewE.AddedUser = User.Identity.Name;
                    NewE.DateUpdate = DateTime.Now;
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
            ////ViewData["StatusListData"] = StatusList;
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
                _Context.Inputs.Add(NewI);
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
            var inputList = _Context.Inputs.ToList();
            

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
            ViewData["EmployeeListData"] = EmployeeList;
            ViewData["EmployeeAssetListData"] = EmployeeAsset;
            ViewData["InputListData"] = inputList;
            return View();
        }
        [HttpGet]
        public JsonResult GetSearchedItems(string SerialNUmber)
        {
            var BrandName = _Context.Inputs.Join(_Context.AssetBrands, a => a.Brands, b => b.Code, (a, b) => new { a, b }).Select(A => new { A.a.SerialNUmber, A.b.BrandName, A.a.Description }).Where(s => s.SerialNUmber == SerialNUmber).FirstOrDefault();

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
                .Join(_Context.Departments, c => c.a.Department, d => d.Code, (c,d) => new {c,d})
                .Select(A => new { A.c.b.EmployeID, A.c.a.EnglishName, A.c.a.EnglishPosition, A.d.Name, A.c.a.DirectManager, A.c.a.Code })
                .Where(s => s.Code == EmployeeCode).FirstOrDefault();

            var AssignedItemDatails = _Context.EmployeAssets
                .Join(_Context.Inputs, a => a.SerialNUmber, b => b.SerialNUmber, (a, b) => new { a, b })
                .Join(_Context.AssetBrands, c => c.b.Brands, d => d.Code, (c, d) => new { c, d })
                .Where(s => s.c.a.EmployeID == EmployeeCode)
                .Select(A => new { A.c.a.SerialNUmber, A.c.b.Description, A.c.b.Brands, A.d.BrandName }).ToList();

            var AssignedItemToEMP = _Context.EmployeAssets
                .Join(_Context.Inputs, a => a.SerialNUmber, b => b.SerialNUmber, (a, b) => new { a, b })
                .Join(_Context.Employees, c => c.a.EmployeID, d => d.Code, (c, d) => new { c, d })
                .Join(_Context.AssetBrands, e => e.c.b.Brands, f => f.Code, (e, f) => new { e, f })
                .Join(_Context.AssetTypes, j => j.e.c.b.Types, g => g.Code, (j, g) => new {j,g})
                .Join(_Context.Departments, h => h.j.e.d.Department, i => i.Code, (h, i) => new {h,i} )
                .Where(s => s.h.j.e.c.a.SerialNUmber == SerialNUmber)
                .Select(A => new { A.h.j.e.c.a.EmployeID, A.h.j.e.d.EnglishName, A.h.j.e.d.EnglishPosition, A.h.j.e.d.DirectManager, A.h.j.f.BrandName, A.h.j.e.c.b.Description, A.h.g.TypeName, A.i.Name,A.h.j.e.c.a.SerialNUmber }).FirstOrDefault();
            
            var AllAssinged = new { AssignedEMPDetails, AssignedItemDatails, AssignedItemToEMP };
            return Json(AllAssinged);
        }

    }   
}
