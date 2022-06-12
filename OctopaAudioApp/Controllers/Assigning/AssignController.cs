using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctopaAudioApp.Models.Assigning;
using OctopaAudioApp.Models.AudioDataContext;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Controllers.Assigning
{
    public class AssignController : Controller
    {
        private readonly AudioDbContext _Context;
        public AssignController(AudioDbContext context)
        {
            _Context = context;
        }
        public IActionResult Index()
        {
            var ImportList = _Context.Assigns.ToList();
            var StatusList = _Context.AssetStatuses.ToList();
            ViewData["ImportListData"] = ImportList;
            ViewData["StatusListData"] = StatusList;
            return View();
        }

        public IActionResult Adding()
        {
            var BrandList = _Context.AssetBrands.ToList();
            var TypeList = _Context.AssetTypes.ToList();
            var StatusList = _Context.AssetStatuses.ToList();
            ViewData["TypeListData"] = TypeList;
            ViewData["StatusListData"] = StatusList;
            ViewData["BrandListData"] = BrandList;
            return View();
        }
        public JsonResult UploadPhoneSheet(IFormFile file)
        {
            var List = new List<AssignModel>();
            using (var stream = new MemoryStream())
            {
                 file.CopyToAsync(stream);
                using(var package = new ExcelPackage())
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                    var rowcount = worksheet.Dimension.Rows;
                    for(int row = 2; row <= rowcount; row++ )
                    {
                        List.Add(new AssignModel
                        {
                            SerialNo = worksheet.Cells[row, 1].Value.ToString().Trim(),
                            Quantity =int.Parse(worksheet.Cells[row, 2].Value.ToString().Trim()),
                            AssingedUser = worksheet.Cells[row, 3].Value.ToString().Trim(),
                        }); ;
                    }
                }
            }
            return Json(List);
        }

    }
}
