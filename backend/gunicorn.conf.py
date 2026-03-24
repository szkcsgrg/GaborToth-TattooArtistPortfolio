import os
import sentry_sdk


def post_fork(server, worker):
    dsn = os.environ.get('SENTRY_DSN')
    if dsn:
        sentry_sdk.init(
            dsn=dsn,
            send_default_pii=True,
        )
