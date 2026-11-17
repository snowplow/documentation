"""Simulate a shopper for the Signals purchase propensity tutorial.

Sends Snowplow ecommerce events for one new session to your Collector, and asks your
/predict endpoint for the session's score after each step of the journey.

Set SNOWPLOW_COLLECTOR_URL to your Collector endpoint, and optionally PREDICT_URL
(defaults to http://localhost:8000/predict), then run: python shopper.py
"""

import logging
import os
import time
import uuid

import requests
from snowplow_tracker import PageView, SelfDescribing, SelfDescribingJson, Snowplow, Subject

COLLECTOR_URL = os.environ["SNOWPLOW_COLLECTOR_URL"]
PREDICT_URL = os.environ.get("PREDICT_URL", "http://localhost:8000/predict")
SITE = "https://shop.example.com"
SECONDS_BETWEEN_STEPS = 10

ECOMMERCE_ACTION = "iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2"
PRODUCT = "iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0"

HOODIE = {"id": "hoodie-01", "name": "Logo hoodie", "category": "Apparel", "price": 48.0, "currency": "USD"}
BOTTLE = {"id": "bottle-02", "name": "Steel bottle", "category": "Drinkware", "price": 22.0, "currency": "USD"}


def page(path: str, title: str) -> PageView:
    return PageView(page_url=f"{SITE}{path}", page_title=title)


def ecommerce(action_type: str, product: dict | None = None) -> SelfDescribing:
    entities = [SelfDescribingJson(PRODUCT, product)] if product else None
    return SelfDescribing(SelfDescribingJson(ECOMMERCE_ACTION, {"type": action_type}), context=entities)


JOURNEY = [
    ("Land on the home page", [page("/", "Home")]),
    ("Browse a category", [page("/apparel", "Apparel")]),
    (
        "View two products",
        [
            page("/p/hoodie-01", "Logo hoodie"),
            ecommerce("product_view", HOODIE),
            page("/p/bottle-02", "Steel bottle"),
            ecommerce("product_view", BOTTLE),
        ],
    ),
    ("Add the hoodie to the cart", [ecommerce("add_to_cart", HOODIE)]),
    ("Start the checkout", [page("/checkout", "Checkout"), ecommerce("checkout_step")]),
]


def main() -> None:
    for name in ("snowplow_tracker.emitters", "snowplow_tracker.snowplow"):
        logging.getLogger(name).setLevel(logging.WARNING)
    session_id = str(uuid.uuid4())
    subject = Subject().set_domain_user_id(str(uuid.uuid4())).set_domain_session_id(session_id)
    tracker = Snowplow.create_tracker(
        namespace="propensity-shopper",
        endpoint=COLLECTOR_URL,
        app_id="propensity-tutorial",
        subject=subject,
    )
    print(f"domain_sessionid: {session_id}\n")

    for step, events in JOURNEY:
        for event in events:
            tracker.track(event)
        tracker.flush()
        time.sleep(SECONDS_BETWEEN_STEPS)

        prediction = requests.get(PREDICT_URL, params={"domain_sessionid": session_id}, timeout=10).json()
        attributes = ", ".join(
            f"{name}={round(value, 2) if isinstance(value, float) else value}"
            for name, value in prediction["attributes"].items()
        )
        print(f"{step:<28} score={prediction['score']:.3f}  {attributes}")


if __name__ == "__main__":
    main()
