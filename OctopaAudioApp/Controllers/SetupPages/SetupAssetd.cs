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
    }
}
