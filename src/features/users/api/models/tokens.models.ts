export type RefreshModel = {
  userId:string
  ip:string | undefined
  deviceId:string
}

export type refreshJwtModel = {
  userId:string
  ip:string
  deviceId:string
}

export type DeleteDeviceModel = {
  id:string
  requestId:string
  userId:string
}

export type CreateTokenModel = {
  userId:string
  ip:string
  title:string
}

export type ReqRefData = {
  userId: string
  deviceId: string
}

export type DecodedRefreshToken = {
  userId: string
  deviceId: string
  iat:Date
}

export type TokensTypes = {
  access:string
  refresh:string
}