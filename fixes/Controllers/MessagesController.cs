// DOSYA YOLU: HomiefyC/Controllers/MessagesController.cs
// Mevcut dosyayi TAMAMEN bu icerik ile degistir.
//
// NOT: EF Database-First'te MESSAGE tablosunda iki FK (SenderID, ReceiverID)
// ayni [USER] tablosuna baglanir. EF bunlari genellikle su sekilde adlandirir:
//   USER  → ReceiverID navigasyonu
//   USER1 → SenderID navigasyonu
// Eger projenizde farkli isimlendirme varsa asagida belirtilen yerleri guncelleyin.

using System;
using System.Linq;
using System.Web.Mvc;
using HomiefyC.Models;
using HomiefyC.ViewModels;

namespace HomiefyC.Controllers
{
    public class MESSAGEsController : Controller
    {
        private HomiefyDBEntities1 db = new HomiefyDBEntities1();

        private int? GetUID()
        {
            return Session["UserID"] != null ? (int?)((int)Session["UserID"]) : null;
        }

        // ---------------------------------------------------------------
        // GET: /MESSAGEs/Index?receiverId=X
        // Inbox + aktif sohbet
        // ---------------------------------------------------------------
        public ActionResult Index(int? receiverId)
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "USERs");

            int myId = uid.Value;
            var vm = new MessagesIndexViewModel();

            try
            {
                // Tum mesajlari getir (gonderen veya alici benim)
                var allMessages = db.MESSAGEs
                    .Include("USER")   // Receiver nav prop
                    .Include("USER1")  // Sender nav prop
                    .Where(m => m.SenderID == myId || m.ReceiverID == myId)
                    .OrderBy(m => m.SentAt)
                    .ToList();

                // Konusma listesi (her kisi icin son mesaj)
                vm.Conversations = allMessages
                    .GroupBy(m => m.SenderID == myId ? m.ReceiverID : m.SenderID)
                    .Select(g =>
                    {
                        var last    = g.OrderByDescending(m => m.SentAt).First();
                        int otherId = g.Key;

                        // USER1 = sender, USER = receiver (EF naming convention)
                        // otherId ile kim eslesiyor?
                        string otherName;
                        if (otherId == last.SenderID)
                            otherName = last.USER1?.Name ?? "Kullanici #" + otherId;
                        else
                            otherName = last.USER?.Name ?? "Kullanici #" + otherId;

                        return new ConversationSummaryViewModel
                        {
                            OtherUserID   = otherId,
                            OtherUserName = otherName,
                            LastMessage   = last.Content.Length > 60
                                            ? last.Content.Substring(0, 60) + "..."
                                            : last.Content,
                            LastTime      = last.SentAt
                        };
                    })
                    .OrderByDescending(c => c.LastTime)
                    .ToList();

                // Aktif sohbet (receiverId verilmisse)
                if (receiverId.HasValue)
                {
                    int rid = receiverId.Value;
                    vm.ActiveConversationUserID = rid;

                    var otherUser = db.USERs.Find(rid);
                    vm.ActiveConversationUserName = otherUser?.Name ?? "Kullanici #" + rid;
                    vm.ReceiverID = rid;

                    vm.CurrentChat = allMessages
                        .Where(m => (m.SenderID == myId && m.ReceiverID == rid) ||
                                    (m.SenderID == rid  && m.ReceiverID == myId))
                        .Select(m => new MessageViewModel
                        {
                            MessageID    = m.MessageID,
                            SenderID     = m.SenderID,
                            ReceiverID   = m.ReceiverID,
                            SenderName   = m.USER1?.Name ?? "Kullanici",
                            ReceiverName = m.USER?.Name  ?? "Kullanici",
                            Content      = m.Content,
                            SentAt       = m.SentAt,
                            IsMe         = m.SenderID == myId
                        }).ToList();
                }

                // Yeni mesaj formu icin kullanici listesi (kendi haricindeki herkes)
                vm.AllUsers = db.USERs
                    .Where(u => u.UserID != myId)
                    .OrderBy(u => u.Name)
                    .ToList()
                    .Select(u => new System.Web.Mvc.SelectListItem
                    {
                        Value = u.UserID.ToString(),
                        Text  = u.Name + " (" + u.Email + ")"
                    }).ToList();
            }
            catch (Exception ex)
            {
                ViewBag.Error = "Mesajlar yuklenirken hata: " + ex.Message;
            }

            return View(vm);
        }

        // ---------------------------------------------------------------
        // POST: /MESSAGEs/Send
        // Mesaj gonder
        // ---------------------------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Send(int receiverId, string content)
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "USERs");

            if (string.IsNullOrWhiteSpace(content))
            {
                TempData["Error"] = "Mesaj bos olamaz.";
                return RedirectToAction("Index", new { receiverId = receiverId });
            }

            if (receiverId == uid.Value)
            {
                TempData["Error"] = "Kendinize mesaj gonderemezsiniz.";
                return RedirectToAction("Index", new { receiverId = receiverId });
            }

            try
            {
                // Alici var mi kontrol et
                bool receiverExists = db.USERs.Any(u => u.UserID == receiverId);
                if (!receiverExists)
                {
                    TempData["Error"] = "Alici kullanici bulunamadi.";
                    return RedirectToAction("Index");
                }

                var msg = new MESSAGE
                {
                    SenderID   = uid.Value,
                    ReceiverID = receiverId,
                    Content    = content.Trim(),
                    SentAt     = DateTime.Now
                };
                db.MESSAGEs.Add(msg);
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Mesaj gonderilemedi: " + ex.Message;
            }

            return RedirectToAction("Index", new { receiverId = receiverId });
        }

        // ---------------------------------------------------------------
        // POST: /MESSAGEs/NewMessage
        // Dropdown uzerinden yeni konusma baslat
        // ---------------------------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult NewMessage(int newMessageReceiverID, string newMessageContent)
        {
            return Send(newMessageReceiverID, newMessageContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}
