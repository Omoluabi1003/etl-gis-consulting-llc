import argparse
import json
from .engine import Engine
from .dashboard import render


def main():
    parser = argparse.ArgumentParser(description="ETL GeoAgent OS pilot")
    parser.add_argument("--db", default="geoagent_os/runtime/operations.sqlite")
    sub = parser.add_subparsers(dest="command", required=True)
    create = sub.add_parser("create")
    create.add_argument("file")
    run = sub.add_parser("run")
    run.add_argument("id")
    run.add_argument("--ai", action="store_true", help="Explicitly send public synthetic work-order data to configured provider adapter")
    review = sub.add_parser("review")
    review.add_argument("id")
    review.add_argument("--reviewer", required=True)
    review.add_argument("--decision", choices=["approved", "rejected"], required=True)
    review.add_argument("--hash", required=True)
    review.add_argument("--note", required=True)
    export = sub.add_parser("export")
    export.add_argument("id")
    export.add_argument("destination")
    show = sub.add_parser("show")
    show.add_argument("id")
    sub.add_parser("list")
    dash = sub.add_parser("dashboard")
    dash.add_argument("destination")
    args = parser.parse_args()
    engine = Engine(args.db)
    try:
        if args.command == "create":
            from pathlib import Path
            file = Path(args.file)
            if file.stat().st_size > 2_000_000:
                raise ValueError("Work order exceeds 2 MB pilot limit")
            output = {"id": engine.create(json.loads(file.read_text(), parse_constant=lambda x: (_ for _ in ()).throw(ValueError("Non-finite JSON value"))))}
        elif args.command == "run":
            output = engine.run(args.id, args.ai)
        elif args.command == "review":
            output = engine.review(args.id, args.reviewer, args.decision, args.hash, args.note)
        elif args.command == "export":
            output = {"file": engine.export(args.id, args.destination)}
        elif args.command == "dashboard":
            output = {"file": render(engine, args.destination)}
        elif args.command == "show":
            output = engine.get(args.id)
        else:
            output = engine.jobs()
        print(json.dumps(output, indent=2))
    except (ValueError, OSError) as error:
        parser.exit(1, f"Error: {error}\n")
    finally:
        engine.db.close()


if __name__ == "__main__":
    main()
