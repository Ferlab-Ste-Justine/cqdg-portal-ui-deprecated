// @flow
import filesize from 'filesize';

export enum EFileInputType {
  B = 'b',
  KB = 'kb',
  MB = 'mb',
}

export type TFilesizeInput = (input?: number, options?: object, inputType?: EFileInputType) => void;
export type TConvertFileSize = (input: number, inputType: EFileInputType) => number;

const convertInputBase: TConvertFileSize = (input, inputType) => {
  const baseConversion = 1000;

  switch (inputType) {
    case EFileInputType.MB:
      return input * (baseConversion ** 2);
    case EFileInputType.KB:
      return input * baseConversion;
    default:
      return input;
  }
};

const FilesizeInput: TFilesizeInput = (input = 0, options, inputType = EFileInputType.B) => {
  const newInput = convertInputBase(input, inputType);
  return filesize(newInput || 0, {
    base: 10,
    ...options,
  }).toUpperCase();
};

export default FilesizeInput;
