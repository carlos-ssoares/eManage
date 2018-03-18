using System.Web;
using System.Web.Mvc;

namespace eManage.CandidateCarlosSoares.Web
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}