# coding=utf-8


import os
import unittest
import coverage

from server import app, db
from server.models import User

COV = coverage.coverage(
    branch=True,
    include='server/*',
    omit=[
        'server/tests/*',
        'server/config.py',
        'server/*/__init__.py'
    ]
)
COV.start()


from flask.ext.script import Manager  # nopep8

manager = Manager(app)


@manager.command
def test():
    """Runs the unit tests without coverage."""
    tests = unittest.TestLoader().discover('server/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


@manager.command
def cov():
    """Runs the unit tests with coverage."""
    tests = unittest.TestLoader().discover('server/tests')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print('Coverage Summary:')
        COV.report()
        basedir = os.path.abspath(os.path.dirname(__file__))
        covdir = os.path.join(basedir, 'server/coverage')
        COV.html_report(directory=covdir)
        print('HTML version: %s/index.html' % covdir)
        COV.erase()
        return 0
    return 1


@manager.command
def create_db():
    """Creates the db tables."""
    db.create_all()


@manager.command
def drop_db():
    """Drops the db tables."""
    db.drop_all()


@manager.command
def create_admin():
    """Creates the admin user."""
    db.session.add(User(email='ad@min.com', password='admin', admin=True))
    db.session.commit()


if __name__ == '__main__':
    manager.run()
