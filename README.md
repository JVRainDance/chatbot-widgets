# Secure Chatbot Widgets

Protected chatbot widgets with Vercel proxy for rate limiting, input validation, and webhook protection.

## 🚀 Quick Deploy (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod

# 4. Copy your deployment URL
# Example: https://chatbot-widgets-abc123.vercel.app
```

## ⚙️ Configure Environment Variables

Go to: https://vercel.com → Your Project → Settings → Environment Variables

Add these **Production** variables:

```
WEBHOOK_CHATBOT=https://raindance.app.n8n.cloud/webhook/b597fca9-95c7-429b-b375-0dc41d09066a/chat
WEBHOOK_BIM=https://raindance.app.n8n.cloud/webhook/8a2b3071-fbaa-48f8-9431-b715df58f52b/chat
WEBHOOK_BIM2=https://raindance.app.n8n.cloud/webhook/4ef533d5-cdd1-4840-aca2-a9c614e11171/chat
WEBHOOK_RAPID=https://raindance.app.n8n.cloud/webhook/a0d536ef-e072-4844-8090-2ee9b36f9fb8/chat
WEBHOOK_RBM=https://raindance.app.n8n.cloud/webhook/1184e628-1f25-497a-b09f-662832480696/chat
WEBHOOK_RAINDANCE=https://raindance.app.n8n.cloud/webhook/b7183c87-d1c1-497e-8cec-f76f7b2a938d/chat
WEBHOOK_SKYLARK=https://raindance.app.n8n.cloud/webhook/6f4cf690-6d7f-4ef8-bf84-88f98eeae1f8/chat
ALLOWED_ORIGINS=*
```

## 🔧 Update Your Chatbot

1. Copy `chatbot_secure_template.js` to your bot file
2. Update the configuration:

```javascript
const config = {
    proxyUrl: 'https://your-project.vercel.app/api/chat',  // ← Your Vercel URL
    botId: 'BIM',  // ← Your bot ID (BIM, RAPID, RBM, etc.)

    // Customize as needed
    title: 'BIM Chat',
    primaryColor: '#55AFD3',
    // ... other settings
};
```

3. Test on your website!

## 🔒 Security Features

✅ **Rate Limiting**: 5 msg/min, 50 msg/hour per user
✅ **Input Validation**: Max 500 characters, blocks suspicious content
✅ **Secure Sessions**: Crypto-based session IDs
✅ **Hidden Webhooks**: URLs stored securely on server
✅ **XSS Protection**: HTML sanitization
✅ **Request Logging**: Track all activity with IP addresses

## 📁 Files

| File | Description |
|------|-------------|
| `api/chat.js` | Vercel serverless proxy (THE SECURITY LAYER) |
| `chatbot_secure_template.js` | Secure widget template - USE THIS |
| `DEPLOYMENT.md` | Full deployment guide |
| `SECURITY_FIXES.md` | Security audit & fixes details |
| `.env.example` | Environment variables template |

## 🎯 Bot IDs

| Bot File | Bot ID |
|----------|--------|
| ChatBot.js | `ChatBot` |
| chatbot_BIM.js | `BIM` |
| chatbot_BIM2.js | `BIM2` |
| chatbot_RAPID.js | `RAPID` |
| chatbot_RBM.js | `RBM` |
| chatbot_Raindance.js | `Raindance` |
| chatbot_Skylark.js | `Skylark` |

## 📊 Monitor Logs

```bash
vercel logs --follow
```

You'll see:
```
[BIM] Message from 123.45.67.89: How much does...
Rate limit exceeded: 123.45.67.89-session-abc
```

## 🆘 Troubleshooting

**Issue**: "Invalid bot configuration"
**Fix**: Check `botId` matches exactly (case-sensitive)

**Issue**: "Webhook not configured"
**Fix**: Verify environment variables in Vercel, then redeploy

**Issue**: CORS errors
**Fix**: Add your domain to `ALLOWED_ORIGINS`, then redeploy

**Issue**: Rate limit too strict
**Fix**: Edit `api/chat.js` → Change `RATE_LIMIT_PER_MINUTE` → Redeploy

## 💰 Cost

- **Vercel**: FREE (100k invocations/month, 100GB bandwidth)
- **Security**: PRICELESS

## 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [SECURITY_FIXES.md](SECURITY_FIXES.md) - Security audit details

## ✅ Migration Checklist

- [ ] Deploy Vercel proxy
- [ ] Add environment variables
- [ ] Update one bot file for testing
- [ ] Verify logs show requests
- [ ] Test rate limiting works
- [ ] Update remaining bot files
- [ ] Monitor for 24 hours
- [ ] Celebrate secure chatbots! 🎉

## 🔄 Updates

**Update proxy logic**:
```bash
# Edit api/chat.js
vercel --prod
```

**Update widget design**:
```bash
# Edit chatbot files directly
# No deployment needed
```

## 📞 Support

Issues? Check:
1. Vercel logs: `vercel logs`
2. Browser console (F12)
3. Environment variables
4. Bot ID spelling

---

**Status**: ✅ Production Ready
**Security**: ✅ All Critical Issues Fixed
**Cost**: ✅ FREE (Vercel free tier)
