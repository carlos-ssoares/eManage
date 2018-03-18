using System;
using System.Web.Mvc;
using eManage.CandidateCarlosSoares.DataAccess.Core;

namespace eManage.CandidateCarlosSoares.Web.Controllers.Core
{
    public abstract class ControllerContext : Controller
    {
        /// <summary>
        /// Factory of a instance from DataAccess.
        /// </summary>
        /// <typeparam name="TDataAccess"></typeparam>
        /// <returns></returns>
        protected TDataAccess CreateInstanceDataAccess<TDataAccess>()
            where TDataAccess : DataAccessCore
        {
            return Activator.CreateInstance<TDataAccess>();
        }
    }
}