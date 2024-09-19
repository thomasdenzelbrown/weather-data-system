# Data Collection Service

## Overview

The **Data Collection Service** fetches weather data from NOAA in CSV format, processes the data, and publishes it to Kafka. This service is designed to handle large CSV files efficiently by using a streaming approach, processing rows as they are read.

## Features

- Fetches CSV data from NOAA.
- Processes large CSV files using a streaming approach.
- Publishes processed data to Kafka.
- Handles cases where no data is available in the CSV.

## Technologies

- **Node.js**
- **Kafka**
- **Axios** (for fetching CSV)
- **csv-parser** (for parsing CSV)
- **Winston** (for logging)

## Environment Variables

| Variable       | Description                              |
| -------------- | ---------------------------------------- |
| `CSV_URL`      | URL of the CSV file to fetch             |
| `KAFKA_BROKER` | Kafka broker URL (e.g., `kafka:9092`) |
| `RAW_TOPIC`    | Kafka topic where raw data is published  |

## Setup

1. Install dependencies:

  ```bash
  npm install
  ```

2. Run the service:
  ```bash
  npm start
  ```
## How it Works
1. The service fetches weather data from the specified CSV_URL.
2. The CSV data is processed using streams to handle large files efficiently.
3. Each row of data is published to Kafka under the specified RAW_TOPIC.
