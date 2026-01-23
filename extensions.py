from flask import request
from flask_mailman import Mail
from flask_babel import Babel

mail = Mail()
babel = Babel()


def get_locale():
    return request.accept_languages.best_match(["en", "es"])
