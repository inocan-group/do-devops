import { AspectRatioColon } from "common-types";
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
import { ExifDateTime, Tags } from "exiftool-vendored";

export type MetaDataDetail = "basic" | "categorical" | "all";

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

export type ExifTagsPlusMissing<T extends {} = {}> = Omit<Tags, "CreatorContactInfo"> & {
  /** this breaks out the generic "Struct" which ExifTools provides */
  CreatorContactInfo: IptcCreatorContactInfo;
  [key: string]: unknown;
} & T;

/** metadata provided by **Sharp** but excluding the properties which return _buffers_ */
export type ISharpMetadata = Exclude<Metadata, SharpBufferProperties> & {
  metaDetailLevel: "basic";
};

export type IExifToolMeta = Tags &
  Omit<ISharpMetadata, "metaDetailLevel"> & { metaDetailLevel: "tags" };

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
export type ICategoricalMetaWithSharp = ICategoricalMeta &
  Omit<ISharpMetadata, "metaDetailLevel"> & { metaDetailLevel: "categorical" };

export type IAllImageMeta = Omit<IExifToolMeta, "metaDetailLevel"> & {
  metaDetailLevel: "all";
} & Omit<ICategoricalMeta, "metaDetailLevel">;

/**
 * Some metadata from **Sharp** and **ExifTool** is always provided but the level of detail
 * can depend. Levels which exist are:
 *
 * - `basic` - just the meta provided by sharp (this base is ALWAYS available)
 * - `categorical` - a downsampling of meta tags from ExifTool into useful categories (plus Sharp's base info); this is tyically the most useful for _providing_ meta insight but loses resolution if writing because the precise tags are not present. Though note, it provides a property called `populated` which indicates all tags which were present in image.
 * - `tags` - provides sharp's base plus ALL tags that ExifTool produces
 * - `all` - provides sharp's base, all ExifTool tags, and categories on property "categories"
 * (to avoid namespace collisions)
 */
export type ImageMetadata =
  | ICategoricalMetaWithSharp
  | ISharpMetadata
  | IExifToolMeta
  | IAllImageMeta;

/**
 * A cache reference for an individual image
 */
export type IImageCacheRef = {
  file: string;
  updated: Date;
  created: Date;
  size: number;
  isSourceImage: boolean;
  /** reference to the source image for a non-source image */
  from?: string;
  /** the level of detail of metadata for a given image */
  metaDetailLevel?: "basic" | "catories" | "all";

  /** meta data available for given file */
  meta: ImageMetadata;
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

export type IImageQuality = {
  jpg?: number;
  webp?: number;
  avif?: number;
};

type IImageBaseRule = {
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
   * Flag indicating whether the rule will follow into subdirs
   */
  subDirs: boolean;

  /**
   * Image formats to convert to
   */
  formats: SharpImageFormat[];
  /**
   * Files to be excluded from this rule. Filenames can be full filenames
   * or partials.
   */
  exclude?: string[];

  /**
   * File names (including partials) which must be matched
   */
  include?: string[];

  /**
   * Specifies the sizes of images to be generated; width must specified but
   * height is optional. If height is _not_ specified the current aspect-ratio
   * will be used.
   */
  sizes: ImageTargetSize[];

  /**
   * When converting to images that support progressive loading, this flag indicates
   * whether this feature should be turned on.
   *
   * @default true
   */
  progressive?: boolean;

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
  quality?: IImageQuality;

  /**
   * By default it preserves EXIF and IPTC metadata but if you would like this stripped out
   * you can state this.
   */
  preserveMeta?: boolean;

  /**
   * If you want a copyright tag embedded into images you can
   * state that here and all generated images of this rule will include that.
   *
   * **Note:** this will be added to the EXIF metadata; in the future it would
   * be nice to get this into IPTC and XMP.
   */
  copyright?: string;
};

export type IFixedAspectRatio = IImageBaseRule & {
  aspectRatio: `${number}:${number}`;
  fit: ImageFitChangingAspect;
  /** defaults to `Centre` position but you can override */
  position?: ImagePosition;
};

export type IUnchangedAspectRatio = IImageBaseRule & {
  fit?: ImageFitUnchangedAspect;
  aspectRatio?: undefined;
};

export type IImageFit = ImageFitUnchangedAspect | ImageFitChangingAspect;

export type IImageRule = IFixedAspectRatio | IUnchangedAspectRatio;

export interface IPreBlurOptions {
  /** the width of the blurred image; aspect-ratio is maintained */
  size?: number;
  /**
   * The image format used for blurred image; default is `jpg`.
   */
  format?: SharpImageFormat;
  /**
   * If left at it's default value of `true` it will create a time-efficient
   * blur effect.
   *
   * For more CPU intensive but higher quality blurs you will need to state
   * the _sigma_ value to use for blurring (a value between 0.3 and 1000).
   *
   * More info here: [Sharp Blur Parameters](https://sharp.pixelplumbing.com/api-operation#blur)
   */
  blur?: true | number;

  /**
   * If turned on it it will
   */
  removeAlpha?: boolean;
}

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
