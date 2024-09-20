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

			log.Println("Received message: ", string(msg.Value))

			var rawData map[string]interface{}
			err := json.Unmarshal(msg.Value, &rawData)
			if err != nil {
				log.Println("Error unmarshalling Kafka message:", err)
				continue
			}

			log.Println("Unmarshalled data:", rawData)

			if len(rawData) == 0 {
				log.Println("No wind data to process (empty message), skipping.")
				continue
			}

			for key, value := range rawData {
				strValue, ok := value.(string)
				if ok {
					log.Printf("Processing key: %s, value: %s\n", key, strValue)
				} else {
					log.Printf("Skipping key %s as it's not a string\n", key)
				}
			}

			transformedData := ProcessRawData(rawData)

			err = PublishTransformedData(transformedData)
			if err != nil {
				log.Println("Failed to publish transformed data:", err)
			}
		} else {
			fmt.Printf("Error consuming message: %v (%v)\n", err, msg)
		}
	}
}
