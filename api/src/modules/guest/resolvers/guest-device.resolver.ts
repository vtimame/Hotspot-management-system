import {
  Field,
  ObjectType,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GuestDevice } from '../entities/guest-device';
import * as UAParser from 'ua-parser-js';

@ObjectType()
export class GuestDeviceBrowser {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  version?: string;
}

@ObjectType()
export class GuestDeviceEngine {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  version?: string;
}

@ObjectType()
export class GuestDeviceOS {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  version?: string;
}

@ObjectType()
export class GuestDeviceVendorInfo {
  @Field({ nullable: true })
  model?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  vendor?: string;
}

@ObjectType()
export class GuestDeviceCPU {
  @Field({ nullable: true })
  architecture?: string;
}

@ObjectType()
export class GuestDeviceInfo {
  @Field(() => GuestDeviceBrowser, { nullable: true })
  browser?: GuestDeviceBrowser;

  @Field(() => GuestDeviceEngine, { nullable: true })
  engine?: GuestDeviceEngine;

  @Field(() => GuestDeviceOS, { nullable: true })
  os?: GuestDeviceOS;

  @Field(() => GuestDeviceVendorInfo, { nullable: true })
  device?: GuestDeviceVendorInfo;

  @Field(() => GuestDeviceCPU, { nullable: true })
  cpu?: GuestDeviceCPU;
}

@Resolver(() => GuestDevice)
export class GuestDeviceResolver {
  @ResolveField(() => GuestDeviceInfo, { nullable: true })
  async ua(@Parent() device: GuestDevice): Promise<GuestDeviceInfo> {
    const ua = new UAParser(device.userAgent);
    return ua.getResult();
  }
}
