# clickhouse-collector

Clickhouse Collector - service for bulk insertion

```docker
docker-compose up -d --build
```

Send to `collector` queue this payload:

```json
{
  "pattern": "taxi_analytics",
  "data": {
    "trip_id": "123456789",
    "pickup_datetime": "2023-12-08T12:30:00Z",
    "dropoff_datetime": "2023-12-08T13:00:00Z",
    "pickup_longitude": -73.987456,
    "pickup_latitude": 40.748817,
    "dropoff_longitude": -74.006789,
    "dropoff_latitude": 40.712345,
    "passenger_count": 3,
    "trip_distance": 5.25,
    "fare_amount": 15.5,
    "extra": 1.5,
    "tip_amount": 3,
    "tolls_amount": 2.25,
    "total_amount": 22.25,
    "payment_type": 1,
    "pickup_ntaname": "Midtown",
    "dropoff_ntaname": "Downtown"
  }
}
