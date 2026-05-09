// DOSYA YOLU: HomiefyC/Controllers/USERsController.cs
//
// Bu dosya USERsController.cs icinde scaffolded metodlara EK olarak
// asagidaki metodlari ekler / mevcut Login metodunu REPLACE eder.
//
// Gereken using satirlari:
//   using HomiefyC.Helpers;
//   using HomiefyC.ViewModels;
//
// Not: "db" degiskeni zaten mevcut controller'da tanimli olmali.

using System;
using System.Linq;
using System.Web.Mvc;
using HomiefyC.Helpers;
using HomiefyC.Models;
using HomiefyC.ViewModels;

namespace HomiefyC.Controllers
{
    public partial class USERsController : Controller
    {
        // Eger partial kullanamiyorsaniz bu metodlari direkt mevcut
        // USERsController sinifina yapistiriniz.

        private HomiefyDBEntities1 db = new HomiefyDBEntities1();

        // ---------------------------------------------------------------
        // GET: /USERs/Login
        // ---------------------------------------------------------------
        public ActionResult Login()
        {
            if (Session["UserID"] != null)
                return RedirectToAction("Index", "Profile");

            return View(new LoginViewModel());
        }

        // ---------------------------------------------------------------
        // POST: /USERs/Login
        // ---------------------------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            try
            {
                var user = db.USERs.FirstOrDefault(u => u.Email == model.Email);

                if (user == null)
                {
                    ModelState.AddModelError("Email", "Bu email ile kayitli kullanici bulunamadi.");
                    return View(model);
                }

                // PasswordHash kontrolu
                // Eger PasswordHash alani henuz EF modeline eklenmemisse
                // asagidaki satirda derleme hatasi alirsiniz.
                // Cozum: ALTER script calistirin + EF modelini guncelleyin.
                string expectedHash = PasswordHelper.Hash(model.Password);

                bool passwordOk = !string.IsNullOrEmpty(user.PasswordHash)
                                  && PasswordHelper.Verify(model.Password, user.PasswordHash);

                // BACKWARD COMPAT: Eski test kullanicilari icin bos hash varsa
                // salt email ile gecici giris izni (opsiyonel, kaldirilabilir)
                if (!passwordOk && string.IsNullOrEmpty(user.PasswordHash))
                {
                    // Eski hash'siz kullanici → ilk giriste hash kaydet
                    user.PasswordHash = PasswordHelper.Hash(model.Password);
                    db.SaveChanges();
                    passwordOk = true;
                }

                if (!passwordOk)
                {
                    ModelState.AddModelError("Password", "Sifre yanlis. Lutfen tekrar deneyin.");
                    return View(model);
                }

                // Session bilgilerini set et
                Session["UserID"]    = user.UserID;
                Session["UserName"]  = user.Name;
                Session["UserEmail"] = user.Email;
                Session["IsAdmin"]   = user.IsAdmin; // BIT kolonu; true/false

                // Admin → kendi özel paneline, kullanici → Profile sayfasina
                if (user.IsAdmin == true)
                    return RedirectToAction("Index", "USERs");

                return RedirectToAction("Index", "Profile");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Giris sirasinda hata olustu: " + ex.Message);
                return View(model);
            }
        }

        // ---------------------------------------------------------------
        // GET: /USERs/Logout
        // ---------------------------------------------------------------
        public ActionResult Logout()
        {
            Session.Clear();
            Session.Abandon();
            return RedirectToAction("Login", "USERs");
        }

        // ---------------------------------------------------------------
        // GET: /USERs/Create  (Register sayfasi)
        // ---------------------------------------------------------------
        public new ActionResult Create()
        {
            if (Session["UserID"] != null)
                return RedirectToAction("Index", "Profile");

            return View(new RegisterViewModel());
        }

        // ---------------------------------------------------------------
        // POST: /USERs/Create  (Register islemi)
        // ---------------------------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            try
            {
                // Email zaten kayitli mi?
                bool emailExists = db.USERs.Any(u => u.Email == model.Email);
                if (emailExists)
                {
                    ModelState.AddModelError("Email", "Bu email adresi zaten kayitli.");
                    return View(model);
                }

                var newUser = new USER
                {
                    Name         = model.Name,
                    Email        = model.Email,
                    PhoneNumber  = model.PhoneNumber,
                    Age          = model.Age,
                    Gender       = model.Gender,
                    PasswordHash = PasswordHelper.Hash(model.Password),
                    IsAdmin      = false
                };

                db.USERs.Add(newUser);
                db.SaveChanges();

                // Bos profil olustur
                var newProfile = new PROFILE
                {
                    UserID           = newUser.UserID,
                    Biography        = "",
                    Occupation       = "",
                    CleanlinessLevel = "",
                    SleepSchedule    = ""
                };
                db.PROFILEs.Add(newProfile);
                db.SaveChanges();

                // Otomatik giris yap
                Session["UserID"]    = newUser.UserID;
                Session["UserName"]  = newUser.Name;
                Session["UserEmail"] = newUser.Email;
                Session["IsAdmin"]   = false;

                TempData["Success"] = "Kayit basarili! Hosgeldiniz, " + newUser.Name + ".";
                return RedirectToAction("Index", "Profile");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Kayit sirasinda hata olustu: " + ex.Message);
                return View(model);
            }
        }
    }
}
