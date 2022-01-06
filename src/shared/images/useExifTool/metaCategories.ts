import { ICategoricalMeta, IExifToolMetadata } from "~/@types/image-types";
import { convertToExifDateTime, reduceFl35 } from "./conversion-tools";

/**
 * Reduces massive tag set found in certain files to more of the
 * "core essentials".
 */
export function metaReducer(meta: IExifToolMetadata): ICategoricalMeta {
  const populated = Object.keys(meta).filter((i) => i);

  const make = [meta.DeviceManufacturer, meta.CameraID, meta.Make, meta.VendorID]
    .filter((i) => i)
    .pop();

  const model = [
    meta.Model,
    meta.ModelAndVersion,
    meta.CameraModel,
    meta.CameraModelID,
    meta.CameraType,
    meta.SonyModelID,
    meta.CanonModelID,
    meta.KodakModel,
    meta.RicohModel,
    meta.CameraModel,
    meta.CameraModelID,
    meta.DeviceModelDesc,
    meta.GEModel,
    meta.PentaxModelID,
    meta.MinoltaModelID,
    meta.SamsungModelID,
    meta.UniqueCameraModel,
  ]
    .filter((i) => i)
    .pop();

  const color = [
    meta.ProfileDescription,
    meta.ICCProfileName,
    meta.DeviceModel,
    meta.Look?.name ? String(meta.Look?.name) : undefined,
  ]
    .filter((i) => i)
    .pop();

  const software = [meta.Software, meta.CameraSoftware].filter((i) => i).pop();

  const shutterSpeed = [
    meta.ShutterSpeed,
    meta.ShutterSpeedValue,
    meta.Shutter,
    meta.SpeedX,
    meta.SpeedY,
    meta.SpeedZ,
  ]
    .filter((i) => i)
    .pop();

  const iso = [
    meta.ISO,
    meta.ISO2,
    meta.ISOSetting,
    meta.ISOSpeed,
    meta.ISOValue,
    meta.SonyISO,
    meta.BaseISO,
    meta.SvISOSetting,
    meta.BaseISO,
  ]
    .filter((i) => i)
    .pop();

  const createDate = convertToExifDateTime(
    [
      meta.DateAcquired,
      meta.DateTime,
      meta.DateTime1,
      meta.DateTimeCreated,
      meta.DateTimeDigitized,
      meta.DateTimeOriginal,
      meta.GPSDateTime,
      meta.SonyDateTime,
      meta.PanasonicDateTime,
      meta.RicohDate,
      meta.DateCreated,
      meta.Date,
    ]
      .filter((i) => i)
      .pop()
  );

  const modifyDate = convertToExifDateTime(
    [meta.ModifyDate, meta.ModificationDate].filter((i) => i).pop()
  );

  const height = [
    meta.ImageHeight,
    meta.RawImageHeight,
    meta.ExifImageHeight,
    meta.SonyImageHeight,
    meta.EpsonImageHeight,
    meta.SourceImageHeight,
    meta.CanonImageHeight,
    meta.KodakImageHeight,
    meta.RicohImageHeight,
    meta.OlympusImageHeight,
    meta.PanoramaFullHeight,
    meta.PanasonicImageHeight,
    meta.RawImageFullHeight,
  ]
    .filter((i) => i)
    .pop();

  const width = [
    meta.ImageWidth,
    meta.ExifImageWidth,
    meta.RawImageWidth,
    meta.SonyImageWidth,
    meta.SourceImageWidth,
    meta.CanonImageWidth,
    meta.KodakImageWidth,
    meta.RicohImageWidth,
    meta.OlympusImageWidth,
    meta.PanasonicImageWidth,
    meta.PanoramaFullWidth,
    meta.RawImageFullWidth,
  ]
    .filter((i) => i)
    .pop();

  const aperture = [meta.Aperture, meta.ApertureSetting].filter((i) => i).pop();

  const lens = [meta.LensID, meta.Lens, meta.LensInfo, meta.LensModel].filter((i) => i).pop();
  const lensMake = [meta.LensMake, meta.KodakMake].filter((i) => i).pop();

  const focalLength = [meta.FocalLength, [meta.FocalType, meta.FocalUnits].join("")]
    .filter((i) => i)
    .pop();

  const focalLength35 = [meta.FocalLengthIn35mmFormat, reduceFl35(meta.FocalLength35efl)]
    .filter((i) => i)
    .pop()
    ?.trim();

  const exposureProgram = [meta.ExposureProgram, meta.AEProgramMode].filter((i) => i).pop();
  const bracketing = meta.BracketProgram;

  const exposureMode = [meta.ExposureMode].filter((i) => i).pop();
  const exposureBias = [meta.Exposure, meta.ExposureCompensation, meta.ExposureBracketValue]
    .filter((i) => i)
    .pop();
  const meteringMode = [meta.MeterMode, meta.Metering].filter((i) => i).pop();
  const flash = [
    meta.Flash,
    meta.FlashAction,
    meta.FlashFunction,
    meta.FlashControl,
    meta.FlashFired,
  ]
    .filter((i) => i)
    .pop();
  const flashCompensation = [meta.FlashCompensation, meta.FlashBias].filter((i) => i).pop();
  const brightness = [meta.Brightness, meta.BrightnessValue].filter((i) => i).pop();
  const scene = [
    meta.Scene,
    meta.SceneAssist,
    meta.SceneCaptureType,
    meta.SceneMode,
    meta.SceneModeUsed,
    `${String(meta.SceneDetect)} scene id`,
  ]
    .filter((i) => i)
    .pop();
  const subjectDistance = meta.SubjectDistance;
  const sharpness = String(
    [meta.Sharpness, meta.SharpnessFactor, meta.SharpnessSetting, meta.SharpnessRange]
      .filter((i) => i)
      .pop()
  );

  const dpi: [number, number] | undefined =
    meta.XResolution && meta.YResolution ? [meta.XResolution, meta.YResolution] : undefined;

  const gps: ICategoricalMeta["gps"] = {
    altitude: [meta.GPSAltitude ? String(meta.GPSAltitude) : undefined, meta.Altitude]
      .filter((i) => i)
      .pop(),
    coordinates: [[meta.GPSLatitude, meta.GPSLongitude], meta.GPSCoordinates]
      .filter((i) => i)
      .pop() as [number, number] | undefined,
    latitudeReference: meta.GPSLatitudeRef?.toUpperCase() as "N" | "S" | undefined,
    longitudeReference: meta.GPSLongitudeRef?.toUpperCase() as "E" | "W" | undefined,
    destination:
      meta.GPSDestLatitude && meta.GPSDestLongitude
        ? ([Number(meta.GPSDestLatitude || 0), Number(meta.GPSDestLongitude || 0)] as [number, number])
        : undefined,
  };

  const title: string | undefined = [meta.Title, meta.XPTitle, meta["By-lineTitle"]]
    .filter((i) => i)
    .pop();
  const caption = [meta["Caption-Abstract"], meta.LocalCaption, meta.CanonFileDescription]
    .filter((i) => i)
    .pop();

  const copyright = [meta.Copyright, meta.CopyrightNotice].filter((i) => i).pop();

  const megapixels = meta.Megapixels;

  const rating = [meta.Rating, meta.RatingPercent].filter((i) => i).pop();
  const subject = [meta.Subject?.pop(), meta.SubjectReference].filter((i) => i).pop();

  const location = {
    city: meta.City,
    state: meta.State,
    location: meta.LocationName,
    country: meta.country ? String(meta.country) : undefined,
    countryCode: meta.CountryCode,
  };

  return {
    populated,
    make,
    model,
    color,
    shutterSpeed,
    iso,
    createDate,
    modifyDate,
    height,
    width,
    software,
    aperture,
    lens,
    lensMake,
    focalLength,
    focalLength35,
    exposureMode,
    exposureBias,
    flash,
    flashCompensation,
    brightness,
    scene,
    subject,
    subjectDistance,
    sharpness,
    dpi,
    gps,
    title,
    caption,
    copyright,
    megapixels,
    rating,
    exposureProgram,
    bracketing,
    location,
    meteringMode,
    errors: meta.errors || [],
  };
}
