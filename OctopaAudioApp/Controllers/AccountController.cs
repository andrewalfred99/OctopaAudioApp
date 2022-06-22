using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Protocols;
using OctopaAudioApp.Models;
using OctopaAudioApp.Models.SetupModels;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace OctopaAudioApp.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        


        public AccountController(UserManager<ApplicationUser> userManager , SignInManager<ApplicationUser> signInManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]

        public async Task<IActionResult> Index(RegisterViewModel model)

        {

            if (ModelState.IsValid)

            {

                // Copy data from RegisterViewModel to IdentityUser

                var user = new ApplicationUser

                {

                    UserName = model.UserName,

                    Email = model.Email,
                    
                    CreateDate = DateTime.Now,

                    


                    //NormalizedUserName = model.UserName, 



                };



                // Store user data in AspNetUsers database table

                var result = await userManager.CreateAsync(user, model.Password);



                // If user is successfully created, sign-in the user using

                // SignInManager and redirect to index action of HomeController

                if (result.Succeeded)

                {

                    //await signInManager.SignInAsync(user, isPersistent: false);

                    return RedirectToAction("index", "home");

                }



                // If there are any errors, add them to the ModelState object

                // which will be displayed by the validation summary tag helper

                foreach (var error in result.Errors)

                {

                    ModelState.AddModelError(string.Empty, error.Description);

                }

            }

                    return View(model);

        }
        [HttpGet]

        public IActionResult Login()

        {

            return View();

        }


        
        [HttpPost]

        public async Task<IActionResult> Login(LoginViewModel model)

        {
            try
            {
                if (ModelState.IsValid)

                {

                    var result = await signInManager.PasswordSignInAsync(

                     model.UserName, model.Password, model.RememberMe, false);




                    if (result.Succeeded)

                    {
                        var UserDate = await userManager.FindByNameAsync(model.UserName);

                        var expire = (DateTime.Now - UserDate.CreateDate);
                        if (model.Password == "Audio@123" || expire > TimeSpan.FromSeconds(90))
                        {
                            return RedirectToAction("ChangePassword", "Account");

                        }
                        else
                        {
                            return RedirectToAction("index", "home");
                            //RedirectToAction("ChangePassword", "Account");
                        }
                    }





                }
            }
            catch (Exception)
            {

                throw;
            }
           



            return View(model);

        }
        public async Task<IActionResult> Logout()

        {

            await signInManager.SignOutAsync();

            return RedirectToAction("Login", "Account");

        }

        [HttpGet]
        public IActionResult ChangePassword()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if (ModelState.IsValid)
            {


                var user = await userManager.GetUserAsync(User);
                if (user == null)
                {
                    return RedirectToAction("Login");
                }

                // ChangePasswordAsync changes the user password
                var result = await userManager.ChangePasswordAsync(user,
                    model.CurrentPassword, model.NewPassword);

                // The new password did not meet the complexity rules or
                // the current password is incorrect. Add these errors to
                // the ModelState and rerender ChangePassword view
                if (!result.Succeeded)
                {

                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }


                    return View();
                }

                // Upon successfully changing the password refresh sign-in cookie
                user.CreateDate = DateTime.Now;
                await userManager.UpdateAsync(user);
                await signInManager.RefreshSignInAsync(user);
                return View();
            }

            return View(model);
        }

    }
}
