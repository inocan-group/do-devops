# Image Command

Intended to facilitate:

- the conversion between image formats
- the optimization of those images
- creating a inline blurred version for first load

## Subcommands

1. `config` - scans the repo for directories with images in it and then asks a few interactive questions to provide a baseline configuration for the repo (stored in `.do-devops.json` file)
    - which directories should be configured (config per directory but with file overrides)
      - 

2. `convert` - runs the conversions configured; if no configuration is found it will list images files and you can do a _one-off_ image conversion
3. `optimize` - 
4. `list` - lists all images and their dimensions in the repo