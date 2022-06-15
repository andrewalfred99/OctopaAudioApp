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
        public IActionResult Adding()
        {
            var ItemList = _Context.Inputs.ToList();
            var BrandList = _Context.AssetBrands.ToList();
            var TypeList = _Context.AssetTypes.ToList();
            var StatusList = _Context.AssetStatuses.ToList();
            ViewData["TypeListData"] = TypeList;
            ViewData["StatusListData"] = StatusList;
            ViewData["BrandListData"] = BrandList;
            ViewData["ItemListData"] = ItemList;
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
    }
}
