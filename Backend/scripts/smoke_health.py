"""Start the API and verify its HTTP health endpoint responds."""
import subprocess
import sys
import time
import urllib.request


process = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8765"],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)
try:
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise RuntimeError("FastAPI exited before becoming healthy")
        try:
            with urllib.request.urlopen("http://127.0.0.1:8765/health", timeout=1) as response:
                if response.status != 200:
                    raise RuntimeError(f"Unexpected health status: {response.status}")
                break
        except Exception:
            time.sleep(0.25)
    else:
        raise RuntimeError("FastAPI health endpoint did not respond within 20 seconds")
finally:
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
