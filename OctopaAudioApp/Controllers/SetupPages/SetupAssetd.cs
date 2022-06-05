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
                return Json("Brand Created DOne");
            }
            catch (Exception ex)
            {

                throw;
            }
        }
    }
}
