import time
from collections import defaultdict

from flask import Blueprint, jsonify, request

from app import db
from app.models.visit import PageVisit
from app.services.email import send_contact_email

api_bp = Blueprint('api', __name__)



VALID_SIZES = {'small', 'medium', 'large', 'xlarge'}
VALID_BODY_PARTS = {
    'forearm', 'upperArm', 'fullSleeve', 'shoulder', 'chest', 'ribs',
    'upperBack', 'lowerBack', 'thigh', 'calf', 'ankle', 'wrist',
    'neck', 'hand', 'other',
}
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'heic'}

# In-memory rate limiting: {ip: [timestamp, ...]}
_rate_limit_store: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_MAX = 3
RATE_LIMIT_WINDOW = 600  # 10 minutes


def _is_rate_limited(ip: str) -> bool:
    now = time.time()
    timestamps = _rate_limit_store[ip]
    # Remove expired entries
    _rate_limit_store[ip] = [ts for ts in timestamps if now - ts < RATE_LIMIT_WINDOW]
    return len(_rate_limit_store[ip]) >= RATE_LIMIT_MAX


@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})


@api_bp.route('/visits', methods=['POST'])
def record_visit():
    ip = request.remote_addr or '0.0.0.0'
    ua = (request.headers.get('User-Agent') or '')[:512]
    visit = PageVisit(ip_address=ip, user_agent=ua)
    db.session.add(visit)
    db.session.commit()
    total = PageVisit.query.count()
    return jsonify({'success': True, 'total': total})


@api_bp.route('/visits', methods=['GET'])
def get_visits():
    total = PageVisit.query.count()
    return jsonify({'total': total})


@api_bp.route('/contact', methods=['POST'])
def contact():
    ip = request.remote_addr or '0.0.0.0'
    if _is_rate_limited(ip):
        return jsonify({'success': False, 'error': 'Too many requests. Please try again later.'}), 429

    name = (request.form.get('name') or '').strip()
    email = (request.form.get('email') or '').strip()
    size = (request.form.get('size') or '').strip()
    body_part = (request.form.get('bodyPart') or '').strip()
    description = (request.form.get('description') or '').strip()

    errors = []
    if not name:
        errors.append('Name is required.')
    if not email or '@' not in email:
        errors.append('A valid email is required.')
    if size and size not in VALID_SIZES:
        errors.append('Invalid size selected.')
    if body_part and body_part not in VALID_BODY_PARTS:
        errors.append('Invalid body part selected.')
    if not description:
        errors.append('Description is required.')

    image_data = None
    image_filename = None
    file = request.files.get('referenceImage')
    if file and file.filename:
        ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            errors.append(f'Invalid image type. Allowed: {", ".join(ALLOWED_IMAGE_EXTENSIONS)}')
        else:
            image_data = file.read()
            image_filename = file.filename

    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    try:
        send_contact_email(
            {'name': name, 'email': email, 'size': size, 'bodyPart': body_part, 'description': description},
            image_data=image_data,
            image_filename=image_filename,
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'Failed to send email. Please try again later.'}), 500

    _rate_limit_store[ip].append(time.time())
    return jsonify({'success': True, 'message': 'Your consultation request has been sent successfully!'})
