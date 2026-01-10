import os
from flask import Blueprint, render_template, request
from flask_mailman import EmailMessage


email_bp = Blueprint("email", __name__)


@email_bp.route("/email", methods=["POST"])
def email():
    data = request.form
    name = data.get("name")
    email = data.get("email")
    subject = data.get("subject")
    message = data.get("message")

    print(f"Name: {name}")
    print(f"Email: {email}")
    print(f"Subject: {subject}")
    print(f"Message: {message}")

    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    if not MAIL_USERNAME:
        return "Internal Server Error", 500

    html_body = render_template(
        "emails/message.html",
        name=name,
        email=email,
        subject=subject,
        message=message,
    )

    message = EmailMessage(
        subject="Portfolio email: " + subject,
        body=html_body,
        to=[MAIL_USERNAME],
    )
    message.content_subtype = "html"

    try:
        message.send()
    except Exception as e:
        return "Internal Server Error", 500

    return "", 200
