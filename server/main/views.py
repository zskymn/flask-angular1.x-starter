# coding=utf-8

from flask import render_template, Blueprint

main_blueprint = Blueprint('main', __name__,)


@main_blueprint.route('/')
def home():
    return render_template('home.html')


@main_blueprint.route("/about/")
def about():
    return render_template("main/about.html")
