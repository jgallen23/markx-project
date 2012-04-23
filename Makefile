run: install

install: clean
	@git submodule update --init
	@npm install
	@mkdir dist
	@mkdir dist/images
	@cp -r ui/hubinfo/images/* ui/images
	@cp -r ui/images/* dist/images

clean:
	@rm -rf dist

.PHONY: install clean preview
