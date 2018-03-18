using DataAccessDB = eManage.CandidateCarlosSoares.DataAccess.DataAccess;

namespace eManage.CandidateCarlosSoares.Web.Controllers.Core
{
    public class ControllerCore : ControllerContext
    {
        /// <summary>
        /// This method creates an instance from DataAccess.
        /// </summary>
        /// <returns></returns>
        private DataAccessDB GetInstanceDataAccess()
        {
            return base.CreateInstanceDataAccess<DataAccessDB>();
        }
    }
}