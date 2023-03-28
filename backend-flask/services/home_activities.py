from datetime import datetime, timedelta, timezone
from opentelemetry import trace
tracer = trace.get_tracer("home.activities")
from lib.db import db

class HomeActivities:
   def run(cognito_user_id=None):
    # Logger.info("HomeActivities")
    # with tracer.start_as_current_span("home-activities-mock-data"): 
    #  span = trace.get_current_span()
    #  span.set_attribute("app.now", now.isoformat()) 
    sql = db.template('activities','home')
    results = db.query_array_json(sql)
    return results