package pkg

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func StartKafkaConsumer() error {
	kafkaBroker := os.Getenv("KAFKA_BROKER")
	rawTopic := os.Getenv("RAW_TOPIC")
	consumerGroup := os.Getenv("KAFKA_CONSUMER_GROUP")

	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": kafkaBroker,
		"group.id":          consumerGroup,
		"auto.offset.reset": "earliest",
	})

	if err != nil {
		return err
	}

	consumer.Subscribe(rawTopic, nil)

	for {
		msg, err := consumer.ReadMessage(-1)
		if err == nil {
			if len(msg.Value) == 0 {
				log.Println("Received empty message, skipping processing.")
				continue
			}

			var rawData []map[string]interface{}
			json.Unmarshal(msg.Value, &rawData)

			if len(rawData) == 0 {
				log.Println("No wind data to process (empty message), skipping.")
				continue
			}

			for _, data := range rawData {
				transformedData := ProcessRawData(data)

				err := PublishTransformedData(transformedData)
				if err != nil {
					log.Println("Failed to publish transformed data:", err)
				}
			}
		} else {
			fmt.Printf("Error consuming message: %v (%v)\n", err, msg)
		}
	}
}
