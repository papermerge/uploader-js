build:
	npx webpack --config webpack.config.js

watch:
	npx webpack --config webpack.config --watch

publish:
	npm publish --access public

run:
	source ./playground/.venv/bin/activate && cd playground/ && ./run.sh
