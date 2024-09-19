package pkg

import (
	"github.com/sirupsen/logrus"
)

var logger = logrus.New()

func init() {
	logger.SetFormatter(&logrus.JSONFormatter{})
	logger.SetLevel(logrus.InfoLevel)
}

func LogInfo(msg string) {
	logger.Info(msg)
}

func LogError(err error, msg string) {
	logger.WithError(err).Error(msg)
}
