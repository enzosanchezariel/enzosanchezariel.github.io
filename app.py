import os
from flask import Flask
from flask.cli import load_dotenv
from routes.pages import pages_bp
from routes.email import email_bp
from extensions import mail


def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.register_blueprint(pages_bp)
    app.register_blueprint(email_bp)

    mail_username = os.environ.get("MAIL_USERNAME")
    mail_password = os.environ.get("MAIL_PASSWORD")
    mail_server = os.environ.get("MAIL_SERVER")
    mail_port = os.environ.get("MAIL_PORT")
    mail_use_tls = os.environ.get("MAIL_USE_TLS", "true").lower() == "true"
    mail_use_ssl = os.environ.get("MAIL_USE_SSL", "false").lower() == "true"

    app.config["MAIL_SERVER"] = mail_server
    app.config["MAIL_PORT"] = mail_port
    app.config["MAIL_USERNAME"] = mail_username
    app.config["MAIL_PASSWORD"] = mail_password
    app.config["MAIL_USE_TLS"] = mail_use_tls
    app.config["MAIL_USE_SSL"] = mail_use_ssl

    mail.init_app(app)

    return app
