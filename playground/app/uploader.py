import os
import time

from flask import (
    Blueprint,
    render_template,
    request
)

global_context = {
    'features': [
        {
            'url': '/01-uploader',
            'title': '01 - Uploader'
        },
        {
            'url': '/02-events',
            'title': '02 - Events'
        },
    ]
}


def _get_template_name(req):
    name_with_slashes = req.url_rule.rule
    template_name = name_with_slashes.split('/')[1]

    return f"{template_name}.html"


def _folder_abs_path(folder_name):
    """
    Returns absolute path given folder name.

    Example:

    _folder_abs_path("static") => absolute path to static folder
    _folder_abs_path("media")  => absolute path to media folder
    """
    abs_path = os.path.join(
        os.path.dirname(__file__),
        '..',
        folder_name
    )

    return abs_path


def create_blueprint(name, request_delay=0):
    """
    Create a blueprint with options.

    A blueprint, in flask sense, is a reusable app in django's sense.
    `request_delay` is the number of seconds to delay handling of the
    request. With `request_delay` > 0 we simulate slow requests.
    """

    # Reusable app. It provides views for following URLS:
    #  - /
    #  - /upload/
    blueprint = Blueprint(
        name,  # unique name
        name,  # import_name
        template_folder='templates',  # same folder as for the main app
        static_folder=_folder_abs_path("static")  # same as for main app

    )

    @blueprint.route('/')
    def browser():
        template_name = f"features/{_get_template_name(request)}"
        time.sleep(request_delay)
        return render_template(
            template_name,
            **global_context
        )

    @blueprint.route('/upload/', methods=['POST'])
    def upload():
        time.sleep(request_delay)
        return {
            'doc_id': 1,
            'title': 'some_title.pdf'
        }

    return blueprint
