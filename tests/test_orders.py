"""
Unit and Integration Tests for TelemetryPulse Orders API and Database Query Layer.
Verifies schema compliance, nested order items structure, and query optimization metrics.
"""

import pytest
from app.database import (
    fetch_orders_summary_n_plus_one,
    fetch_orders_summary_optimized,
    _MOCK_ORDERS,
    _MOCK_ORDER_ITEMS
)
from app.server import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_mock_seed_integrity():
    """Verify that seed data contains 100 orders and 1000 items."""
    assert len(_MOCK_ORDERS) == 100
    total_items = sum(len(items) for items in _MOCK_ORDER_ITEMS.values())
    assert total_items == 1000

def test_orders_summary_nested_structure():
    """Verify that orders summary returns correctly formatted nested order_items."""
    orders, telemetry = fetch_orders_summary_optimized(limit=10)
    assert len(orders) == 10
    first_order = orders[0]
    
    assert "id" in first_order
    assert "customer_name" in first_order
    assert "status" in first_order
    assert "total_amount" in first_order
    assert "items" in first_order
    assert isinstance(first_order["items"], list)
    assert len(first_order["items"]) == 10
    
    # Check item schema
    item = first_order["items"][0]
    assert "product_name" in item
    assert "sku" in item
    assert "unit_price" in item
    assert "quantity" in item

def test_optimization_reduces_query_count():
    """Verify that optimized query uses exactly 1 roundtrip compared to 101 in unbatched."""
    _, unbatched_telem = fetch_orders_summary_n_plus_one(limit=10)
    assert unbatched_telem["database_queries_count"] == 11
    assert unbatched_telem["has_n_plus_one_bottleneck"] is True

    _, optimized_telem = fetch_orders_summary_optimized(limit=10)
    assert optimized_telem["database_queries_count"] == 1
    assert optimized_telem["has_n_plus_one_bottleneck"] is False

def test_api_endpoints_health(client):
    """Verify /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "HEALTHY"

def test_api_orders_summary_optimized_flag(client):
    """Verify API endpoint returns nested data and low query count with optimized flag."""
    res = client.get("/api/v1/orders/summary?optimized=true&limit=5")
    assert res.status_code == 200
    payload = res.get_json()
    assert payload["status"] == "success"
    assert len(payload["data"]) == 5
    assert payload["telemetry"]["database_queries_count"] == 1
    assert payload["telemetry"]["has_n_plus_one_bottleneck"] is False
