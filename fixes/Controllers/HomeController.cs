// DOSYA YOLU: HomiefyC/Controllers/HomeController.cs
// Mevcut HomeController.cs ile TAMAMEN degistir.

using System;
using System.Linq;
using System.Web.Mvc;
using HomiefyC.Models;
using HomiefyC.ViewModels;

namespace HomiefyC.Controllers
{
    public class HomeController : Controller
    {
        private HomiefyDBEntities1 db = new HomiefyDBEntities1();

        public ActionResult Index()
        {
            // --- İstatistikler (grafik icin) ---
            try
            {
                var categoryStats = db.CATEGORies.Select(c => new
                {
                    CategoryName = c.CategoryName,
                    ListingCount = c.LISTINGs.Count()
                }).ToList();

                var rentStats = db.CATEGORies.Select(c => new
                {
                    CategoryName = c.CategoryName,
                    AvgRent = c.LISTINGs
                              .SelectMany(l => l.ROOMs)
                              .Average(r => (decimal?)r.MonthlyRent) ?? 0
                }).ToList();

                ViewBag.CategoryLabels = string.Join(",", categoryStats.Select(x => "'" + x.CategoryName + "'"));
                ViewBag.CategoryData   = string.Join(",", categoryStats.Select(x => x.ListingCount));
                ViewBag.RentLabels     = string.Join(",", rentStats.Select(x => "'" + x.CategoryName + "'"));
                ViewBag.RentData       = string.Join(",", rentStats.Select(x =>
                    Math.Round(x.AvgRent, 2).ToString(System.Globalization.CultureInfo.InvariantCulture)));
            }
            catch
            {
                ViewBag.CategoryLabels = "''";
                ViewBag.CategoryData   = "0";
                ViewBag.RentLabels     = "''";
                ViewBag.RentData       = "0";
            }

            ViewBag.TotalUsers    = db.USERs.Count();
            ViewBag.TotalListings = db.LISTINGs.Count();

            // --- Son 6 listing — null-safe ViewModel donusumu ---
            bool isLoggedIn = Session["UserID"] != null;

            var recentListings = db.LISTINGs
                .Include("CATEGORY")
                .Include("ROOMs")
                .OrderByDescending(l => l.CreatedAt)
                .Take(6)
                .ToList()   // SQL'i burada calistir, sonrasini bellekte yap
                .Select(l => new RecentListingViewModel
                {
                    ListingID    = l.ListingID,
                    Title        = l.Title ?? "(Basliksiz)",
                    Description  = l.Description != null
                                    ? (l.Description.Length > 100
                                        ? l.Description.Substring(0, 100) + "..."
                                        : l.Description)
                                    : "",
                    CategoryName = l.CATEGORY != null ? l.CATEGORY.CategoryName : "Genel",
                    MonthlyRent  = l.ROOMs != null && l.ROOMs.Count > 0
                                    ? l.ROOMs.First().MonthlyRent
                                    : 0m,
                    RoomNumber   = l.ROOMs != null && l.ROOMs.Count > 0
                                    ? (l.ROOMs.First().RoomNumber ?? "")
                                    : "",
                    CreatedAt    = l.CreatedAt,
                    IsLoggedIn   = isLoggedIn
                }).ToList();

            return View(recentListings);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Homify - Next-Gen Roommate Matching.";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Bize ulasin.";
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}
