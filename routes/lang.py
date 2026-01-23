from flask import Blueprint, redirect, request, session

lang_bp = Blueprint("lang", __name__)


@lang_bp.route("/setlang")
def setlang():
    lang = request.args.get("lang", "en")
    session["lang"] = lang
    return redirect(request.referrer)
