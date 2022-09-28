
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
            catch (Exception ex)
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

        public IActionResult Tickets()
        {
            var DEPFilter = _Context.AllowDEPToTickets.ToList();
            var CommenIssue = _Context.CommenIssues.ToList();
            var tickets = _Context.Tickets.ToList();

            ViewData["DepFilters"] = DEPFilter;
            ViewData["CommenIssue"] = CommenIssue;
            ViewData["TicketsList"] = tickets;

            return View();
        }
        
        public JsonResult SaveTickets(int DEP, int Issue, string Description, string Manager)
        {
            try
            {
                Tickets NEWT = new Tickets();
                NEWT.Code = _Context.Tickets.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
                NEWT.Department = DEP;
                NEWT.ComminIssue = Issue;
                NEWT.Discription = Description;
                NEWT.Manager = Manager;
                NEWT.status = 1;
                NEWT.AddedUser = User.Identity.Name;
                NEWT.DateUpdate = DateTime.Now;
                _Context.Tickets.Add(NEWT);
                _Context.SaveChanges();
                return Json("Done");
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        public IActionResult TicketsAdmin()
        {
            var DEPFilter = _Context.AllowDEPToTickets.ToList();
            var CommenIssue = _Context.CommenIssues.ToList();
            var tickets = _Context.Tickets.ToList();

            ViewData["DepFilters"] = DEPFilter;
            ViewData["CommenIssue"] = CommenIssue;
            ViewData["TicketsList"] = tickets;

            return View();
        }

        public JsonResult GETCommenIssueFromDepartments(int Department)
        {
            var commenIssue = _Context.AllowDEPToTickets.Join(_Context.CommenIssues, a => a.Code, b => b.Department, (a, b) => new { a, b })
                .Select(A => new { A.b.Issue, A.a.Code })
                .Where(s => s.Code == Department).ToList();

            return Json(commenIssue);
        }
        public JsonResult getDEPINFO(int Code)
        {
            var SlectedDEP = _Context.AllowDEPToTickets.Where(x => x.Code == Code).FirstOrDefault();

            return Json(SlectedDEP);
        }
        public JsonResult EditDEPFilter(int Department, string Manager, bool visibilty, int Code)
        {
            try
            {
                //AllowDEPToTicket NEWDEPFilter = new AllowDEPToTicket();
                var find = _Context.AllowDEPToTickets.Where(a => a.Code == Code).FirstOrDefault();
                find.Department = Department;
                find.UserManage = Manager;
                find.AllowTickting = visibilty;
                //if (visibilty == 1)
                //{
                //    find.AllowTickting = true;
                //}
                //else
                //{
                //    find.AllowTickting = false;
                //}
                _Context.AllowDEPToTickets.Update(find);
                _Context.SaveChanges();
                return Json("Done");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GETNAMEs(int DEPFilter)
        {
            var ManagerName = _Context.AllowDEPToTickets.Join(_Context.Departments, a => a.Department, b => b.Code, (a, b) => new { a, b })
                .Select(A => new { A.b.Name, A.a.UserManage, A.a.Code })
                .Where(S => S.Code == DEPFilter).FirstOrDefault();

            return Json(ManagerName);
        }
        public JsonResult GetTickets(int DEP, int Status, int Issue)
        {

            var DepName = _Context.Tickets.Join(_Context.AllowDEPToTickets, a => a.Department, b => b.Code, (a, b) => new { a, b })
                 .Join(_Context.Departments, c => c.b.Department, d => d.Code, (c, d) => new { c, d })
                 .Select(A => new { A.d.Name, A.c.a.Code, A.c.a.AddedUser, A.c.a.AssignTOEMP, A.c.a.DateUpdate, A.c.a.Discription, A.c.a.Notes })
                 .Where(S => S.Code == DEP).ToList();

            var StatusName = _Context.Tickets.Join(_Context.TicketsStatuses, a => a.status, b => b.Code, (a, b) => new { a, b })
                .Select(A => new { A.b.StatusName, A.a.Code })
                .Where(S => S.Code == Status).ToList();

            var CommenIssue = _Context.Tickets.Join(_Context.CommenIssues, a => a.ComminIssue, b => b.Code, (a, b) => new { a, b })
                .Select(A => new { A.a.ComminIssue, A.b.Issue })
                .Where(S => S.ComminIssue == Issue).ToList();

            var AllNames = new { DepName, StatusName, CommenIssue };

            return Json(AllNames);
        }

        public JsonResult EditStatusByCode(int Code, string NewStatus)
        {
            try
            {
                var find = _Context.TicketsStatuses.Find(Code);
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
                var find = _Context.TicketsStatuses.Find(Code);
                string Name = find.StatusName;

                return Json(Name);
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public IActionResult CreateNewTicketStatus()
        {
            var StatusList = _Context.TicketsStatuses.ToList();
            ViewData["StatusListData"] = StatusList;
            return View();
        }
        public JsonResult SaveNewStatus(string StatusName)
        {
            try
            {
                TicketsStatus NewS = new TicketsStatus();
                NewS.StatusName = StatusName;
                NewS.Code = _Context.TicketsStatuses.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
                NewS.DateUpdate = DateTime.Now;
                NewS.AddedUser = User.Identity.Name;
                _Context.TicketsStatuses.Add(NewS);
                _Context.SaveChanges();
                return Json("Status Created Done");
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        [HttpPost]
        public ActionResult EditStatus(AssetStatus std)
        {
            var StatusList = _Context.TicketsStatuses.ToList();
            var Status = StatusList.Where(s => s.Code == std.Code).FirstOrDefault();

            return RedirectToAction("CreateNewStatus");
        }

    }


}
