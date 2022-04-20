import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    REACT_APP_NAME: Joi.string().description('application name').default('tesalate'),
    REACT_APP_BUILD_ENVIRONMENT: Joi.string().valid('production', 'development', 'test').required(),
    REACT_APP_API_URL: Joi.string().default('http://localhost:4400'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  appName: envVars.REACT_APP_NAME,
  env: envVars.REACT_APP_BUILD_ENVIRONMENT,
  apiUrl: envVars.REACT_APP_API_URL,
};
