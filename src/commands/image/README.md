# Image Command

Intended to facilitate:

- the conversion between image formats
- the optimization of those images to various resolutions
- creating a inline blurred version for first load

The process described below is intended to address more of a "batch" conversion than single image conversion. This batch conversion will be driven by user configured **rules** and stored as configuration in the `.do-devops.json` configuration file.

In turn, the successful execution of the file will result in _meta-data_ files:

    - `.image-metadata.json` - the master file which is used to catalog the images being viewed as "source images" as well as last update times of both the source as well as converted images. This file is fairly utilitarian, and meant mainly so that the `dd image watch` and `dd image convert` commands can quickly assess the state of source/converted files and update only those files required.
    - `xyz.sidecar.json` - for _rules_ which specify a "sidecar" file to be created, a sidecar with meta data will be created next to the image. The filename is preserved and `.sidecar.json` is added as an extension.
    - `image-meta.ts` - if a rule states it wants to provide TS support then a TS file will be created at the specified location (usually the root of source images). The details of this file can be found in the file formats section.

## Subcommands

1. `config` - behavior depends on whether the current repo/directory has been configured before:
    - If First Time:
        - Will bring user through the process of creating rules and save the rules in the do-devops config file
    - Subsequent runs
        - Will display the existing rules and then ask if user wishes to remove, add, or change rules ... in many cases this this may be better done via just editing config file so we may start with this being the only option
2. `convert` - runs the conversions configured; if no configuration is found it will list images files and you can do a _one-off_ image conversion
3. `watch` - keep an eye on source image and convert when sources are updated
4. `list` - lists all images and their dimensions in the repo


## Rule Config

Basic structure to rules:

1. Rules start in a configured directory
2. Rules default to all images in the directory and subdirectories but can be reduced with:
   - glob-pattern to match only certain filenames
   - turning off directory recursion
3. Rules must define the following:
   - **Target Width**: target width's to convert to (this assumes maintainence of aspect ratio, see optional props for exception)
   - **Image Format**: the image formats to convert to ... if not stated it will be defaulted to be JPG, AVIF, and WEBP
4. Optionally a user can specify:
   - An explicit height and width and the image will b

## File Formats

### Rules

Rules are stored in the repo's _do-devop_ configuration file and will conform to the structure defined by `IImageRule` type.

### Image Metadata File ( `.image-metadata.json` )

The core focus here is to tell the _watch_ and _convert_ commands which of the source files has stale conversions which need action taken. This data structure is defined by `

The file itself is stored as a dictionary of `IImageSource` types to aid quick lookups required by the watch command.

### Image Sidecar File

The amount of meta information captured in a sidecar file will be determined on whether the rule has expressed a need for _extended_ meta data. If it has then we will use ExifTool rather than 