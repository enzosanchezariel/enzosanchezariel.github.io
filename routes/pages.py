from flask import Blueprint, abort, render_template


pages_bp = Blueprint("pages", __name__)


@pages_bp.route("/")
def landing_page():
    return render_template("index.html")


@pages_bp.route("/projects/<path:page>")
def projects(page):
    try:
        return render_template(f"projects/{page}.html")
    except Exception:
        abort(404)
