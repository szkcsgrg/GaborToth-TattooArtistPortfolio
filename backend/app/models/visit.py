from app import db
from datetime import datetime


class PageVisit(db.Model):
    __tablename__ = 'page_visits'

    id = db.Column(db.Integer, primary_key=True)
    visited_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(512), nullable=True)
