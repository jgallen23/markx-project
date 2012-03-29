preview:
	@./node_modules/.bin/markx --preview 8001 markx.json

install: clean
	@git submodule update --init
	@npm install markx
	@npm install stylus
	@cp -r ui/vendor/hubinfo/dist/images dist/

clean:
	rm -rf dist

.PHONY: install clean preview
