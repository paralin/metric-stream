import { definitions } from './definitions';
import * as ProtoBuf from 'protobufjs';

export const builder = ProtoBuf.loadJson(JSON.stringify(definitions));
