# API Service

## Overview

The **API Service** provides a RESTful interface for querying storm data stored in MongoDB. It listens to Kafka for transformed weather data, stores it in MongoDB, and exposes API endpoints for querying the data by date and location.

## Features

- Consumes weather data from Kafka.
- Stores weather data in MongoDB.
- Provides API endpoints to query weather data by date and location.
- Implements logging and monitoring for API requests and data processing.

## Technologies

- **Node.js**
- **Express** (for building the API)
- **MongoDB** (for storing weather data)
- **Kafka** (for consuming transformed weather data)
- **Winston** (for structured logging)
- **CORS** (for handling cross-origin requests)

## Environment Variables

| Variable              | Description                                      |
| --------------------- | ------------------------------------------------ |
| `KAFKA_BROKER`        | Kafka broker URL (e.g., `kafka:9092`)         |
| `TRANSFORMED_TOPIC`   | Kafka topic for transformed weather data          |
| `MONGO_URI`           | MongoDB connection URI                           |
| `MONGO_DB_NAME`       | MongoDB database name                            |
| `PORT`                | Port for the API server                          |
| `CORS_ORIGIN`         | Allowed origin for CORS (e.g., `http://localhost:8000`) |

## Setup

1. Install dependencies:

  ```bash
  npm install
  ```
2. Run the service:

```bash
npm start
```

## API Endpoints
The service provides several API endpoints for querying storm data:
| Method              | Endpoint                                      | Description        |
| --------------------- | ------------------------------------------------ | ------------------------------------------------ |
| GET	| /api/wind	| Fetch all weather data
| GET	| /api/wind?date=YYYY-MM-DD	| Fetch weather data filtered by date
| GET	| /api/wind?location=LocationName	| Fetch weather data filtered by location
| GET	| /api/wind?date=YYYY-MM-DD&location=LocationName	| Fetch weather data by date and location

## How it Works
1. Consumes Data from Kafka: The service listens to the transformed-weather-data topic on Kafka, consumes transformed weather data, and stores it in MongoDB.
2. Provides REST API: The API exposes endpoints for querying storm data stored in MongoDB by date, location, or both.
3. CORS Configuration: The service allows cross-origin requests from a specific origin defined in the .env file.
