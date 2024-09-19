package pkg

import (
	"log"
)

func ProcessRawData(rawData map[string]interface{}) map[string]interface{} {
	// Example transformation logic
	log.Println("Transforming raw data...")

	log.Println("Raw data: %+v\n", rawData)

	// Extract fields (adjust based on actual raw data structure)
	location := rawData["location"]
	time := rawData["time"]
	stormType := rawData["type"]

	// Perform transformation and add enriched data (example: adding a new field)
	transformedData := map[string]interface{}{
		"location":   location,
		"time":       time,
		"storm_type": stormType,
		"severity":   determineSeverity(stormType),
	}

	log.Printf("Transformed data: %+v\n", transformedData)

	return transformedData
}

func determineSeverity(stormType interface{}) string {
	// Basic example of determining storm severity based on storm type
	switch stormType {
	case "Tornado":
		return "High"
	case "Thunderstorm":
		return "Medium"
	case "Rain":
		return "Low"
	default:
		return "Unknown"
	}
}
