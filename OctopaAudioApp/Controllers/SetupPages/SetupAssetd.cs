using Microsoft.AspNetCore.Mvc;
using OctopaAudioApp.Models.AudioDataContext;
using OctopaAudioApp.Models.SetupModels;
using System;
using System.Collections.Generic;
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
