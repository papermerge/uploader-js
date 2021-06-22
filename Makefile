SHELL := /bin/bash

build:
	npx webpack --config webpack.config.js

watch:
	npx webpack --config webpack.config --watch

test:
	TESTBUILD=true npx webpack --config webpack.config.js
	npx karma start karma.conf.js

publish:
	npm publish --access public

run:
	source ./playground/.venv/bin/activate && cd playground/ && ./run.sh
