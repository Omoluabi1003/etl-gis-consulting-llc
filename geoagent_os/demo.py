"""Generate three synthetic jobs and a dashboard; never auto-approve."""
import argparse
import json
from pathlib import Path
from .engine import Engine
from .dashboard import render

parser = argparse.ArgumentParser()
parser.add_argument("--output", default="geoagent_os/runtime")
args = parser.parse_args()
destination = Path(args.output)
destination.mkdir(parents=True, exist_ok=True)
engine = Engine(destination / "demo.sqlite")
for source in sorted((Path(__file__).parent / "examples").glob("*.json")):
    payload = json.loads(source.read_text())
    if not any(j["payload"] == payload for j in engine.jobs()):
        engine.run(engine.create(payload))
print(render(engine, destination / "dashboard.html"))
engine.db.close()
