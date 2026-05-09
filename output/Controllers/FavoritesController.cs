using System;
using System.Linq;
using System.Web.Mvc;
using HomiefyC.Models;
using HomiefyC.ViewModels;

namespace HomiefyC.Controllers
{
    public class FavoritesController : Controller
    {
        private HomiefyDBEntities1 db = new HomiefyDBEntities1();

        private int? GetUID() => Session["UserID"] != null ? (int?)((int)Session["UserID"]) : null;

        public ActionResult Index()
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "Account");

            var favs = db.FAVORITEs
                .Include("LISTING")
                .Include("LISTING.CATEGORY")
                .Include("LISTING.ROOMs")
                .Where(f => f.UserID == uid)
                .ToList();

            var cards = favs.Select(f => new ListingCardViewModel
            {
                ListingID = f.ListingID,
                Title = f.LISTING.Title,
                Description = f.LISTING.Description ?? "",
                CategoryName = f.LISTING.CATEGORY?.CategoryName ?? "General",
                MonthlyRent = f.LISTING.ROOMs.FirstOrDefault()?.MonthlyRent ?? 0,
                IsFavorite = true
            }).ToList();

            ViewBag.Count = cards.Count;
            return View(cards);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}
