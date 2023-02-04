import React from 'react';
import Moment from 'react-moment';

export const cToF = (temp: number): number => (temp * 9) / 5 + 32;

export const msToTime = (duration: number): string => {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  let hoursString = hours < 10 ? '0' + hours : hours;
  let minutesString = minutes < 10 ? '0' + minutes : minutes;
  let secondsString = seconds < 10 ? '0' + seconds : seconds;

  return hoursString + ':' + minutesString + ':' + secondsString;
};

export const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(' ');
};

export const timeConversion = (duration: number): string => {
  const portions: string[] = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + 'h');
    duration = duration - hours * msInHour;
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + 'm');
    duration = duration - minutes * msInMinute;
  }

  const seconds = Math.trunc(duration / 1000);
  if (seconds > 0) {
    portions.push(seconds + 's');
  }

  return portions.length > 0 ? portions.join(' ') : '0s';
};
export const truncateTwoDecimals = (number: any) => {
  let num = number,
    rounded = null;
  let with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  rounded = parseFloat(with2Decimals)?.toFixed(2);
  return rounded;
};

export const convertTitle = (data: Record<any, any>) => {
  switch (data.displayType) {
    case 'date':
      return <Moment format="MM/DD/YY HH:mm:ss">{data.value}</Moment>;

    case 'duration':
      return timeConversion(data.value);

    case 'bool':
      return data.value ? 'yes' : 'no';

    case 'degrees':
      return cToF(data.value);

    default:
      return data.value;
  }
};

export const objArrToSortByString = (arr: { id: string; desc: boolean }[]) => {
  return arr.reduce((acc, curr, idx) => {
    const needsComma = idx !== arr.length - 1 && arr.length > 1;
    const string = `${curr.id}:${curr.desc ? 'desc' : 'asc'}`;
    return (acc += needsComma ? `${string},` : string);
  }, '');
};

export const objectIdToCreationDate = (objId: string): Date => {
  return new Date(parseInt(objId.toString().slice(0, 8), 16) * 1000);
};
