using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace eManage.CandidateCarlosSoares.DataAccess.Core
{
    public class DataAccessCore : IDisposable
    {
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}
