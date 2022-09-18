
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OctopaAudioApp.Models;
using OctopaAudioApp.Models.AudioDataContext;
using OctopaAudioApp.Models.SetupModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Controllers.SetupPages
{
    public class SetupTickets : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly AudioDbContext _Context;
        public SetupTickets(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, AudioDbContext context)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            _Context = context;
        }
        [HttpGet]
        public IActionResult ListUsers()
        {
            var users = userManager.Users;
            return View(users);
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult DEPFilter()
        {

            List<IdentityUser> members = new List<IdentityUser>();
            foreach (IdentityUser user in userManager.Users)
            {
                members.Add(user);
            }

            var DEPList = _Context.AllowDEPToTickets.ToList();
            var DEParmentList = _Context.Departments.ToList();
            var UsersList = userManager.Users.ToList();
            ViewData["DepList"] = DEPList;
            ViewData["DepartmentsList"] = DEParmentList;
            ViewData["UserList"] = UsersList;
            ViewData["UsersList"] = members;
            return View();
        }

        public JsonResult SaveDEPFilter(int Department, string Manager)
        {
            try
            {
                AllowDEPToTicket newDEP = new AllowDEPToTicket();
                newDEP.Code = _Context.AllowDEPToTickets.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
                newDEP.Department = Department;
                newDEP.UserManage = Manager;
                newDEP.AllowTickting = true;
                newDEP.AddedUser = User.Identity.Name;
                newDEP.DateUpdate = DateTime.Now;
                _Context.AllowDEPToTickets.Add(newDEP);
                _Context.SaveChanges();
                return Json("Done");
            }
            catch(Exception ex)
            {
                throw;
            }
          
        }
        [HttpGet]
        public JsonResult getManagerAndDepartmentName()
        {
            var DEPFilter = _Context.AllowDEPToTickets.Join(_Context.Departments, a => a.Department, b => b.Code, (a, b) => new { a, b })
                .Join(userManager.Users, c => c.a.UserManage, d => d.Id, (c, d) => new { c, d })
                .Select(A => new { A.d.UserName, A.c.b.Name, A.c.a.Code, A.c.a.AllowTickting }).ToList();
            return Json(DEPFilter);
        }
        public IActionResult CommenIssues()
        {
            var DepFilter = _Context.AllowDEPToTickets.ToList();
            var CommenIssues = _Context.CommenIssues.ToList();
            ViewData["DepFilters"] = DepFilter;
            ViewData["CommenIssueses"] = CommenIssues;

            return View();
        }

        public JsonResult SaveCommenIssue(int Department, string CommenIssue)
        {
            try
            {
                CommenIssues NewIssue = new CommenIssues();
                NewIssue.Code = _Context.CommenIssues.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
                NewIssue.Department = Department;
                NewIssue.Issue = CommenIssue;
                NewIssue.AddUser = User.Identity.Name;
                NewIssue.DateUpdate = DateTime.Now;
                _Context.CommenIssues.Add(NewIssue);
                _Context.SaveChanges();
                return Json("Done");
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public IActionResult CreateTicket()
        {
            var DepFilter = _Context.AllowDEPToTickets.ToList();
            var CommenIssues = _Context.CommenIssues.ToList();
            ViewData["DepFilters"] = DepFilter;
            ViewData["CommenIssueses"] = CommenIssues;

            return View();
        }
    }

}
