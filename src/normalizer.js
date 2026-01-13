import { CONVERTERS } from './converters.js';
import { ValidationError } from './errors.js';

/**
 * @typedef {import('./converters.js').ConverterFunction} ConverterFunction
 */

/**
 * @typedef {Object} ParamSpec
 * @property {boolean} [required] - Whether the parameter is required
 * @property {string|string[]} target - Target parameter name(s) in the API payload
 * @property {string} [converter] - Name of converter function to use
 * @property {*} [default] - Default value if not provided
 * @property {number} [min] - Minimum value for numbers
 * @property {number} [max] - Maximum value for numbers
 * @property {number} [minLength] - Minimum length for strings
 * @property {number} [maxLength] - Maximum length for strings
 * @property {number} [minItems] - Minimum items for arrays
 * @property {number} [maxItems] - Maximum items for arrays
 * @property {string[]} [allowedValues] - List of allowed values
 * @property {string[]} [conflictsWith] - Parameters that conflict with this one
 */

/**
 * @typedef {Object} ModelConfig
 * @property {'centralized'|'subdomain'} type - API type
 * @property {string} [subdomain] - Subdomain for subdomain-type APIs
 * @property {string} endpoint - API endpoint path
 * @property {number} [timeout] - Request timeout in ms
 * @property {Record<string, ParamSpec>} params - Parameter specifications
 */

/**
 * @typedef {Record<string, ModelConfig>} ModelConfigs
 */

/**
 * @typedef {Record<string, string>} ModelAliases
 */

/**
 * @typedef {Object} NormalizeResult
 * @property {ModelConfig} config - The model configuration
 * @property {Record<string, *>} payload - The normalized API payload
 * @property {string} resolvedModel - The resolved model ID (after alias resolution)
 */

/**
 * @typedef {Object} AsyncTask
 * @property {string} paramName - Parameter name
 * @property {ParamSpec} spec - Parameter specification
 * @property {*} value - Parameter value
 * @property {ConverterFunction} converter - Converter function
 */

/**
 * Resolve model ID from alias
 * @param {string} modelId - The model ID or alias
 * @param {ModelAliases} aliases - Map of aliases to model IDs
 * @returns {string} The resolved model ID
 */
export function resolveModelAlias(modelId, aliases) {
  return aliases[modelId] || modelId;
}

/**
 * Normalize user parameters to model-specific format
 * @param {string} modelId - Model identifier or alias
 * @param {Record<string, *>} userParams - User-provided parameters
 * @param {ModelConfigs} modelConfigs - Model configuration object
 * @param {ModelAliases} [aliases] - Model aliases
 * @returns {Promise<NormalizeResult>} Normalized result with config, payload, and resolved model
 * @throws {Error} If model is unknown
 * @throws {ValidationError} If parameters are invalid
 */
