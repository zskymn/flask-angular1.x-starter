# coding=utf-8

import os

from flask import Flask, render_template
from flask.ext.login import LoginManager
from flask.ext.bcrypt import Bcrypt
from flask.ext.sqlalchemy import SQLAlchemy


#################
# cofig         #
#################

app = Flask(
    __name__,
    template_folder='../client/dist/pages',
    static_folder='../client/dist/static'
)


app_settings = os.getenv(
    'APP_SETTINGS', 'server.config.DevelopmentConfig')
app.config.from_object(app_settings)


#################
# extensions    #
#################

login_manager = LoginManager()
login_manager.init_app(app)
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

#################
# blueprints    #
#################

from server.user.views import user_blueprint  # nopep8
from server.main.views import main_blueprint  # nopep8
app.register_blueprint(user_blueprint)
app.register_blueprint(main_blueprint)

#################
# flask-login   #
#################

from server.models import User  # nopep8

login_manager.login_view = "user.login"
login_manager.login_message_category = 'danger'


@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id == int(user_id)).first()


#################
# erro rhandler #
#################

@app.errorhandler(403)
def forbidden_page(error):
    return render_template("errors/403.html"), 403


@app.errorhandler(404)
def page_not_found(error):
    return render_template("errors/404.html"), 404


@app.errorhandler(500)
def server_error_page(error):
    return render_template("errors/500.html"), 500
