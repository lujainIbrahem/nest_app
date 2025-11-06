import EventEmitter from "events"
import { emailTemplate, sendEmail } from "src/common"
import { UserOtp } from "src/common/enums"


export const eventEmitter= new EventEmitter()

 eventEmitter.on(UserOtp.confirmEmail,async(data)=>{
  const { email,otp } = data
  await sendEmail({
    to:email,
    subject:UserOtp.confirmEmail,
    html:emailTemplate(otp)
  })

 })


 
 eventEmitter.on(UserOtp.forgetPassword,async(data)=>{
  const { email,otp } = data
  await sendEmail({
    to:email,
    subject:UserOtp.forgetPassword,
    html:emailTemplate(otp)
  })

 })