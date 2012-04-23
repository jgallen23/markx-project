install: clean
	@git submodule update --init
	@npm install
	@cp -r ui/vendor/hubinfo/dist/images dist/

clean:
	rm -rf dist

.PHONY: install clean preview
