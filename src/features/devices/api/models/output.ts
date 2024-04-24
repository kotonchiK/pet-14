export type Device = {
  userId:string
  deviceId:string
  ip:string
  title:string
  lastActiveDate:Date
}

export type Sessions = {
  deviceId:string,
  ip:string,
  title:string,
  lastActiveDate:Date
}