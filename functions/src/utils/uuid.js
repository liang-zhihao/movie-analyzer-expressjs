import { Snowflake } from "nodejs-snowflake";
const snowflake = new Snowflake();
export const genUUID = () => snowflake.getUniqueID();
