export const ERRORS = {
    GENERAL: {
        CANNOT_FIND_CONFIG_FILE: {
            message: 'prosopo.config.js / prosopo.config.ts cannot be found.'
        },
        JSON_LOAD_FAILED: {
            message: 'Failed to load JSON file'
        },
        ASSERT_ERROR: {
            message: 'AssertionError'
        }
    },
    CONFIG: {
        UNKNOWN_ENVIRONMENT: {
            message: 'Unknown environment requested'
        }
    },
    DATABASE: {
        DATABASE_IMPORT_FAILED: {
            message: 'Failed to import database engine'
        },
        DATABASE_UNDEFINED: {
            message: 'Database client is not connected'
        },
        COLLECTION_UNDEFINED: {
            message: 'Database collection is not available'
        },
        DATASET_LOAD_FAILED: {
            message: 'Data set load failed'
        },
        DATASET_GET_FAILED: {
            message: 'Failed to get dataset'
        },
        CAPTCHA_GET_FAILED: {
            message: 'Failed to get captcha'
        },
        NO_CAPTCHAS_FOUND: {
            message: 'No captcha matching datasetId'
        },
        PENDING_RECORD_NOT_FOUND: {
            message: 'No pending record found'
        }
    },
    API: {
        BODY_UNDEFINED: {
            message: 'Body must be defined in API POST call'
        },
        PARAMETER_UNDEFINED: {
            message: 'Parameters must be defined in API POST call'
        },
        CAPTCHA_FAILED: {
            message: 'You answered one or more captchas incorrectly. Please try again'
        },
        CAPTCHA_PASSED: {
            message: 'You correctly answered the captchas'
        },
        BAD_REQUEST: {
            message: 'BadRequest'
        }

    },
    CONTRACT: {
        INVALID_METHOD: {
            message: 'Invalid contract method'
        },
        TX_ERROR: {
            message: 'Error making tx'
        },
        INVALID_ADDRESS: {
            message: 'Failed to encode invalid address'
        },
        INVALID_STORAGE_NAME: {
            message: 'Failed to find given storage name'
        },
        CAPTCHA_SOLUTION_COMMITMENT_DOES_NOT_EXIST: {
            message: 'Captcha solution commitment does not exist'
        },
        DAPP_NOT_ACTIVE: {
            message: 'Dapp is not active'
        },
        CONTRACT_UNDEFINED: {
            message: 'Contract undefined'
        }
    },
    CLI: {
        PARAMETER_ERROR: {
            message: 'Invalid parameter'
        }
    },
    DATASET: {
        PARSE_ERROR: {
            message: 'error parsing dataset'
        },
        HASH_ERROR: {
            message: 'error hashing dataset'
        }
    },
    CAPTCHA: {
        PARSE_ERROR: {
            message: 'error parsing captcha'
        },
        INVALID_CAPTCHA_ID: {
            message: 'invalid captcha id'
        }
    }
}

export class GeneralError extends Error {
    constructor (message) {
        super()
        this.message = message
    }

    getCode () {
        if (this instanceof BadRequest) {
            return 400
        }
        if (this instanceof NotFound) {
            return 404
        }
        return 500
    }
}

export class BadRequest extends GeneralError {
}

export class NotFound extends GeneralError {
}
