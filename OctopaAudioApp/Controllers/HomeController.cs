using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OctopaAudioApp.Models;
using OctopaAudioApp.Models.AudioDataContext;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly AudioDbContext _Context;
        private readonly ILogger<HomeController> _logger;
        public HomeController(ILogger<HomeController> logger, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, AudioDbContext context)
        {

            this.userManager = userManager;
            this.signInManager = signInManager;
            _Context = context;
            _logger = logger;
        }
        public IActionResult Index()
        {
            var DepFilter = _Context.AllowDEPToTickets.ToList();
            var CommenIssues = _Context.CommenIssues.ToList();
            ViewData["DepFilters"] = DepFilter;
            ViewData["CommenIssueses"] = CommenIssues;
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