export async function normalizeParams(modelId, userParams, modelConfigs, aliases = {}) {
  // Resolve alias
  const resolvedModel = resolveModelAlias(modelId, aliases);
  const config = modelConfigs[resolvedModel];
  
  if (!config) {
    const availableModels = Object.keys(modelConfigs).join(', ');
    throw new Error(
      `Unknown model: "${modelId}". ` +
      `Available models: ${availableModels}. ` +
      `Use invoke() for custom chutes.`
    );
  }
  
  /** @type {string[]} */
  const errors = [];
  /** @type {Record<string, *>} */
  const result = {};
  /** @type {Set<string>} */
  const processedParams = new Set();
  /** @type {AsyncTask[]} */
  const asyncTasks = [];
  
  // Track which params user provided
  /** @type {Set<string>} */
  const providedParams = new Set(Object.keys(userParams));
  
  // Check for conflicting params
  for (const [paramName, spec] of Object.entries(config.params)) {
    if (spec.conflictsWith && providedParams.has(paramName)) {
      for (const conflicting of spec.conflictsWith) {
        if (providedParams.has(conflicting)) {
          errors.push(`Cannot use both "${paramName}" and "${conflicting}" - they conflict`);
        }
      }
    }
  }
  
  // Check required params
  for (const [paramName, spec] of Object.entries(config.params)) {
    if (spec.required && !providedParams.has(paramName)) {
      errors.push(`Missing required parameter: "${paramName}"`);
    }
  }
  
  // Process each user param
  for (const [paramName, value] of Object.entries(userParams)) {
    // Skip model param (handled separately)
    if (paramName === 'model') continue;
    
    const spec = config.params[paramName];
    
    if (!spec) {
      errors.push(`Parameter "${paramName}" is not supported by model "${resolvedModel}"`);
      continue;
    }
    
    processedParams.add(paramName);
    
    // Validate allowed values (only for non-converter params)
    if (spec.allowedValues && !spec.converter) {
      if (!spec.allowedValues.includes(value)) {
        errors.push(`"${paramName}" must be one of: ${spec.allowedValues.join(', ')}`);
        continue;
      }
    }
    
    // Validate bounds
    if (spec.min !== undefined && typeof value === 'number' && value < spec.min) {
      errors.push(`"${paramName}" must be >= ${spec.min} (got ${value})`);
    }
    if (spec.max !== undefined && typeof value === 'number' && value > spec.max) {
      errors.push(`"${paramName}" must be <= ${spec.max} (got ${value})`);
    }
    if (spec.minLength !== undefined && typeof value === 'string' && value.length < spec.minLength) {
      errors.push(`"${paramName}" must be at least ${spec.minLength} characters`);
    }
    if (spec.maxLength !== undefined && typeof value === 'string' && value.length > spec.maxLength) {
      errors.push(`"${paramName}" must be at most ${spec.maxLength} characters`);
    }
    
    // Validate array item counts
    if (spec.minItems !== undefined || spec.maxItems !== undefined) {
      const arr = Array.isArray(value) ? value : [value];
      if (spec.minItems !== undefined && arr.length < spec.minItems) {
        errors.push(`"${paramName}" requires at least ${spec.minItems} items (got ${arr.length})`);
      }
      if (spec.maxItems !== undefined && arr.length > spec.maxItems) {
        errors.push(`"${paramName}" allows at most ${spec.maxItems} items (got ${arr.length})`);
      }
    }
    
    // Apply converter if needed
    if (spec.converter) {
      const converter = CONVERTERS[spec.converter];
      if (!converter) {
        errors.push(`Unknown converter: ${spec.converter}`);
        continue;
      }
      
      // Check if converter is async
      const isAsyncConverter = spec.converter === 'normalizeImage' || spec.converter === 'normalizeImages';
      
      if (isAsyncConverter) {
        // Queue async conversion
        asyncTasks.push({
          paramName,
          spec,
          value,
          converter
        });
      } else {
        // Sync converter
        try {
          const converted = converter(value, userParams.fps);
          
          if (Array.isArray(spec.target)) {
            // Converter returns object with multiple keys
            Object.assign(result, converted);
          } else {
            result[spec.target] = converted;
          }
        } catch (err) {
          errors.push(/** @type {Error} */ (err).message);
        }
      }
    } else {
      // Direct mapping - target must be a string here (not array)
      const targetKey = /** @type {string} */ (spec.target);
      result[targetKey] = value;
    }
  }
  
  // Apply defaults for unspecified params
  for (const [paramName, spec] of Object.entries(config.params)) {
    if (!processedParams.has(paramName) && spec.default !== undefined) {
      // Skip if this param conflicts with a provided param
      const hasConflict = spec.conflictsWith?.some(c => processedParams.has(c));
      if (!hasConflict) {
        // Check if target is already set (e.g., from aspectRatio converter)
        const targetKey = Array.isArray(spec.target) ? spec.target[0] : spec.target;
        if (!(targetKey in result)) {
          if (Array.isArray(spec.target)) {
            // For multi-target defaults, don't apply - let model use its own defaults
            // This avoids applying width/height when aspectRatio is used
          } else {
            result[spec.target] = spec.default;
          }
        }
      }
    }
  }
  
  // Throw if any validation errors before async work
  if (errors.length > 0) {
    throw new ValidationError(resolvedModel, errors);
  }
  
  // Process async converters
  for (const task of asyncTasks) {
    try {
      const converted = await task.converter(task.value);
      // Async converters always have a single string target
      const targetKey = /** @type {string} */ (task.spec.target);
      result[targetKey] = converted;
    } catch (err) {
      throw new ValidationError(resolvedModel, [/** @type {Error} */ (err).message]);
    }
  }
  
  return {
    config,
    payload: result,
    resolvedModel
  };
}

/**
 * Build URL from model config
 * @param {ModelConfig} config - Model configuration
 * @param {string} [imageBaseUrl] - Base URL for centralized image API
 * @returns {string} The constructed URL
 */
export function buildUrl(config, imageBaseUrl = 'https://image.chutes.ai') {
  if (config.type === 'centralized') {
    return `${imageBaseUrl}${config.endpoint}`;
  } else {
    return `https://${config.subdomain}.chutes.ai${config.endpoint}`;
  }
}
