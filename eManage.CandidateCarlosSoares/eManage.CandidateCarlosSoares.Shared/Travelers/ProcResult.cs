using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace eManage.CandidateCarlosSoares.Shared.Travelers
{
    public class ProcResult
    {
        public string ProcName { get; set; }
        public object[] Parameters { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }

        public object objResult { get; set; }
    }
}
