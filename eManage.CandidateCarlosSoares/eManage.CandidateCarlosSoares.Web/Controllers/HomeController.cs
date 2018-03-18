using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using eManage.CandidateCarlosSoares.Shared.DB.Models;
using eManage.CandidateCarlosSoares.Web.Controllers.Core;
using DataAccessDB = eManage.CandidateCarlosSoares.DataAccess.DataAccess;
using System.Globalization;
using eManage.CandidateCarlosSoares.Shared.Resources;

namespace eManage.CandidateCarlosSoares.Web.Controllers
{
    public class HomeController : ControllerCore
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            return View();
        }

        /// <summary>
        /// Methode responsible for change the language.
        /// </summary>
        /// <param name="lang"></param>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        public ActionResult ChangeCulture(string lang, string returnUrl)
        {
            Session["Culture"] = new CultureInfo(lang);
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        [HttpGet]        
        public JsonResult GetUserById(int userId)
        {
            List<User> lstUsers = new List<User>();
            lstUsers = base.CreateInstanceDataAccess<DataAccessDB>().Select<User>(x => x.UserId == userId);
            
            //Bellow a code that can take all users in the base when its Id is 0 (just replace the code above).
            //lstUsers = base.CreateInstanceDataAccess<DataAccessDB>().Select<User>(x => userId == 0 ? true : (x.UserId == userId));

            return Json(lstUsers, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAllUser()
        {
            List<User> lstUsers = new List<User>();
            lstUsers = base.CreateInstanceDataAccess<DataAccessDB>().Select<User>(x => true);

            return Json(lstUsers, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateUser(User InputUser)
        {
            var result = base.CreateInstanceDataAccess<DataAccessDB>().Update<User>(InputUser, InputUser.UserId);
            if (result.Success)
                result.Message = Messages.UserChanged;

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertUser(User InputUser)
        {
            var result = base.CreateInstanceDataAccess<DataAccessDB>().Insert<User>(InputUser);
            if (result.Success)
                result.Message = Messages.UserInserted;

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public JsonResult DelUser(User InputUser)
        {
            var result = base.CreateInstanceDataAccess<DataAccessDB>().Delete<User>(InputUser);
            if (result.Success)
                result.Message = Messages.UserDeleted;

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
