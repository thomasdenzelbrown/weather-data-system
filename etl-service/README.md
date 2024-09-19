# ETL Service (Go)

## Overview

The **ETL Service** is responsible for consuming weather data from Kafka, transforming it, and storing it in MongoDB. This service is written in **Go** and ensures that duplicate records for the same day and time are not inserted into the database.

## Features

- Consumes data from Kafka.
- Transforms weather data and removes duplicates based on the time and date fields.
- Stores transformed data in MongoDB.
- Ensures each record is only inserted once per day by checking for duplicates.

## Technologies

- **Go**
- **Kafka**
- **Logrus** (for structured logging)

## Environment Variables

| Variable              | Description                                      |
| --------------------- | ------------------------------------------------ |
| `KAFKA_BROKER`        | Kafka broker URL (e.g., `kafka:9092`)         |
| `RAW_TOPIC`         | Kafka topic for raw data                         |
| `TRANSFORMED_TOPIC`           | Kafka topic for transformed data                         |
| `MONGO_DB_NAME`       | MongoDB database name                            |
| `KAFKA_CONSUMER_GROUP`    | Kafka consumer group                          |

## Setup

1. Install dependencies:

Ensure you have Go installed, then run:

```bash
go mod tidy
```

2. Build and run the service:
```bash
go build -o etl-service .
./etl-service
```

3. Alternatively, run the service directly using:
```bash
go run main.go
```

## How it Works

1. The service consumes weather data from the specified Kafka topic.
3. The service then transform the data and produces the result to Kafka topic.
4. The service logs all processed records and any errors encountered during Kafka consumption.

