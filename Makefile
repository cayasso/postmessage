FILE = postmessage.js
MINFILE = postmessage.min.js

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
	rm -fr $(FILE) components

min:
	@./node_modules/.bin/uglifyjs $(FILE) \
	 	--compress \
	 	> $(MINFILE)

.PHONY: clean test build min