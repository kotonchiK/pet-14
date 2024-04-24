export type RefreshModel = {
  userId:string
  ip:string | undefined
  deviceId:string
}

export type refreshJwtModel = {
  userId:number
  ip:string
  deviceId:string
}

export type DeleteDeviceModel = {
  id:string
  requestId:string
  userId:string
}

export type CreateTokenModel = {
  userId:number
  ip:string
  title:string
}

export type ReqRefData = {
  userId: number
  deviceId: string
}

export type DecodedRefreshToken = {
  userId: number
  deviceId: string
  iat:Date
}

export type TokensTypes = {
  access:string
  refresh:string
}