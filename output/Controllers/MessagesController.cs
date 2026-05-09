using System;
using System.Linq;
using System.Web.Mvc;
using HomiefyC.Models;
using HomiefyC.ViewModels;

namespace HomiefyC.Controllers
{
    public class MessagesController : Controller
    {
        private HomiefyDBEntities1 db = new HomiefyDBEntities1();

        private int? GetUID() => Session["UserID"] != null ? (int?)((int)Session["UserID"]) : null;

        public ActionResult Index(int? receiverId)
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "Account");

            int myId = uid.Value;

            var allMessages = db.MESSAGEs
                .Include("USER").Include("USER1")
                .Where(m => m.SenderID == myId || m.ReceiverID == myId)
                .OrderBy(m => m.SentAt)
                .ToList();

            // Build conversation list (unique other-user per conversation)
            var conversations = allMessages
                .GroupBy(m => m.SenderID == myId ? m.ReceiverID : m.SenderID)
                .Select(g =>
                {
                    var last = g.OrderByDescending(m => m.SentAt).First();
                    int otherId = g.Key;
                    var otherUser = otherId == last.SenderID ? last.USER1 : last.USER;
                    return new ConversationSummaryViewModel
                    {
                        OtherUserID = otherId,
                        OtherUserName = otherUser?.Name ?? "User",
                        LastMessage = last.Content,
                        LastTime = last.SentAt
                    };
                }).ToList();

            // Active chat
            var currentChat = new System.Collections.Generic.List<MessageViewModel>();
            string activeUserName = "";

            if (receiverId.HasValue)
            {
                int rid = receiverId.Value;
                var chatMsgs = allMessages
                    .Where(m => (m.SenderID == myId && m.ReceiverID == rid) ||
                                (m.SenderID == rid && m.ReceiverID == myId))
                    .ToList();

                currentChat = chatMsgs.Select(m => new MessageViewModel
                {
                    MessageID = m.MessageID,
                    SenderID = m.SenderID,
                    ReceiverID = m.ReceiverID,
                    SenderName = m.USER1?.Name ?? "",
                    Content = m.Content,
                    SentAt = m.SentAt,
                    IsMe = m.SenderID == myId
                }).ToList();

                var otherUser = db.USERs.Find(rid);
                activeUserName = otherUser?.Name ?? "";
            }

            var vm = new MessagesIndexViewModel
            {
                Conversations = conversations,
                CurrentChat = currentChat,
                ActiveConversationUserID = receiverId,
                ActiveConversationUserName = activeUserName,
                ReceiverID = receiverId ?? 0
            };

            return View(vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Send(int receiverId, string content)
        {
            int? uid = GetUID();
            if (uid == null) return RedirectToAction("Login", "Account");

            if (!string.IsNullOrWhiteSpace(content))
            {
                var msg = new MESSAGE
                {
                    SenderID = uid.Value,
                    ReceiverID = receiverId,
                    Content = content,
                    SentAt = DateTime.Now
                };
                db.MESSAGEs.Add(msg);
                db.SaveChanges();
            }

            return RedirectToAction("Index", new { receiverId = receiverId });
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}
