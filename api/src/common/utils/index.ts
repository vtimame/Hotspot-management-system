import { BadRequestException, NotFoundException } from '@nestjs/common';

const parsePhoneNumber = (phone: string, withException = true): string => {
  if (phone.length === 10) {
    return phone;
  } else if (
    (phone.startsWith('+') && phone.length === 12) ||
    (phone.startsWith('7') && phone.length === 11) ||
    (phone.startsWith('8') && phone.length === 11)
  ) {
    return phone.slice(-10);
  } else {
    if (withException) {
      throw new BadRequestException('Incorrect phone number!');
    } else {
      return '';
    }
  }
};

const isEmail = (string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(string).toLowerCase());
};

const checkAffected = async (
  affected: number,
  message: string,
): Promise<void> => {
  if (!affected || affected === 0) {
    throw new NotFoundException(message);
  }
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateUserPassword = (): number => {
  return randomInt(100000, 999999);
};

export {
  parsePhoneNumber,
  checkAffected,
  randomInt,
  generateUserPassword,
  isEmail,
};
