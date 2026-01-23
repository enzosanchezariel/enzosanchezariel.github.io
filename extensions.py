from flask import request, session
from flask_mailman import Mail
from flask_babel import Babel

mail = Mail()
babel = Babel()


def get_locale():
    langs = ["en", "es"]
    if "lang" in request.args:
        lang = request.args.get("lang")
        if lang in langs:
            session["lang"] = lang
            return session["lang"]
    elif "lang" in session:
        return session.get("lang")
    return request.accept_languages.best_match(langs)
