using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using eManage.CandidateCarlosSoares.Shared.Travelers;
using eManage.CandidateCarlosSoares.DataAccess.Core;
using eManage.CandidateCarlosSoares.Shared.DB.Core;
using eManage.CandidateCarlosSoares.Shared.Resources;

namespace eManage.CandidateCarlosSoares.DataAccess
{
    public partial class DataAccess : DataAccessCore
    {
        /*
         Using Entityframework developed on Code First, which was desined its methods dinamicly to support any table.
        */

        /// <summary>
        /// Method responsible for executing a store procedure from database
        /// </summary>
        /// <param name="proc"></param>
        /// <returns></returns>
        public ProcResult ExecProc(ProcResult proc)
        {
            proc.Success = true;
            proc.Message = Messages.ExecuteSuccess.ToString();

            try
            {
                using (var context = new eManageContext())
                {
                    if (proc.Parameters == null || proc.Parameters.Count() == 0)
                        context.Database.ExecuteSqlCommand(proc.ProcName);
                    else
                        context.Database.ExecuteSqlCommand(proc.ProcName, proc.Parameters);
                }
            }
            catch (Exception ex)
            {
                proc.Success = false;
                proc.Message = ex.Message.ToString();
            }

            return proc;
        }

        /// <summary>
        /// Method responsible for executing a store procedure from database
        /// </summary>
        /// <typeparam name="T">Type of return</typeparam>
        /// <param name="entity"></param>
        /// <returns></returns>
        public List<T> ExecQuery<T>(ProcResult proc)
        {
            try
            {
                using (var context = new eManageContext())
                {
                    if (proc.Parameters == null || proc.Parameters.Count() == 0)
                    {
                        return context.Database.SqlQuery<T>(proc.ProcName).ToList<T>();
                    }
                    else
                    {
                        return context.Database.SqlQuery<T>(proc.ProcName, proc.Parameters).ToList<T>();
                    }
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Method responsible for select a lsit of member in database
        /// </summary>
        /// <typeparam name="T">Entity type</typeparam>
        /// <param name="entity"></param>
        /// <returns></returns>
        public List<T> Select<T>(Func<T, bool> where) where T : class
        {
            try
            {
                using (var context = new eManageContext())
                {
                    List<T> list;

                    IQueryable<T> dbQuery = context.Set<T>();

                    list = dbQuery
                        .AsNoTracking()
                        .Where(where)
                        .ToList<T>();

                    return list;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Method responsible for changing a member in database
        /// </summary>
        /// <typeparam name="T">Entity type</typeparam>
        /// <param name="entity"></param>
        /// <returns></returns>
        public ProcResult Update<T>(T entity, int id = 0, params Expression<Func<T, object>>[] updatedProperties) where T : class
        {
            ProcResult proc = new ProcResult();
            proc.Success = true;
            proc.Message = Messages.ExecuteSuccess.ToString();

            using (var context = new eManageContext())
            {
                if (id == 0 || updatedProperties == null || !updatedProperties.Any())
                {
                    try
                    {
                        context.Entry(entity).State = EntityState.Modified;
                        context.SaveChanges();

                        proc.objResult = entity;
                    }
                    catch (Exception ex)
                    {
                        proc.Success = false;
                        proc.Message = ex.Message.ToString();
                    }
                }
                else
                {
                    var newObj = context.Set(entity.GetType()).Find(id);

                    var entry = context.Entry(newObj);


                    foreach (var property in entry.CurrentValues.PropertyNames)
                    {
                        context.Entry<T>((T)newObj).Property(property).IsModified = false;
                    }

                    foreach (var property in updatedProperties)
                    {
                        context.Entry<T>((T)newObj).Property(property).IsModified = true;
                        context.Entry<T>((T)newObj).Property(property).CurrentValue = context.Entry<T>(entity).Property(property).CurrentValue;
                    }

                    try
                    {
                        context.SaveChanges();
                        proc.objResult = entity;
                    }
                    catch (DbUpdateConcurrencyException ex)
                    {
                        proc.Success = false;
                        proc.Message = ex.Message.ToString();
                    }
                    catch (Exception ex)
                    {
                        proc.Success = false;
                        proc.Message = ex.Message.ToString();
                    }
                }
            }

            return proc;
        }

        /// <summary>
        /// Method responsible for inserting a member in database
        /// </summary>
        /// <typeparam name="T">Entity type</typeparam>
        /// <param name="entity"></param>
        /// <returns></returns>
        public ProcResult Insert<T>(T entity) where T : class
        {
            ProcResult proc = new ProcResult();
            proc.Success = true;
            proc.Message = Messages.ExecuteSuccess.ToString();

            using (var context = new eManageContext())
            {
                try
                {
                    context.Entry(entity).State = EntityState.Added;
                    context.SaveChanges();

                    proc.objResult = entity;
                }
                catch (Exception ex)
                {
                    proc.Success = false;
                    proc.Message = ex.Message.ToString();
                }

            }

            return proc;
        }

        /// <summary>
        /// Method responsible for deleting a member of database
        /// </summary>
        /// <typeparam name="T">Entity type</typeparam>
        /// <param name="entity"></param>
        /// <returns></returns>
        public ProcResult Delete<T>(T entity) where T : class
        {
            ProcResult proc = new ProcResult();
            proc.Success = true;
            proc.Message = Messages.ExecuteSuccess.ToString();

            using (var context = new eManageContext())
            {
                try
                {
                    context.Entry(entity).State = EntityState.Deleted;
                    context.SaveChanges();
                }
                catch (Exception ex)
                {
                    proc.Success = false;
                    proc.Message = ex.Message.ToString();
                }

            }

            return proc;
        }

    }
}
