// src/core/exceptions.ts
export class StaleObjectStateException extends Error {
  constructor(message = 'Concurrent report resolution conflict') {
    super(message);
    this.name = 'StaleObjectStateException';
  }
}

export class DomainIntegrityException extends Error {
  constructor(message = 'Domain integrity violation') {
    super(message);
    this.name = 'DomainIntegrityException';
  }
}

export class QuotaServiceUnreachableException extends Error {
  constructor(message = 'Quota service unreachable') {
    super(message);
    this.name = 'QuotaServiceUnreachableException';
  }
}

export class InvalidDomainFormatException extends Error {
  constructor(message = 'Invalid domain format') {
    super(message);
    this.name = 'InvalidDomainFormatException';
  }
}
