install: clean
	@git submodule update --init
	@npm install
	@mkdir dist
	@mkdir dist/images
	@cp -r ui/hubinfo/images/* dist/images

clean:
	@rm -rf dist

.PHONY: install clean preview
