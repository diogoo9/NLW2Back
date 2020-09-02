import db from "../database/connection";
import convertHoursToMinutes from "../utils/convertHoursToMinutes";
import { Request, Response, response } from "express";

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

interface ClassFilter {
  subject: string;
  week_day: string;
  time: string;
}
export default class ClassController {
  async index(req: Request, res: Response) {
    const filters = req.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    if (!filters.subject || !filters.week_day || !filters.time) {
      res.status(400).json({
        error: "Está faltando os  filtros",
      });
    }

    const timeInMinutes = convertHoursToMinutes(time);
    const classes = await db("classes")
    .whereExists(function(){
      this.select('class_schedule.*')
      .from('class_schedule')
      .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
      .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
      .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
      .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
    })
    .where("classes.subject", "=", subject)
    .join('users','classes.user_id','=','users.id')
    .select(['classes.*', 'users.*']);

    res.send(classes);
  }



  async create(req: Request, res: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body;
    const trx = await db.transaction();

    try {
      const insertedsUSersIds = await trx("users").insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
      const user_id = insertedsUSersIds[0];
      const insertedsClassesIDs = await trx("classes").insert({
        subject,
        cost,
        user_id,
      });

      const class_id = insertedsClassesIDs[0];

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHoursToMinutes(scheduleItem.from),
          to: convertHoursToMinutes(scheduleItem.to),
        };
      });

      await trx("class_schedule").insert(classSchedule);

      await trx.commit();

      return res.status(201).send();
    } catch (error) {
      await trx.rollback();
      return res.status(400).json({
        error: "Error durante a criação da classe",
      });
    }
  }
}
