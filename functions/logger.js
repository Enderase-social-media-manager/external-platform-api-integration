import moment from 'moment'
 

export const logger = (req,res,next)=>{

    console.log(`${res.statusCode} ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}  ${moment().format()}}`)
    next()

}