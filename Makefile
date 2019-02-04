# Make commands for ease of use
# Note: While these are mostly wrappers for node scripts, this aims to set up a common interface
# across services and libraries.

PROJECT_ID_LOCAL_TEST=gcloud-core-test
DATASTORE_EMULATOR_HOST=localhost:8081

.PHONY: install
install:
	npm install

.PHONY: build
build:
	npm run build

.PHONY: dev-env
test-env:
	gcloud beta emulators datastore start --project=$(PROJECT_ID_LOCAL_TEST) --data-dir=../data

.PHONY: test
test:
	DATASTORE_EMULATOR_HOST=$(DATASTORE_EMULATOR_HOST) GOOGLE_CLOUD_PROJECT=$(PROJECT_ID_LOCAL_TEST)
	# npm test
