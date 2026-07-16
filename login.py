import resend

resend.api_key = "re_5cwJLXoT_PD8mDQVEPwxF6WmCNjLiTYDp"

r = resend.Emails.send({
  "from": "onboarding@resend.dev",
  "to": "2095368893@qq.com",
  "subject": "Hello World",
  "html": "<p>Congrats on sending your <strong>first email</strong>!</p>"
})