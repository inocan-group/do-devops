import { AspectRatioColon, epochWithMilliseconds } from "common-types";
import type {
  ColourspaceEnum,
  FormatEnum,
  GifOptions,
  JpegOptions,
  PngOptions,
  WebpOptions,
  AvifOptions,
  TiffOptions,
  HeifOptions,
  Metadata,
  TileOptions,
} from "sharp";
import { ExifDateTime, Tags, WriteTags } from "exiftool-vendored";

/**
 * Different levels of detail for meta data.
 *
 * - `basic` - what Sharp provides
 * - `tags` - large key/value dictionary from ExifTool
 * - `categorical` - a summarized set of common attributes
 */
export type ImageMetaDetail = "basic" | "categorical" | "tags";

export type SharpBufferProperties = "exif" | "iptc" | "icc" | "xmp";

export interface IptcCreatorContactInfo {
  /** website URL */
  CiUrlWork: string;
  /** contact's city */
  CiAdrCity: string;
  /** state or province of contact */
  CiAdrRegion: string;
  /** contact's country */
  CiAdrCtry: string;
  /** postcode / zipcode */
  CiAdrPcode: string;
  /** email address */
  CiEmailWork: string;
  /** telephone */
  CiTelWork: string;
  /** address */
  CiAdrExtadr: string[];
  [key: string]: any;
}

export type IExifToolMetadata<T extends {} = {}> = Omit<Tags, "CreatorContactInfo"> & {
  /** this breaks out the generic "Struct" which ExifTools provides */
  CreatorContactInfo: IptcCreatorContactInfo;
  [key: string]: unknown;
} & T;

/** metadata provided by **Sharp** but excluding the properties which return _buffers_ */
export type ISharpMetadata = Exclude<Metadata, SharpBufferProperties>;

/**
 * The ExifTool provides so metadata that TS can't compute types so they have reduced the number
 * of attributes to those which are statistically more common. That's a good start but of these
 * meta-data fields many are reporting on the same thing. For this reason we reduce the attributes
 * down to the "best" representation of commonly desired meta info.
 *
 * > See `metaReducer()` function in useExifTools
 */
export type ICategoricalMeta = {
  /** a listing of all `Tags` from ExifTool which were populated in the image */
  populated: string[];
  /** any errors encountered by **ExifTool** which were encountered in trying to get meta data */
  errors: string[];

  /** the Camera's manufacturer */
  make: string | undefined;
  /** the Camera model used in taking this picture */
  model: string | undefined;
  /** the color profile for the image */
  color: string | undefined;
  shutterSpeed: string | undefined;
  iso: number | undefined;
  createDate: ExifDateTime | undefined;
  modifyDate: ExifDateTime | undefined;
  height: number | undefined;
  width: number | undefined;
  software: string | undefined;
  aperture: number | undefined;
  lens: string | undefined;
  lensMake: string | undefined;
  focalLength: string | undefined;
  /** equivalent focal length for a 35mm camera */
  focalLength35: string | undefined;
  exposureProgram: string | undefined;
  exposureMode: string | undefined;
  bracketing: string | undefined;
  meteringMode: string | undefined;
  exposureBias: number | undefined;
  flash: string | undefined;
  flashCompensation: number | undefined;
  brightness: number | undefined;
  scene: string | undefined;
  subject: string | undefined;
  location: {
    city: string | undefined;
    state: string | undefined;
    location: string | undefined;
    country: string | undefined;
    countryCode: string | undefined;
  };
  rating: number | undefined;
  megapixels: number | undefined;
  copyright: string | undefined;
  caption: string | undefined;
  title: string | undefined;
  gps: {
    altitude: string | undefined;
    coordinates: [number, number] | undefined;
    latitudeReference: "N" | "S" | undefined;
    longitudeReference: "E" | "W" | undefined;
    destination: [number, number] | undefined;
  };
  dpi: [number, number] | undefined;
  /**
   * Some meta formats come back with number some with a number component
   * but with useful textual content too. For this reason the type is always converted
   * to a string.
   */
  sharpness: string | undefined;
  /**
   * Example: "99.9m"
   */
  subjectDistance: string | undefined;
};

/**
 * Both categorical meta from ExifTool and Sharp's metadata
 */
export type ICategoricalMetaWithSharp = ICategoricalMeta & ISharpMetadata;

/**
 * A cache reference for an individual image
 */
export type IImageCacheRef<T extends ImageMetaDetail = ImageMetaDetail> = {
  /** the relative path to the file from the project's root */
  file: string;
  modified: epochWithMilliseconds;
  created: epochWithMilliseconds;
  size: number;
  /** the width of the image (received from Sharp's metadata) */
  width: number;
  /** the height of the image (received from Sharp's metadata) */
  height: number;
  /**
   * Metadata properties derived from the **Sharp** tool; this
   * is always available regardless of configured `metaDetailLevel`
   */
  sharpMeta: ISharpMetadata;

  isSourceImage: boolean;
  /** the rule which was responsible for this cache entry */
  rule: string;
  /** reference to the source image for a non-source image */
  from?: string;
  /** the level of detail of metadata for a given image */
  metaDetailLevel: T;

  /** meta data available for given file */
  meta: T extends "categorical"
    ? ICategoricalMeta
    : T extends "tags"
    ? IExifToolMetadata
    : undefined;
};

/**
 * An image cache used by do-devops to efficiently
 * provide meta-data and performing targetted updates
 */
export type IImageCache = {
  source: Record<string, IImageCacheRef>;
  converted: Record<string, IImageCacheRef>;
};

/**
 * The valid files extensions (and corresponding formats) supported by
 * the Sharp image conversion tool.
 */
export type SharpImageFormat = keyof FormatEnum;

