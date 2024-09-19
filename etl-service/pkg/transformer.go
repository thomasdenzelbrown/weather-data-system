package pkg

import (
	"log"
	"strconv"
	"strings"
)

func ProcessRawData(rawData map[string]interface{}) map[string]interface{} {
	log.Println("Transforming raw wind data...")

	time := rawData["Time"].(string)
	speed := rawData["Speed"].(string)
	location := rawData["Location"].(string)
	county := rawData["County"].(string)
	state := rawData["State"].(string)
	lat := rawData["Lat"].(string)
	lon := rawData["Lon"].(string)
	comments := rawData["Comments"].(string)

	var parsedSpeed int
	if strings.ToUpper(speed) == "UNK" {
		parsedSpeed = 0
	} else {
		parsedSpeed, _ = strconv.Atoi(speed)
	}

	parsedLat, _ := strconv.ParseFloat(lat, 64)
	parsedLon, _ := strconv.ParseFloat(lon, 64)

	transformedData := map[string]interface{}{
		"time":      time,
		"speed":     parsedSpeed,
		"location":  location,
		"county":    county,
		"state":     state,
		"latitude":  parsedLat,
		"longitude": parsedLon,
		"comments":  comments,
		"severity":  determineSeverity(parsedSpeed),
	}

	log.Printf("Transformed data: %+v\n", transformedData)

	return transformedData
}

func determineSeverity(speed int) string {
	if speed >= 60 {
		return "High"
	} else if speed >= 30 {
		return "Medium"
	} else if speed > 0 {
		return "Low"
	} else {
		return "Unknown"
	}
}
