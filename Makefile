build: components
	@./node_modules/.bin/component-build \
		--standalone postmessage \
		--out . --name postmessage

components:
	@./node_modules/.bin/component \
	install --dev

test:
	@./node_modules/.bin/mocha-phantomjs \
	./test/index.html

clean:
	rm -fr postmessage.js components

.PHONY: clean test