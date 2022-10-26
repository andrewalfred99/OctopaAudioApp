
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
            var Manager = _Context.Employees.ToList();
            var DEParmentList = _Context.Departments.ToList();
            var UsersList = userManager.Users.ToList();
            ViewData["DepList"] = DEPList;
            ViewData["ManagerList"] = Manager;
            ViewData["DepartmentsList"] = DEParmentList;
            ViewData["UserList"] = UsersList;
            ViewData["UsersList"] = members;
            return View();
        }

        public JsonResult SaveDEPFilter(int Department, int Manager)
        {
            try
            {
                AllowDEPToTicket newDEP = new AllowDEPToTicket();
                CommenIssues newCommen = new CommenIssues();
                newDEP.Code = _Context.AllowDEPToTickets.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
                newDEP.Department = Department;
                newDEP.UserManage = Manager;
                newDEP.AllowTickting = true;
                newDEP.AddedUser = User.Identity.Name;
                newDEP.DateUpdate = DateTime.Now;
                newCommen.Code = _Context.CommenIssues.Select(c => c.Code).DefaultIfEmpty().Max() + 1;
                newCommen.Department = newDEP.Code;
                newCommen.Issue = "Others";
                newCommen.AddUser = User.Identity.Name;
                newCommen.DateUpdate = DateTime.Now;
                _Context.AllowDEPToTickets.Add(newDEP);
                _Context.CommenIssues.Add(newCommen);
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
                .Join(_Context.Employees,c=>c.a.UserManage, d=>d.Code, (c,d) => new {c,d})
                //.Join(userManager.Users, c => c.a.UserManage, d => d.Id, (c, d) => new { c, d })
                .Select(A => new { A.d.EnglishName, A.c.b.Name, A.c.a.Code, A.c.a.AllowTickting }).ToList();
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
        public JsonResult DEPFilterVisibiltyChange(int Code)
        {
            try
            {
                var find = _Context.AllowDEPToTickets.Where(A => A.Code == Code).FirstOrDefault();
                if(find.AllowTickting == true)
                {
                    find.AllowTickting = false;
                    _Context.SaveChanges();
                }
                else
                {
                    find.AllowTickting = true;
                    _Context.SaveChanges();
                }
                return Json("Done");
            }
            catch(Exception ex)
            {
                throw;
            }
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
        public JsonResult GetComminIssueInfo(int Code)
        {
            var find = _Context.CommenIssues.Join(_Context.AllowDEPToTickets, a => a.Department, b => b.Code, (a, b) => new { a, b })
                .Join(_Context.Departments, c => c.b.Department, d => d.Code, (c, d) => new { c, d })
                .Select(A => new { A.c.a.Code, A.d.Name, A.c.a.Department, A.c.a.Issue })
                .Where(S => S.Code == Code).FirstOrDefault();

            return Json(find);
                
        }

        public JsonResult EditCommenIssue(int Code, string Issue)
        {
            try
            {
                var find = _Context.CommenIssues.Where(a => a.Code == Code).FirstOrDefault();
                find.Issue = Issue;
                _Context.SaveChanges();
                return Json("Done");
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public JsonResult getDEPINFO(int Code)
        {
            var SlectedDEP = _Context.AllowDEPToTickets.Where(x => x.Code == Code).FirstOrDefault();

            return Json(SlectedDEP);
        }
        public JsonResult EditDEPFilter(int Department, int Manager, bool visibilty, int Code)
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
                .Join(_Context.Employees,c=>c.a.UserManage, d=>d.Code,(c,d)=> new {c,d})
                .Select(A => new { A.c.b.Name, A.d.EnglishName,A.c.a.UserManage, A.c.a.Code })
                .Where(S => S.Code == DEPFilter).FirstOrDefault();

            var Issue = _Context.CommenIssues.Join(_Context.AllowDEPToTickets, a=>a.Department, b=>b.Code,(a,b)=> new {a,b})
                .Where(S => S.b.Code == DEPFilter)
                .Select(A => new { A.a.Code, A.a.Issue, A.b.Department, })
                 .ToList();
            
            var ALL = new { ManagerName, Issue };
            return Json(ALL);
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
       

        public JsonResult GETALLTICKETITEM()
        {
            try
            {
                var Data = _Context.Tickets.Join(_Context.AllowDEPToTickets, a => a.Department, b => b.Code, (a, b) => new { a, b })
                    .Join(_Context.Departments, c => c.b.Department, d => d.Code, (c, d) => new { c, d })
                    .Join(_Context.TicketsStatuses, e => e.c.a.status, f => f.Code, (e, f) => new { e, f })
                    .Join(_Context.CommenIssues, g => g.e.c.a.ComminIssue, h => h.Code, (g, h) => new { g, h })
                    .Join(_Context.Employees, i=>i.g.e.c.b.UserManage, j=> j.Code, (i,j)=>new {i,j})
                    .Select(A => new { A.i.g.e.c.a.Code, A.i.g.e.d.Name, A.i.h.Issue, A.i.g.f.StatusName, A.i.g.e.c.a.DateUpdate, A.i.g.e.c.a.Manager, A.i.g.e.c.a.Notes, A.i.g.e.c.a.Discription, A.i.g.e.c.a.AddedUser, A.i.g.e.c.a.AssignTOEMP, A.j.EnglishName }).ToList();
                return Json(Data);
                    
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        public JsonResult GETTISSUEDATA()
        {
            try
            {
                var Issue = _Context.CommenIssues.Join(_Context.AllowDEPToTickets, a => a.Department, b => b.Code, (a, b) => new { a, b })
                    .Join(_Context.Departments, c=>c.b.Department, d=>d.Code,(c,d)=> new {c,d})
                    .Select(A => new { A.d.Name, A.c.b.Department, A.c.a.Code, A.c.a.Issue }).ToList();
                return Json(Issue);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        
        public JsonResult GETDALLOWDEPTOTICKET()
        {
            try
            {
                var DEP = _Context.AllowDEPToTickets.Join(_Context.Departments, a => a.Department, b => b.Code, (a, b) => new { a, b })
                    .Join(_Context.Employees,c=>c.a.UserManage, d=>d.Code, (c,d) => new {c,d})
                    .Select(A => new { A.c.a.Code, A.c.b.Name, A.d.EnglishName, A.c.a.AllowTickting }).ToList();
                return Json(DEP);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult GETDEPSELECT()
        {
            try
            {
                var Data = _Context.AllowDEPToTickets.Join(_Context.Departments, a => a.Department, b => b.Code, (a, b) => new { a, b })
                            .Select(A => new { A.a.Code, A.b.Name, A.a.Department, A.a.AllowTickting }).Where(S =>S.AllowTickting == true ).ToList();

                return Json(Data);
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        public JsonResult GETTICKETDETAILS(int Code)
        {
            try
            {
                var Ticket = _Context.Tickets.Join(_Context.AllowDEPToTickets, a => a.Department, b => b.Code, (a, b) => new { a, b })
                            .Join(_Context.Departments, c => c.b.Department, d => d.Code, (c, d) => new { c, d })
                            .Join(_Context.CommenIssues, e => e.c.a.ComminIssue, f => f.Code, (e, f) => new { e, f })
                            .Join(_Context.TicketsStatuses, j => j.e.c.a.status, h => h.Code, (j, h) => new { j, h })
                            .Join(_Context.Employees,i=>i.j.e.c.b.UserManage, g=>g.Code, (i,g)=> new {i,g})
                            .Select(A => new {A.i.j.e.d.Name, A.i.j.f.Issue, A.i.h.StatusName, A.i.j.e.c.a.Code, A.g.EnglishName })
                            .Where(A => A.Code == Code).FirstOrDefault();
                var TicketAssigendEMP = _Context.Tickets.Join(_Context.Employees, a => a.AssignTOEMP, b => b.Code, (a, b) => new { a, b })
                            .Select(A => new { A.a.Code, A.a.AssignTOEMP, A.b.EnglishName })
                            .Where(S => S.Code == Code).FirstOrDefault();

                var AllTicketNames = new { Ticket, TicketAssigendEMP};
                return Json(AllTicketNames);
               
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GETIssueSELECT( int Department)
        {
            try
            {
                var Data = _Context.CommenIssues.Select(A => new { A.Code, A.Issue, A.Department })
                    .Where(S =>S.Department == Department).ToList();

                return Json(Data);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult GETEmployeeOfDEP(int Code)
        {
            try
            {
                var EMP = _Context.Tickets.Join(_Context.AllowDEPToTickets, a => a.Department, b => b.Code, (a, b) => new { a, b })
                    .Join(_Context.Departments, c => c.b.Department, d => d.Code, (c, d) => new { c, d })
                    .Join(_Context.Employees, e => e.d.Code, f => f.Department, (e, f) => new { e, f })
                    .Where(S => S.e.c.a.Code == Code)
                    .Select(A => new { A.f.EnglishName, A.f.Code }).ToList();
                    
                return Json(EMP);
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        public JsonResult SaveTicketEMPAssigin(int EMP, int TicketCode)
        {
            try
            {
                var find = _Context.Tickets.Find(TicketCode);
                find.AssignTOEMP = EMP;
                find.status = 2;
                _Context.SaveChanges();
                return Json("Done");
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public JsonResult CancelTicket( int TicketCode)
        {
            try
            {
                var find = _Context.Tickets.Find(TicketCode);
                find.status = 4;
                _Context.SaveChanges();
                return Json("Done");
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult FinishTicket(int TicketCode)
        {
            try
            {
                var find = _Context.Tickets.Find(TicketCode);
                find.status = 5;
                _Context.SaveChanges();
                return Json("Done");
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public JsonResult AddingNote(int TicketCode, string Note)
        {
            try
            {
                var find = _Context.Tickets.Find(TicketCode);
                find.Notes = Note;
                _Context.SaveChanges();
                return Json("Done");
            }
            catch (Exception ex)
            {
                throw;
            }
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
        public JsonResult EMPForSelectedDEP(int Code)
        {
            try
            {
                var find = _Context.Employees.Where(S => S.Department == Code).ToList();
                return Json(find);
            }
            catch(Exception ex)
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

        public IActionResult DetalisTicket(int Code)
        {
            try
            {
                var StatusList = _Context.TicketsStatuses.ToList();
                var Ticket = _Context.Tickets.Where(S => S.Code == Code).FirstOrDefault();
                var CommenIssue = _Context.CommenIssues.ToList();
                ViewData["StatusListData"] = StatusList;
                ViewData["Ticket"] = Ticket;
                ViewData["CommenIssueList"] = CommenIssue;

                return View();
            }
            catch(Exception ex) {
                throw;
            }
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