/**
 * If set to `true` it will generate a 16x blurred **jpg** image of reasonable quality.
 * If you want more control you should use the object notation.
 */
export type IImagePreBlurConfig =
  | boolean
  | {
      /**
       * If stated it must be a number between 0.3 and 1000, this will make the blur
       * higher quality (but more CPU intensive) than the default settings.
       *
       * Documentation: [Sharp Blur](https://sharp.pixelplumbing.com/api-operation#blur)
       */
      sigma?: number;
      /**
       * The width of the pre-blurred image; by default a width of `16px` will be used.
       */
      size?: number;
      /** the image format to use for blurring; by default JPG is used */
      format?: SharpImageFormat;
    };

/**
 * values are either a number represented as a string
 */
export type ImageTargetSize = { width: number | "original"; height?: number | "original" };

export type ImageAspectStrategy = "cover" | "contain" | "fill" | "inside" | "outside" | "none";

/**
 * The _fit_ strategy when you are changing the aspect ratio.
 *
 * Docs: [Sharp Resize](https://sharp.pixelplumbing.com/api-resize)
 */
export type ImageFitChangingAspect = "cover" | "contain" | "fill";

/**
 * The _fit_ strategy when you are _not_ changing the aspect ratio.
 *
 * Docs: [Sharp Resize](https://sharp.pixelplumbing.com/api-resize)
 */
export type ImageFitUnchangedAspect = "inside" | "outside" | undefined;

type Right = "right" | "right bottom" | "right top";
type Left = "left" | "left bottom" | "left top";

export type ImagePosition = "top" | "bottom" | "centre" | Right | Left;

export type ChromaSubsampling = "4:4:4" | "4:2:0";

export type ColorSpace = keyof ColourspaceEnum;

export interface ImageFormatOptions {
  jpg?: JpegOptions;
  png?: PngOptions;
  webp?: WebpOptions;
  gif?: GifOptions;
  tiff?: TiffOptions;
  avif?: AvifOptions;
  heif?: HeifOptions;
  tile?: TileOptions;
}

// export type MetaDetailLevel = "basic" | "categorical" | "tags";

export type IImageRule = {
  name: string;
  /**
   * The directory which this rule operates on
   */
  source: string;
  /**
   * The directory where the converted files will be placed
   */
  destination: string;
  /**
   * The level of details stored in the cache about image meta-data
   */
  metaDetail: ImageMetaDetail;
  /**
   * glob pattern to pickup images
   */
  glob: string;

  /**
   * The widths of converted images
   */
  widths: number[];

  /**
   * Boolean flag which indicates whether a small, heavily blurred version of
   * the image should be generated. Typically this is used as a starting image
   * that loads almost immediately (potentially even inline to HTML).
   *
   * @default true
   */
  preBlur?: boolean;

  /**
   * Sensible defaults are used as a default and can be overriden at the global
   * level but here you can define these settings at the rule level
   */
  options?: ImageFormatOptions;

  /**
   * By default only JPG, AVIF, and WEBP are output but PNG can be added
   * by setting this flag to `true`
   */
  outputPNG?: boolean;

  /**
   * A rule may state which meta properties it is interested in preserving in
   * the converted images.
   */
  preserveMeta?: Array<keyof WriteTags>;

  /**
   * How much meta information should be captured in images?
   *
   * @default "basic"
   */
  sidecarDetail: "basic" | "categorical";

  /**
   * If you want a copyright tag embedded into images you can
   * state that here and all generated images of this rule will include it.
   */
  copyright?: string;
};

export type IImageFit = ImageFitUnchangedAspect | ImageFitChangingAspect;

export interface IConvertImageOptions {
  size?: number | [number, number];
  aspectRatio?: AspectRatioColon;
  fit?: IImageFit;

  flatten?: boolean;
  /**
   * [Docs](https://sharp.pixelplumbing.com/api-operation#normalise)
   */
  normalize?: boolean;

  /**
   * If left at it's default value of `true` it will create a time-efficient
   * blur effect.
   *
   * For more CPU intensive but higher quality blurs you will need to state
   * the _sigma_ value to use for blurring (a value between 0.3 and 1000).
   *
   * More info here: [Sharp Blur Parameters](https://sharp.pixelplumbing.com/api-operation#blur)
   */
  blur?: number | boolean;

  /**
   * Instructs whether to preserve the source's metadata to the converted files. By
   * default this is set to `false`.
   */
  preserveMetadata?: boolean;

  metadata?: {};

  /**
   * Sharpens the image; default if `false`.
   *
   * [Docs](https://sharp.pixelplumbing.com/api-operation#sharpen)
   */
  sharpen?: {
    sigma?: number;
    flat?: number;
    jagged?: number;
  };

  /**
   * Converts to an 8-bit greyscale; default is `false`.
   */
  grayscale?: boolean;

  /**
   * Sets the output colorspace. [ [docs](https://sharp.pixelplumbing.com/api-colour#tocolorspace) ]
   */
  toColorSpace?: ColorSpace;

  /**
   * Remove alpha channel, if any. This is a no-op if the image does not have an alpha channel.
   */
  removeAlpha?: boolean;

  /**
   * Will auto-rotate the image if the `Orientation` tag in EXIF is present. This will
   * also remove the tag (as the rotation of them image means that tag no long applies).
   *
   * @default true
   */
  autoRotate?: boolean;

  /**
   * Allows images to be tagged with a specific DPI/density; by default this is set to 300dpi.
   */
  printDpi?: number;

  /**
   * Options that are specific to a particular image format
   */
  formatOptions?: ImageFormatOptions;
}

export type IRefreshCacheOptions = {
  /**
   * force the images being passed in to go through a full
   * build and refresh regardless of if images already exist in cache
   */
  force: boolean;
};
