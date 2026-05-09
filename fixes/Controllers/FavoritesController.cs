// DOSYA YOLU: HomiefyC/Controllers/FavoritesController.cs
// Mevcut dosyayi TAMAMEN bu icerik ile degistir.

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

        // Session'dan current user ID'yi alir, giris yapilmamissa null dondurur
        private int? GetUID()
        {
            return Session["UserID"] != null ? (int?)((int)Session["UserID"]) : null;
        }

        // ---------------------------------------------------------------
        // GET: /FAVORITEs/Index
        // Giris yapan kullanicinin favori ilanlarini listeler
        // ---------------------------------------------------------------
        public ActionResult Index()
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "USERs");

            try
            {
                var favs = db.FAVORITEs
                    .Include("LISTING")
                    .Include("LISTING.CATEGORY")
                    .Include("LISTING.ROOMs")
                    .Where(f => f.UserID == uid.Value)
                    .ToList();

                var cards = favs.Select(f => new FavoriteListingViewModel
                {
                    ListingID    = f.ListingID,
                    Title        = f.LISTING != null ? f.LISTING.Title : "(Silinmis ilan)",
                    Description  = f.LISTING?.Description ?? "",
                    CategoryName = f.LISTING?.CATEGORY?.CategoryName ?? "Genel",
                    MonthlyRent  = f.LISTING?.ROOMs != null && f.LISTING.ROOMs.Count > 0
                                    ? f.LISTING.ROOMs.First().MonthlyRent
                                    : 0m,
                    IsFavorite   = true,
                    SavedAt      = f.SavedAt
                }).ToList();

                ViewBag.Count = cards.Count;
                return View(cards);
            }
            catch (Exception ex)
            {
                ViewBag.Error = "Favoriler yuklenirken hata olustu: " + ex.Message;
                return View(new System.Collections.Generic.List<FavoriteListingViewModel>());
            }
        }

        // ---------------------------------------------------------------
        // POST: /FAVORITEs/Add
        // Bir ilani favorilere ekler (duplikat → hata yok, mesaj goster)
        // ---------------------------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Add(int listingId)
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "USERs");

            try
            {
                // Zaten favoride mi?
                bool alreadyFav = db.FAVORITEs
                    .Any(f => f.UserID == uid.Value && f.ListingID == listingId);

                if (alreadyFav)
                {
                    TempData["Info"] = "Bu ilan zaten favorilerinizde!";
                }
                else
                {
                    var fav = new FAVORITE
                    {
                        UserID    = uid.Value,
                        ListingID = listingId,
                        SavedAt   = DateTime.Now
                    };
                    db.FAVORITEs.Add(fav);
                    db.SaveChanges();
                    TempData["Success"] = "İlan favorilere eklendi!";
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Favoriye eklenirken hata olustu: " + ex.Message;
            }

            // Kullanicinin geldig sayfaya geri don, yoksa ana sayfaya
            string returnUrl = Request.UrlReferrer?.ToString();
            if (!string.IsNullOrEmpty(returnUrl))
                return Redirect(returnUrl);

            return RedirectToAction("Index", "Home");
        }

        // ---------------------------------------------------------------
        // POST: /FAVORITEs/Remove
        // Bir ilani favorilerden cikarir
        // ---------------------------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Remove(int listingId)
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "USERs");

            try
            {
                var fav = db.FAVORITEs
                    .FirstOrDefault(f => f.UserID == uid.Value && f.ListingID == listingId);

                if (fav != null)
                {
                    db.FAVORITEs.Remove(fav);
                    db.SaveChanges();
                    TempData["Success"] = "İlan favorilerden cikarildi.";
                }
                else
                {
                    TempData["Info"] = "Favoride boyle bir ilan bulunamadi.";
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Favoriden cikarmada hata olustu: " + ex.Message;
            }

            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}
