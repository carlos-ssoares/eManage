using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace eManage.CandidateCarlosSoares.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            CultureInfo ci = new CultureInfo("en-us");

            if (HttpContext.Current.Session != null)
            {
                ci = (CultureInfo)this.Session["Culture"];
                if (ci == null)
                {
                    string langName = "en-US";
                    //if (HttpContext.Current.Request.UserLanguages != null && HttpContext.Current.Request.UserLanguages.Length != 0)
                    //{
                    //    langName = HttpContext.Current.Request.UserLanguages[0];
                    //}
                    ci = new CultureInfo(langName);
                    this.Session["Culture"] = ci;
                }

                HttpContextBase currentContext = new HttpContextWrapper(HttpContext.Current);
                RouteData routeData = RouteTable.Routes.GetRouteData(currentContext);
                routeData.Values["culture"] = ci;

                Thread.CurrentThread.CurrentUICulture = ci;
                Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(ci.Name);
            }


            //CultureInfo ci = new CultureInfo("pt-BR");
            //if (ci == null)
            //{
            //    HttpContextBase currentContext = new HttpContextWrapper(HttpContext.Current);
            //    RouteData routeData = RouteTable.Routes.GetRouteData(currentContext);
            //    routeData.Values["culture"] = ci;

            //    Thread.CurrentThread.CurrentUICulture = ci;
            //    Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(ci.Name);
            //}

        }
    }
}