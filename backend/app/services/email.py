import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from flask import current_app


def send_contact_email(form_data, image_data=None, image_filename=None):
    config = current_app.config

    msg = MIMEMultipart()
    msg['From'] = config['MAIL_DEFAULT_SENDER']
    msg['To'] = config['CONTACT_RECIPIENT']
    msg['Subject'] = f"Tattoo Consultation – {form_data['name']}"

    body_lines = [
        f"Name: {form_data['name']}",
        f"Email: {form_data['email']}",
    ]
    if form_data.get('size'):
        body_lines.append(f"Size: {form_data['size']}")
    if form_data.get('bodyPart'):
        body_lines.append(f"Body Part: {form_data['bodyPart']}")
    if image_filename:
        body_lines.append(f"Reference Image: {image_filename} (attached)")
    body_lines.append("")
    body_lines.append("Description:")
    body_lines.append(form_data['description'])

    msg.attach(MIMEText('\n'.join(body_lines), 'plain'))

    if image_data and image_filename:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(image_data)
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename="{image_filename}"')
        msg.attach(part)

    if config['MAIL_USE_SSL']:
        smtp_class = smtplib.SMTP_SSL
    else:
        smtp_class = smtplib.SMTP

    with smtp_class(config['MAIL_SERVER'], config['MAIL_PORT'], timeout=30) as server:
        if not config['MAIL_USE_SSL'] and config['MAIL_USE_TLS']:
            server.starttls()
        if config['MAIL_USERNAME'] and config['MAIL_PASSWORD']:
            server.login(config['MAIL_USERNAME'], config['MAIL_PASSWORD'])
        server.send_message(msg)
