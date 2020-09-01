import db from "../database/connection";
import convertHoursToMinutes from "../utils/convertHoursToMinutes";
import { Request, Response } from "express";

interface ScheduleItem{
    week_day:number;
    from: string;
    to: string;
}


export default class ClassController {
    async create(req: Request, res: Response){
    
        const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body;
        const trx = await db.transaction();
      
        try {
          const insertedsUSersIds = await trx('users').insert({
              name,
              avatar,
              whatsapp,
              bio
          });
          const user_id = insertedsUSersIds[0];
          const insertedsClassesIDs = await trx('classes').insert({
              subject,
              cost,
              user_id
          })
        
          const class_id = insertedsClassesIDs[0];
          
          const classSchedule = schedule.map((scheduleItem: ScheduleItem)=>{
            return {
                class_id,
                week_day:scheduleItem.week_day,
                from: convertHoursToMinutes(scheduleItem.from),
                to: convertHoursToMinutes(scheduleItem.to),
            }
          })
        
          await trx('class_schedule').insert(classSchedule);
        
          await trx.commit();
        
          return res.status(201).send();
        } catch (error) {
            await trx.rollback();
            return res.status(400).json({
                error: "Error durante a criação da classe"
            })
        }
      }

    
}