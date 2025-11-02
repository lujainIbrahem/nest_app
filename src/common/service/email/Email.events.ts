import { EventEmitter } from "events"
import { sendEmail } from "./sendEmail"
import { emailTemplate } from "./templateEmail"
import { UserOtp } from "src/common/enums"


export const eventEmiiter = new EventEmitter()

 eventEmiiter.on(UserOtp.confirmEmail,async(data)=>{
  const { email,otp } = data
  await sendEmail({
    to:email,
    subject:UserOtp.confirmEmail,
    html:emailTemplate(otp)
  })

 })


 
 eventEmiiter.on(UserOtp.forgetPassword,async(data)=>{
  const { email,otp } = data
  await sendEmail({
    to:email,
    subject:UserOtp.forgetPassword,
    html:emailTemplate(otp)
  })

 })