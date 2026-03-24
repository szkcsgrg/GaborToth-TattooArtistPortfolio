import os
import sentry_sdk


def post_fork(server, worker):
    dsn = os.environ.get('SENTRY_DSN')
    print(f"[gunicorn post_fork] worker={worker.pid}, DSN={'SET' if dsn else 'MISSING'}", flush=True)
    if dsn:
        sentry_sdk.init(
            dsn=dsn,
            send_default_pii=True,
            debug=True,
        )
        print("[gunicorn post_fork] Sentry initialized", flush=True)
